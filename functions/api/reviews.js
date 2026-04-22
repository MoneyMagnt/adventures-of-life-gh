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

const buildPublicName = (value) => {
  const clean = normalizeText(value);

  if (!clean) {
    return "Traveller";
  }

  const parts = clean.split(" ");

  if (parts.length === 1) {
    return parts[0];
  }

  const first = parts[0];
  const last = parts[parts.length - 1];
  return `${first} ${last.charAt(0).toUpperCase()}.`;
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

  return { cleaned };
};

const ensureDatabase = (env) => {
  if (!env || !env.DB) {
    return { error: "Reviews database is not configured yet." };
  }

  return { db: env.DB };
};

export async function onRequestGet(context) {
  const { db, error } = ensureDatabase(context.env);

  if (error) {
    return json({ error }, { status: 503 });
  }

  try {
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

  try {
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
