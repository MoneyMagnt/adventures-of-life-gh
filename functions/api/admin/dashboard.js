"use strict";

import {
  getApiSecurityHeaders,
  hasSafeRequestOrigin,
  isRequestBodyTooLargeError,
  isRequestBodyTooLarge,
  parseRequestPayload,
} from "../../_lib/security.js";
import {
  cleanupExpiredInquiryData,
  ensureInquiryRetention,
} from "../../_lib/data-retention.js";

const json = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    status: init.status || 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...getApiSecurityHeaders(),
      ...(init.headers || {}),
    },
  });

const ensureAdminTables = async (db) => {
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

  await ensureInquiryRetention(db);
  await cleanupExpiredInquiryData(db);

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
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        invite_id INTEGER DEFAULT NULL
      )`
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS review_invites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token_hash TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        contact TEXT NOT NULL,
        trip TEXT NOT NULL,
        trip_date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'issued',
        expires_at TEXT DEFAULT NULL,
        used_at TEXT DEFAULT NULL,
        review_id INTEGER DEFAULT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    )
    .run();
};

export async function onRequestGet(context) {
  const db = context.env?.DB;
  if (!db) return json({ error: "Admin database is not configured." }, { status: 503 });

  try {
    await ensureAdminTables(db);
    const [inquiries, reviews, invites] = await db.batch([
      db.prepare(
        `SELECT id, name, email, trip, message, status, source_path, created_at
         FROM inquiries
         ORDER BY datetime(created_at) DESC, id DESC
         LIMIT 100`
      ),
      db.prepare(
        `SELECT id, public_name, contact, trip, trip_date, rating, review, approved, created_at
         FROM reviews
         ORDER BY datetime(created_at) DESC, id DESC
         LIMIT 100`
      ),
      db.prepare(
        `SELECT id, name, contact, trip, trip_date, status, expires_at, used_at, review_id, created_at
         FROM review_invites
         ORDER BY datetime(created_at) DESC, id DESC
         LIMIT 100`
      ),
    ]);

    return json({
      inquiries: inquiries.results || [],
      reviews: reviews.results || [],
      invites: invites.results || [],
    });
  } catch {
    return json({ error: "Could not load the admin inbox." }, { status: 500 });
  }
}

export async function onRequestPatch(context) {
  if (!hasSafeRequestOrigin(context.request)) {
    return json({ error: "Cross-site admin changes are not allowed." }, { status: 403 });
  }
  if (isRequestBodyTooLarge(context.request, 8 * 1024)) {
    return json({ error: "Admin request is too large." }, { status: 413 });
  }

  const db = context.env?.DB;
  if (!db) return json({ error: "Admin database is not configured." }, { status: 503 });

  let payload;
  try {
    payload = await parseRequestPayload(context.request, 8 * 1024);
  } catch (error) {
    return json(
      {
        error: isRequestBodyTooLargeError(error)
          ? "Admin request is too large."
          : "Invalid admin request.",
      },
      { status: isRequestBodyTooLargeError(error) ? 413 : 400 }
    );
  }

  const id = Number.parseInt(payload.id, 10);
  if (!Number.isSafeInteger(id) || id < 1) {
    return json({ error: "A valid record id is required." }, { status: 400 });
  }

  try {
    await ensureAdminTables(db);
    let result;

    if (payload.action === "inquiry-status") {
      const status = String(payload.status || "");
      if (!["new", "contacted", "closed"].includes(status)) {
        return json({ error: "Invalid inquiry status." }, { status: 400 });
      }
      result = await db
        .prepare("UPDATE inquiries SET status = ?, updated_at = ? WHERE id = ?")
        .bind(status, new Date().toISOString(), id)
        .run();
    } else if (payload.action === "review-status") {
      const approved = payload.approved === true || payload.approved === 1 ? 1 : 0;
      result = await db
        .prepare("UPDATE reviews SET approved = ? WHERE id = ?")
        .bind(approved, id)
        .run();
    } else if (payload.action === "invite-revoke") {
      result = await db
        .prepare(
          `UPDATE review_invites
           SET status = 'revoked'
           WHERE id = ? AND status = 'issued' AND used_at IS NULL`
        )
        .bind(id)
        .run();
    } else {
      return json({ error: "Unknown admin action." }, { status: 400 });
    }

    if (Number(result.meta?.changes || 0) !== 1) {
      return json({ error: "The record was not found or could not be changed." }, { status: 404 });
    }

    return json({ ok: true });
  } catch {
    return json({ error: "Could not update this record." }, { status: 500 });
  }
}
