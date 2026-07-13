"use strict";

const textEncoder = new TextEncoder();
const MINIMUM_ADMIN_PASSWORD_LENGTH = 20;

const constantTimeEqual = (left, right) => {
  const leftBytes = textEncoder.encode(String(left || ""));
  const rightBytes = textEncoder.encode(String(right || ""));
  const length = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] || 0) ^ (rightBytes[index] || 0);
  }

  return difference === 0;
};

const decodeBasicCredentials = (header) => {
  if (!header || header.length > 2048 || !header.startsWith("Basic ")) return null;

  try {
    const decoded = atob(header.slice(6).trim());
    const separator = decoded.indexOf(":");
    if (separator < 0) return null;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
};

export const isAdminConfigured = (env) =>
  String(env?.ADMIN_PASSWORD || "").length >= MINIMUM_ADMIN_PASSWORD_LENGTH;

export const isAuthorizedAdmin = (request, env) => {
  if (!isAdminConfigured(env)) return false;

  const credentials = decodeBasicCredentials(request.headers.get("authorization"));
  if (!credentials) return false;

  const expectedUsername = String(env?.ADMIN_USERNAME || "zico").trim();
  const expectedPassword = String(env.ADMIN_PASSWORD);

  return (
    constantTimeEqual(credentials.username, expectedUsername) &&
    constantTimeEqual(credentials.password, expectedPassword)
  );
};

export const adminAuthResponse = (env) => {
  if (!isAdminConfigured(env)) {
    return new Response("Admin access is not configured.", {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Content-Security-Policy": "default-src 'none'; base-uri 'none'; frame-ancestors 'none'",
        "Content-Type": "text/plain; charset=utf-8",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    });
  }

  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; base-uri 'none'; frame-ancestors 'none'",
      "Content-Type": "text/plain; charset=utf-8",
      "Referrer-Policy": "no-referrer",
      "WWW-Authenticate": 'Basic realm="Adventures of Life admin", charset="UTF-8"',
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    },
  });
};

export const requireAdmin = (context) =>
  isAuthorizedAdmin(context.request, context.env)
    ? null
    : adminAuthResponse(context.env);
