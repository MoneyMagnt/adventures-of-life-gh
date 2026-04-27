"use strict";

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

const normalizeTripKey = (value) =>
  normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const normalizeContactKey = (value) => {
  const clean = normalizeText(value).toLowerCase();

  if (!clean) {
    return "";
  }

  if (clean.includes("@")) {
    return clean.replace(/\s+/g, "");
  }

  const digits = clean.replace(/\D+/g, "");

  if (digits.length >= 9) {
    return digits.slice(-9);
  }

  return clean.replace(/[^a-z0-9]+/g, "");
};

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
    contact: normalizeText(payload.contact),
    trip: normalizeText(payload.trip),
    tripDate: normalizeText(payload.tripDate || payload.trip_date),
    review: normalizeText(payload.review),
    rating: Number.parseInt(payload.rating, 10),
    website: normalizeText(payload.website),
  };

  if (cleaned.website) {
    return { error: "Spam check failed." };
  }

  if (!cleaned.name || !cleaned.contact || !cleaned.trip || !cleaned.tripDate || !cleaned.review) {
    return { error: "Please fill in every review field." };
  }

  if (!Number.isFinite(cleaned.rating) || cleaned.rating < 1 || cleaned.rating > 5) {
    return { error: "Please choose a rating between 1 and 5." };
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

    return json({ reviews: results || [] });
  } catch (dbError) {
    return json({ error: "Could not load reviews right now." }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { db, error } = ensureDatabase(context.env);

  if (error) {
    return json({ error }, { status: 503 });
  }

  let payload;

  try {
    payload = await parsePayload(context.request);
  } catch (parseError) {
    return json({ error: "Invalid review payload." }, { status: 400 });
  }

  const { cleaned, error: validationError } = validatePayload(payload);

  if (validationError) {
    return json({ error: validationError }, { status: 400 });
  }

  const publicName = buildPublicName(cleaned.name);
  const createdAt = new Date().toISOString();
  const tripKey = normalizeTripKey(cleaned.trip);
  const contactKey = normalizeContactKey(cleaned.contact);

  try {
    await ensureReviewsSchema(db);

    const existingForTrip = await db
      .prepare(
        `SELECT id, contact
         FROM reviews
         WHERE lower(trim(trip)) = lower(trim(?))`
      )
      .bind(cleaned.trip)
      .all();

    const existingReview = (existingForTrip.results || []).find(
      (row) => normalizeContactKey(row.contact) === contactKey && contactKey && tripKey
    );

    if (existingReview) {
      await db
        .prepare(
          `UPDATE reviews
           SET name = ?,
               public_name = ?,
               contact = ?,
               trip = ?,
               trip_date = ?,
               rating = ?,
               review = ?,
               approved = 1,
               created_at = ?
           WHERE id = ?`
        )
        .bind(
          cleaned.name,
          publicName,
          cleaned.contact,
          cleaned.trip,
          cleaned.tripDate,
          cleaned.rating,
          cleaned.review,
          createdAt,
          existingReview.id
        )
        .run();

      return json(
        {
          action: "updated",
          review: {
            id: existingReview.id,
            display_name: publicName,
            trip: cleaned.trip,
            trip_date: cleaned.tripDate,
            rating: cleaned.rating,
            review: cleaned.review,
            created_at: createdAt,
          },
        },
        { status: 200 }
      );
    }

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
        cleaned.name,
        publicName,
        cleaned.contact,
        cleaned.trip,
        cleaned.tripDate,
        cleaned.rating,
        cleaned.review,
        createdAt
      )
      .run();

    return json(
      {
        action: "created",
        review: {
          id: result.meta?.last_row_id || createdAt,
          display_name: publicName,
          trip: cleaned.trip,
          trip_date: cleaned.tripDate,
          rating: cleaned.rating,
          review: cleaned.review,
          created_at: createdAt,
        },
      },
      { status: 201 }
    );
  } catch (dbError) {
    return json({ error: "Could not save your review right now." }, { status: 500 });
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
