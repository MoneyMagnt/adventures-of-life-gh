"use strict";

import {
  buildRateLimitHeaders,
  enforceRateLimit,
  getClientIp,
  verifyTurnstileToken,
} from "../_lib/security.js";

const json = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    status: init.status || 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...(init.headers || {}),
    },
  });

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ");

const parsePayload = async (request) => {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData);
};

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
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    )
    .run();

  await db
    .prepare(
      `CREATE INDEX IF NOT EXISTS idx_inquiries_created_at
       ON inquiries (created_at DESC, id DESC)`
    )
    .run();
};

export async function onRequestPost(context) {
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
    payload = await parsePayload(context.request);
  } catch (parseError) {
    return json(
      { error: "Invalid inquiry payload." },
      {
        status: 400,
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
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        cleaned.name,
        cleaned.email,
        cleaned.trip,
        cleaned.message,
        cleaned.sourcePath || "/",
        createdAt
      )
      .run();

    return json(
      {
        inquiry: {
          id: result.meta?.last_row_id || createdAt,
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
