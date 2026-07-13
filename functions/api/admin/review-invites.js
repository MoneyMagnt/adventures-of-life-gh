"use strict";

import { sendOperationalNotification } from "../../_lib/notifications.js";
import {
  ensureSecuritySchema,
  getApiSecurityHeaders,
  hasSafeRequestOrigin,
  hashToken,
  isRequestBodyTooLargeError,
  isRequestBodyTooLarge,
  parseRequestPayload,
} from "../../_lib/security.js";

const MAX_INVITES_PER_REQUEST = 100;
const CANONICAL_SITE_URL = "https://adventuresoflifegh.com";

const json = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    status: init.status || 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...getApiSecurityHeaders(),
      ...(init.headers || {}),
    },
  });

const normalize = (value, maxLength) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);

const createToken = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const getPublicSiteUrl = (env) => {
  try {
    const url = new URL(String(env?.PUBLIC_SITE_URL || CANONICAL_SITE_URL));
    if (url.protocol === "https:" && url.hostname === "adventuresoflifegh.com") {
      return url.origin;
    }
  } catch {
    // Fall back to the canonical site instead of emitting an unsafe invite link.
  }
  return CANONICAL_SITE_URL;
};

export async function onRequestPost(context) {
  if (!hasSafeRequestOrigin(context.request)) {
    return json({ error: "Cross-site admin submissions are not allowed." }, { status: 403 });
  }
  if (isRequestBodyTooLarge(context.request, 64 * 1024)) {
    return json({ error: "Invite request is too large." }, { status: 413 });
  }

  const db = context.env?.DB;
  if (!db) return json({ error: "Review invites are not configured." }, { status: 503 });

  let payload;
  try {
    payload = await parseRequestPayload(context.request, 64 * 1024);
  } catch (error) {
    return json(
      {
        error: isRequestBodyTooLargeError(error)
          ? "Invite request is too large."
          : "Invalid invite request.",
      },
      { status: isRequestBodyTooLargeError(error) ? 413 : 400 }
    );
  }

  const attendees = Array.isArray(payload.attendees) ? payload.attendees : [];
  if (!attendees.length || attendees.length > MAX_INVITES_PER_REQUEST) {
    return json(
      { error: `Add between 1 and ${MAX_INVITES_PER_REQUEST} attendees.` },
      { status: 400 }
    );
  }

  const trip = normalize(payload.trip, 120);
  const tripDate = normalize(payload.trip_date, 40);
  const expiresInDays = Math.min(Math.max(Number.parseInt(payload.expires_in_days, 10) || 30, 1), 60);
  if (!trip || !tripDate) {
    return json({ error: "Trip name and trip date are required." }, { status: 400 });
  }

  const cleanedAttendees = attendees.map((attendee) => ({
    name: normalize(attendee.name, 80),
    contact: normalize(attendee.contact, 160),
  }));
  if (cleanedAttendees.some((attendee) => !attendee.name || !attendee.contact)) {
    return json({ error: "Every attendee needs a name and contact." }, { status: 400 });
  }

  try {
    await ensureSecuritySchema(db);
    const expiresAt = new Date(Date.now() + expiresInDays * 86400000).toISOString();
    const created = await Promise.all(
      cleanedAttendees.map(async (attendee) => {
        const token = createToken();
        return {
          ...attendee,
          token,
          tokenHash: await hashToken(token),
        };
      })
    );

    await db.batch(
      created.map((invite) =>
        db
          .prepare(
            `INSERT INTO review_invites (
              token_hash, name, contact, trip, trip_date, status, expires_at
            ) VALUES (?, ?, ?, ?, ?, 'issued', ?)`
          )
          .bind(invite.tokenHash, invite.name, invite.contact, trip, tripDate, expiresAt)
      )
    );

    const siteUrl = getPublicSiteUrl(context.env);
    const links = created.map((invite) => ({
      name: invite.name,
      contact: invite.contact,
      trip,
      trip_date: tripDate,
      expires_at: expiresAt,
      url: `${siteUrl}/community?review_token=${encodeURIComponent(invite.token)}#leave-review`,
    }));

    context.waitUntil(
      sendOperationalNotification(context.env, "review_invites.created", { invites: links }).catch(
        () => undefined
      )
    );

    return json({ invites: links }, { status: 201 });
  } catch {
    return json({ error: "Could not create the review invitations." }, { status: 500 });
  }
}
