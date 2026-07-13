"use strict";

import { adminAuthResponse, isAuthorizedAdmin } from "../../_lib/admin-auth.js";
import { buildRateLimitHeaders, enforceRateLimit, getClientIp } from "../../_lib/security.js";

export async function onRequest(context) {
  if (isAuthorizedAdmin(context.request, context.env)) return context.next();

  if (context.env?.DB) {
    const rateLimit = await enforceRateLimit(context.env.DB, {
      route: "admin-api:auth",
      identifier: getClientIp(context.request),
      limit: 10,
      windowSeconds: 60 * 15,
    });
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ error: "Too many admin login attempts." }), {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json; charset=utf-8",
          ...buildRateLimitHeaders(rateLimit),
        },
      });
    }
  }

  return adminAuthResponse(context.env);
}
