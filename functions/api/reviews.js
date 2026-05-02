"use strict";

import {
  buildRateLimitHeaders,
  enforceRateLimit,
  ensureSecuritySchema,
  getClientIp,
  getReviewInviteByToken,
  markReviewInviteUsed,
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

const reviewLooksSpammy = (value) => {
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

const buildNameParts = (value) =>
  String(value || "")
    .replace(/[^\p{L}\p{N}\s'-]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map(part => part.trim())
    .filter(Boolean);

const buildPublicName = (value) => {
  const parts = buildNameParts(value);

  if (!parts.length) {
    return "Traveller";
  }

  const first = parts[0].slice(0, 24);
  const firstDisplay = first ? `${first.charAt(0).toUpperCase()}${first.slice(1)}` : "Traveller";

  if (parts.length === 1) {
    return firstDisplay;
  }

  const last = parts[parts.length - 1];
  return `${firstDisplay} ${last.charAt(0).toUpperCase()}.`;
};

const parsePayload = async (request) => {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData);
};

const validatePayload = (payload) => {
  const cleaned = {
    name: normalizeText(payload.name),
    review: normalizeText(payload.review),
    rating: Number.parseInt(payload.rating, 10),
    website: normalizeText(payload.website),
    reviewToken: normalizeText(
      payload.review_token || payload.reviewToken || payload.token
    ),
    turnstileToken: normalizeText(
      payload.turnstile_token ||
        payload.turnstileToken ||
        payload["cf-turnstile-response"]
    ),
  };

  if (cleaned.website) {
    return { error: "Spam check failed." };
  }

  if (!cleaned.name || !cleaned.review) {
    return { error: "Please fill in your name and review." };
  }

  if (!Number.isFinite(cleaned.rating) || cleaned.rating < 1 || cleaned.rating > 5) {
    return { error: "Please choose a rating between 1 and 5." };
  }

  if (!cleaned.reviewToken) {
    return {
      error:
        "This form only works from a verified trip review link. Ask Zico to resend yours.",
      status: 403,
    };
  }

  if (cleaned.review.length < 12) {
    return { error: "Please add a slightly longer review." };
  }

  if (cleaned.review.length > 600) {
    return { error: "Please keep your review a little shorter." };
  }

  if (reviewLooksSpammy(cleaned.review)) {
    return { error: "Please remove links or spammy text from the review." };
  }

  return { cleaned };
};

const ensureDatabase = (env) => {
  if (!env || !env.DB) {
    return { error: "Reviews database is not configured yet." };
  }

  return { db: env.DB };
};

const ensureReviewsSchema = async (db) => {
  await ensureSecuritySchema(db);

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        public_name TEXT NOT NULL,
        contact TEXT NOT NULL,
        trip TEXT NOT NULL,
        trip_date TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        review TEXT NOT NULL,
        approved INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    )
    .run();

  await db
    .prepare(
      `CREATE INDEX IF NOT EXISTS idx_reviews_approved_created_at
       ON reviews (approved, created_at DESC, id DESC)`
    )
    .run();

  await db
    .prepare(
      `CREATE INDEX IF NOT EXISTS idx_reviews_trip_contact
       ON reviews (trip, contact)`
    )
    .run();
};

export async function onRequestGet(context) {
  const { db, error } = ensureDatabase(context.env);

  if (error) {
    return json({ error }, { status: 503 });
  }

  const rateLimit = await enforceRateLimit(db, {
    route: "reviews:get",
    identifier: getClientIp(context.request),
    limit: 60,
    windowSeconds: 60 * 5,
  });

  if (!rateLimit.allowed) {
    return json(
      { error: "Too many review requests. Please try again shortly." },
      {
        status: 429,
        headers: buildRateLimitHeaders(rateLimit),
      }
    );
  }

  try {
    await ensureReviewsSchema(db);

    const { results } = await db
      .prepare(
        `SELECT
          id,
          public_name AS display_name,
          trip,
          trip_date,
          rating,
          review,
          created_at
        FROM reviews
        WHERE approved = 1
        ORDER BY datetime(created_at) DESC, id DESC
        LIMIT 24`
      )
      .all();

    return json(
      { reviews: results || [] },
      { headers: buildRateLimitHeaders(rateLimit) }
    );
  } catch (dbError) {
    return json({ error: "Could not load reviews right now." }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { db, error } = ensureDatabase(context.env);

  if (error) {
    return json({ error }, { status: 503 });
  }

  const rateLimit = await enforceRateLimit(db, {
    route: "reviews:post",
    identifier: getClientIp(context.request),
    limit: 4,
    windowSeconds: 60 * 15,
  });

  if (!rateLimit.allowed) {
    return json(
      { error: "Too many review attempts from this device. Please try again shortly." },
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
      { error: "Invalid review payload." },
      {
        status: 400,
        headers: buildRateLimitHeaders(rateLimit),
      }
    );
  }

  const validation = validatePayload(payload);

  if (validation.error) {
    return json(
      { error: validation.error },
      {
        status: validation.status || 400,
        headers: buildRateLimitHeaders(rateLimit),
      }
    );
  }

  const { cleaned } = validation;

  try {
    await ensureReviewsSchema(db);

    const invite = await getReviewInviteByToken(db, cleaned.reviewToken);

    if (!invite) {
      return json(
        { error: "This review link is invalid or has expired. Ask Zico to resend it." },
        {
          status: 403,
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

    const publicName = buildPublicName(cleaned.name || invite.name);
    const createdAt = new Date().toISOString();

    const result = await db
      .prepare(
        `INSERT INTO reviews (
          name,
          public_name,
          contact,
          trip,
          trip_date,
          rating,
          review,
          approved,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`
      )
      .bind(
        cleaned.name || invite.name,
        publicName,
        invite.contact,
        invite.trip,
        invite.trip_date,
        cleaned.rating,
        cleaned.review,
        createdAt
      )
      .run();

    const reviewId = result.meta?.last_row_id || createdAt;
    await markReviewInviteUsed(db, invite.id, reviewId);

    return json(
      {
        action: "created",
        review: {
          id: reviewId,
          display_name: publicName,
          trip: invite.trip,
          trip_date: invite.trip_date,
          rating: cleaned.rating,
          review: cleaned.review,
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
      { error: "Could not save your review right now." },
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
      Allow: "GET, POST, OPTIONS",
    },
  });
}
