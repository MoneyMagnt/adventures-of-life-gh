"use strict";

import {
  buildRateLimitHeaders,
  enforceRateLimit,
  ensureSecuritySchema,
  getClientIp,
  getReviewInviteByToken,
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

const ensureDatabase = (env) => {
  if (!env || !env.DB) {
    return { error: "Review invites are not configured yet." };
  }

  return { db: env.DB };
};

const buildInviteNameHint = (value) => {
  const cleaned = String(value || "")
    .replace(/[^\p{L}\p{N}\s'-]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");

  if (!cleaned) {
    return "Traveller";
  }

  const first = cleaned.split(" ")[0] || "Traveller";
  return first.slice(0, 24);
};

export async function onRequestGet(context) {
  const { db, error } = ensureDatabase(context.env);

  if (error) {
    return json({ error }, { status: 503 });
  }

  const rateLimit = await enforceRateLimit(db, {
    route: "review-invite:get",
    identifier: getClientIp(context.request),
    limit: 20,
    windowSeconds: 60 * 10,
  });

  if (!rateLimit.allowed) {
    return json(
      { error: "Too many review-link checks. Please try again shortly." },
      {
        status: 429,
        headers: buildRateLimitHeaders(rateLimit),
      }
    );
  }

  try {
    await ensureSecuritySchema(db);

    const url = new URL(context.request.url);
    const token = url.searchParams.get("token");
    const invite = await getReviewInviteByToken(db, token);

    if (!invite) {
      return json(
        { error: "This review link is invalid or has expired." },
        {
          status: 404,
          headers: buildRateLimitHeaders(rateLimit),
        }
      );
    }

    return json(
      {
        invite: {
          name: buildInviteNameHint(invite.name),
          trip: invite.trip,
          trip_date: invite.trip_date,
        },
      },
      {
        headers: buildRateLimitHeaders(rateLimit),
      }
    );
  } catch (dbError) {
    return json(
      { error: "Could not check this review link right now." },
      { status: 500 }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "GET, OPTIONS",
    },
  });
}
