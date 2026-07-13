"use strict";

import { getApiSecurityHeaders, getTurnstileSiteKey } from "../_lib/security.js";

const json = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    status: init.status || 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...getApiSecurityHeaders(),
      ...(init.headers || {}),
    },
  });

export async function onRequestGet(context) {
  return json({
    turnstileSiteKey: getTurnstileSiteKey(context.env),
    reviewInviteRequired: true,
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "GET, OPTIONS",
    },
  });
}
