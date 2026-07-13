"use strict";

import {
  buildRateLimitHeaders,
  enforceRateLimit,
  getApiSecurityHeaders,
  getClientIp,
  hasSafeRequestOrigin,
  isRequestBodyTooLargeError,
  isRequestBodyTooLarge,
  parseRequestPayload,
  verifyTurnstileToken,
} from "../_lib/security.js";
import { sendOperationalNotification } from "../_lib/notifications.js";
import {
  cleanupExpiredInquiryData,
  ensureInquiryRetention,
} from "../_lib/data-retention.js";

const json = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    status: init.status || 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...getApiSecurityHeaders(),
      ...(init.headers || {}),
    },
  });

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ");

const looksSpammy = (value) => {
  const clean = normalizeText(value);

  if (!clean) {
    return false;
  }

  if (/(https?:\/\/|www\.)/i.test(clean)) {
    return true;
  }

  if (/(.)\1{7,}/i.test(clean)) {
    return true;
  }

  return false;
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validatePayload = (payload) => {
  const cleaned = {
    name: normalizeText(payload.name),
    email: normalizeText(payload.email).toLowerCase(),
    trip: normalizeText(payload.interest || payload.trip),
    message: normalizeText(payload.message),
    website: normalizeText(payload.website),
    sourcePath: normalizeText(payload.sourcePath || payload.source_path || "/"),
    turnstileToken: normalizeText(
      payload.turnstile_token || payload.turnstileToken || payload["cf-turnstile-response"]
    ),
  };

  if (cleaned.website) {
    return { error: "Spam check failed." };
  }

  if (!cleaned.name || !cleaned.email || !cleaned.trip) {
    return { error: "Please fill in your name, email, and trip." };
  }

  if (!isValidEmail(cleaned.email)) {
    return { error: "Please enter a valid email address." };
  }

  if (cleaned.name.length > 80 || cleaned.email.length > 254) {
    return { error: "Please shorten your name or email address." };
  }

  if (cleaned.trip.length > 120 || cleaned.sourcePath.length > 300) {
    return { error: "The selected trip details are too long." };
  }

  if (cleaned.message.length > 1200) {
    return { error: "Please keep the trip notes a little shorter." };
  }

  if (looksSpammy(cleaned.name) || looksSpammy(cleaned.trip) || looksSpammy(cleaned.message)) {
    return { error: "Please remove links or spammy text from your inquiry." };
  }

  return { cleaned };
};

const ensureDatabase = (env) => {
  if (!env || !env.DB) {
    return { error: "Trip inbox is not configured yet." };
  }

  return { db: env.DB };
};

const ensureInquiriesSchema = async (db) => {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        trip TEXT NOT NULL,
        message TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'new',
        source_path TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    )
    .run();

  await db
    .prepare(
      `CREATE INDEX IF NOT EXISTS idx_inquiries_created_at
       ON inquiries (created_at DESC, id DESC)`
    )
    .run();

  await ensureInquiryRetention(db);
  await cleanupExpiredInquiryData(db);
};

export async function onRequestPost(context) {
  if (!hasSafeRequestOrigin(context.request)) {
    return json({ error: "Cross-site form submissions are not allowed." }, { status: 403 });
  }

  if (isRequestBodyTooLarge(context.request)) {
    return json({ error: "This inquiry is too large to submit." }, { status: 413 });
  }

  const { db, error } = ensureDatabase(context.env);

  if (error) {
    return json({ error }, { status: 503 });
  }

  const rateLimit = await enforceRateLimit(db, {
    route: "inquiries:post",
    identifier: getClientIp(context.request),
    limit: 6,
    windowSeconds: 60 * 10,
  });

  if (!rateLimit.allowed) {
    return json(
      { error: "Too many trip requests from this device. Please try again shortly." },
      {
        status: 429,
        headers: buildRateLimitHeaders(rateLimit),
      }
    );
  }

  let payload;

  try {
    payload = await parseRequestPayload(context.request);
  } catch (parseError) {
    return json(
      {
        error: isRequestBodyTooLargeError(parseError)
          ? "This inquiry is too large to submit."
          : "Invalid inquiry payload.",
      },
      {
        status: isRequestBodyTooLargeError(parseError) ? 413 : 400,
        headers: buildRateLimitHeaders(rateLimit),
      }
    );
  }

  const { cleaned, error: validationError } = validatePayload(payload);

  if (validationError) {
    return json(
      { error: validationError },
      {
        status: 400,
        headers: buildRateLimitHeaders(rateLimit),
      }
    );
  }

  const turnstile = await verifyTurnstileToken({
    request: context.request,
    env: context.env,
    token: cleaned.turnstileToken,
  });

  if (!turnstile.ok) {
    return json(
      { error: turnstile.error },
      {
        status: turnstile.status || 400,
        headers: buildRateLimitHeaders(rateLimit),
      }
    );
  }

  try {
    await ensureInquiriesSchema(db);

    const createdAt = new Date().toISOString();
    const result = await db
      .prepare(
        `INSERT INTO inquiries (
          name,
          email,
          trip,
          message,
          source_path,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        cleaned.name,
        cleaned.email,
        cleaned.trip,
        cleaned.message,
        cleaned.sourcePath || "/",
        createdAt,
        createdAt
      )
      .run();

    const inquiryId = result.meta?.last_row_id || createdAt;
    context.waitUntil(
      sendOperationalNotification(context.env, "inquiry.created", {
        id: inquiryId,
        name: cleaned.name,
        email: cleaned.email,
        trip: cleaned.trip,
        message: cleaned.message,
        source_path: cleaned.sourcePath || "/",
        created_at: createdAt,
      }).catch(() => undefined)
    );

    return json(
      {
        inquiry: {
          id: inquiryId,
          trip: cleaned.trip,
          created_at: createdAt,
        },
      },
      {
        status: 201,
        headers: buildRateLimitHeaders(rateLimit),
      }
    );
  } catch (dbError) {
    return json(
      { error: "Could not save your inquiry right now." },
      {
        status: 500,
        headers: buildRateLimitHeaders(rateLimit),
      }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "POST, OPTIONS",
    },
  });
}
