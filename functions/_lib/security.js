"use strict";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RATE_LIMIT_RETENTION_SECONDS = 60 * 60 * 24 * 2;
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

let securitySchemaPromise = null;
let lastRateLimitCleanupAt = 0;

export const getClientIp = (request) => {
  const direct =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "";

  return String(direct).split(",")[0].trim().slice(0, 128) || "unknown";
};

export const getTurnstileSiteKey = (env) =>
  String(env?.TURNSTILE_SITE_KEY || "").trim();

const getTurnstileSecret = (env) =>
  String(env?.TURNSTILE_SECRET_KEY || "").trim();

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");

export const hashToken = async (token) => {
  const normalized = String(token || "").trim();

  if (!normalized) {
    return "";
  }

  const bytes = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return toHex(digest);
};

export const ensureSecuritySchema = (db) => {
  if (!securitySchemaPromise) {
    securitySchemaPromise = (async () => {
      await db
        .prepare(
          `CREATE TABLE IF NOT EXISTS api_rate_limits (
            route TEXT NOT NULL,
            identifier TEXT NOT NULL,
            window_start INTEGER NOT NULL,
            count INTEGER NOT NULL DEFAULT 1,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (route, identifier, window_start)
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

      await db
        .prepare(
          `CREATE INDEX IF NOT EXISTS idx_review_invites_status_expiry
           ON review_invites (status, expires_at, id DESC)`
        )
        .run();

      await db
        .prepare(
          `CREATE INDEX IF NOT EXISTS idx_review_invites_status_used
           ON review_invites (status, used_at, created_at)`
        )
        .run();

      await db
        .prepare(
          `DELETE FROM review_invites
           WHERE (
             status = 'issued'
             AND expires_at IS NOT NULL
             AND datetime(expires_at) < datetime('now', '-30 days')
           )
           OR (
             status IN ('used', 'revoked')
             AND datetime(COALESCE(used_at, created_at)) < datetime('now', '-24 months')
           )`
        )
        .run();
    })().catch((error) => {
      securitySchemaPromise = null;
      throw error;
    });
  }

  return securitySchemaPromise;
};

export const hasSafeRequestOrigin = (request) => {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");

  if (fetchSite === "cross-site") {
    return false;
  }

  if (!origin) {
    return true;
  }

  try {
    return origin === new URL(request.url).origin;
  } catch {
    return false;
  }
};

export const isRequestBodyTooLarge = (request, maxBytes = 16 * 1024) => {
  const length = Number.parseInt(request.headers.get("content-length") || "0", 10);
  return Number.isFinite(length) && length > maxBytes;
};

const requestBodyError = (message, code) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

export const isRequestBodyTooLargeError = (error) =>
  error?.code === "REQUEST_BODY_TOO_LARGE";

const readLimitedRequestBody = async (request, maxBytes) => {
  if (isRequestBodyTooLarge(request, maxBytes)) {
    throw requestBodyError("Request body is too large.", "REQUEST_BODY_TOO_LARGE");
  }

  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = value instanceof Uint8Array ? value : new Uint8Array(value);
    totalBytes += chunk.byteLength;

    if (totalBytes > maxBytes) {
      await reader.cancel().catch(() => undefined);
      throw requestBodyError("Request body is too large.", "REQUEST_BODY_TOO_LARGE");
    }

    chunks.push(chunk);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return body;
};

export const parseRequestPayload = async (request, maxBytes = 16 * 1024) => {
  const contentType = String(request.headers.get("content-type") || "");
  const normalizedContentType = contentType.toLowerCase();
  const body = await readLimitedRequestBody(request, maxBytes);

  if (normalizedContentType.includes("application/json")) {
    return JSON.parse(new TextDecoder().decode(body));
  }

  if (
    normalizedContentType.includes("application/x-www-form-urlencoded") ||
    normalizedContentType.includes("multipart/form-data")
  ) {
    const response = new Response(body, {
      headers: { "Content-Type": contentType },
    });
    return Object.fromEntries(await response.formData());
  }

  throw requestBodyError("Unsupported request content type.", "UNSUPPORTED_CONTENT_TYPE");
};

export const getApiSecurityHeaders = () => ({
  "Cache-Control": "no-store",
  "Content-Security-Policy": "default-src 'none'; base-uri 'none'; frame-ancestors 'none'",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
});

export const enforceRateLimit = async (
  db,
  { route, identifier, limit, windowSeconds }
) => {
  await ensureSecuritySchema(db);

  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const storedIdentifier = await hashToken(String(identifier || "unknown").slice(0, 256));
  const windowStart = Math.floor(now / (windowSeconds * 1000)) * windowSeconds;
  const retryAfter = Math.max(
    1,
    windowSeconds - Math.floor(now / 1000 - windowStart)
  );
  const retentionCutoff = Math.floor(now / 1000) - RATE_LIMIT_RETENTION_SECONDS;

  if (now - lastRateLimitCleanupAt >= RATE_LIMIT_CLEANUP_INTERVAL_MS) {
    await db
      .prepare(`DELETE FROM api_rate_limits WHERE window_start < ?`)
      .bind(retentionCutoff)
      .run();
    lastRateLimitCleanupAt = now;
  }

  const row = await db
    .prepare(
      `INSERT INTO api_rate_limits (
        route,
        identifier,
        window_start,
        count,
        updated_at
      ) VALUES (?, ?, ?, 1, ?)
      ON CONFLICT(route, identifier, window_start)
      DO UPDATE SET
        count = api_rate_limits.count + 1,
        updated_at = excluded.updated_at
      RETURNING count`
    )
    .bind(route, storedIdentifier, windowStart, nowIso)
    .first();

  const count = Number.parseInt(row?.count, 10) || 1;

  return {
    allowed: count <= limit,
    limit,
    remaining: Math.max(limit - count, 0),
    retryAfter,
  };
};

export const buildRateLimitHeaders = (rateLimit) => ({
  ...(rateLimit.allowed ? {} : { "Retry-After": String(rateLimit.retryAfter) }),
  "RateLimit-Limit": String(rateLimit.limit),
  "RateLimit-Remaining": String(rateLimit.remaining),
  "X-RateLimit-Limit": String(rateLimit.limit),
  "X-RateLimit-Remaining": String(rateLimit.remaining),
});

export const verifyTurnstileToken = async ({
  request,
  env,
  token,
  errorMessage = "Please confirm you are human and try again.",
}) => {
  const secret = getTurnstileSecret(env);

  if (!secret) {
    return {
      ok: false,
      status: 503,
      error: "Form protection is not configured yet.",
    };
  }

  const normalizedToken = String(token || "").trim();

  if (!normalizedToken) {
    return {
      ok: false,
      status: 400,
      error: errorMessage,
    };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", normalizedToken);

  const clientIp = getClientIp(request);
  if (clientIp && clientIp !== "unknown") {
    body.set("remoteip", clientIp);
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body,
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
      const codes = Array.isArray(result["error-codes"])
        ? result["error-codes"]
        : [];

      const friendlyError = codes.includes("timeout-or-duplicate")
        ? "Your verification expired. Please try again."
        : errorMessage;

      return {
        ok: false,
        status: 400,
        error: friendlyError,
      };
    }

    const requestHostname = new URL(request.url).hostname.toLowerCase();
    const verifiedHostname = String(result.hostname || "").trim().toLowerCase();
    if (!verifiedHostname || verifiedHostname !== requestHostname) {
      return {
        ok: false,
        status: 400,
        error: errorMessage,
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      status: 503,
      error: "Could not verify the security check right now.",
    };
  }
};

export const getReviewInviteByToken = async (db, token) => {
  await ensureSecuritySchema(db);

  const tokenHash = await hashToken(token);

  if (!tokenHash) {
    return null;
  }

  const invite = await db
    .prepare(
      `SELECT
        id,
        name,
        contact,
        trip,
        trip_date,
        status,
        expires_at,
        used_at
      FROM review_invites
      WHERE token_hash = ?`
    )
    .bind(tokenHash)
    .first();

  if (!invite) {
    return null;
  }

  const now = Date.now();
  const expiresAt =
    invite.expires_at && !Number.isNaN(Date.parse(invite.expires_at))
      ? Date.parse(invite.expires_at)
      : null;

  if (invite.status !== "issued" || invite.used_at) {
    return null;
  }

  if (expiresAt && expiresAt <= now) {
    return null;
  }

  return invite;
};

export const markReviewInviteUsed = async (db, inviteId, reviewId) => {
  const usedAt = new Date().toISOString();

  await db
    .prepare(
      `UPDATE review_invites
       SET status = 'used',
           used_at = ?,
           review_id = ?
       WHERE id = ?`
    )
    .bind(usedAt, reviewId, inviteId)
    .run();
};
