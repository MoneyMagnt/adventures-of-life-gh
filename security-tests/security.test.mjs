import assert from "node:assert/strict";
import test from "node:test";

import {
  getApiSecurityHeaders,
  hasSafeRequestOrigin,
  isRequestBodyTooLargeError,
  parseRequestPayload,
  verifyTurnstileToken,
} from "../functions/_lib/security.js";
import {
  isAuthorizedAdmin,
  isAdminConfigured,
} from "../functions/_lib/admin-auth.js";
import { sendOperationalNotification } from "../functions/_lib/notifications.js";
import { onRequest as applySiteMiddleware } from "../functions/_middleware.js";

test("same-origin writes are accepted and cross-site writes are rejected", () => {
  const sameOrigin = new Request("https://adventuresoflifegh.com/api/inquiries", {
    headers: {
      Origin: "https://adventuresoflifegh.com",
      "Sec-Fetch-Site": "same-origin",
    },
  });
  const crossSite = new Request("https://adventuresoflifegh.com/api/inquiries", {
    headers: {
      Origin: "https://attacker.example",
      "Sec-Fetch-Site": "cross-site",
    },
  });

  assert.equal(hasSafeRequestOrigin(sameOrigin), true);
  assert.equal(hasSafeRequestOrigin(crossSite), false);
});

test("JSON and form payloads parse only within the byte limit", async () => {
  const jsonRequest = new Request("https://adventuresoflifegh.com/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Ama", trip: "Cote d'Ivoire" }),
  });
  const formRequest = new Request("https://adventuresoflifegh.com/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "name=Ama&trip=Cote+d%27Ivoire",
  });

  assert.deepEqual(await parseRequestPayload(jsonRequest, 1024), {
    name: "Ama",
    trip: "Cote d'Ivoire",
  });
  assert.deepEqual(await parseRequestPayload(formRequest, 1024), {
    name: "Ama",
    trip: "Cote d'Ivoire",
  });

  const multipart = new FormData();
  multipart.set("name", "Ama");
  multipart.set("rating", "5");
  const multipartRequest = new Request("https://adventuresoflifegh.com/api/reviews", {
    method: "POST",
    body: multipart,
  });
  assert.deepEqual(await parseRequestPayload(multipartRequest, 1024), {
    name: "Ama",
    rating: "5",
  });
});

test("chunked bodies cannot bypass the byte limit", async () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('{"message":"'));
      controller.enqueue(new TextEncoder().encode("x".repeat(256)));
      controller.enqueue(new TextEncoder().encode('"}'));
      controller.close();
    },
  });
  const request = new Request("https://adventuresoflifegh.com/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: stream,
    duplex: "half",
  });

  await assert.rejects(
    () => parseRequestPayload(request, 64),
    (error) => isRequestBodyTooLargeError(error)
  );
});

test("API responses use restrictive browser security headers", () => {
  const headers = getApiSecurityHeaders();

  assert.equal(headers["Cache-Control"], "no-store");
  assert.equal(headers["Cross-Origin-Resource-Policy"], "same-origin");
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["Access-Control-Allow-Origin"], undefined);
  assert.match(headers["Content-Security-Policy"], /default-src 'none'/);
});

test("admin access fails closed and requires exact credentials", () => {
  const env = { ADMIN_USERNAME: "zico", ADMIN_PASSWORD: "a-strong-test-password" };
  const authorized = new Request("https://adventuresoflifegh.com/api/admin/dashboard", {
    headers: {
      Authorization: `Basic ${btoa("zico:a-strong-test-password")}`,
    },
  });
  const wrongPassword = new Request("https://adventuresoflifegh.com/api/admin/dashboard", {
    headers: {
      Authorization: `Basic ${btoa("zico:wrong")}`,
    },
  });

  assert.equal(isAdminConfigured({}), false);
  assert.equal(isAdminConfigured({ ADMIN_PASSWORD: "too-short" }), false);
  assert.equal(isAuthorizedAdmin(authorized, {}), false);
  assert.equal(isAuthorizedAdmin(authorized, env), true);
  assert.equal(isAuthorizedAdmin(wrongPassword, env), false);
});

test("configured notification webhooks require a strong signing secret", async () => {
  await assert.rejects(
    () =>
      sendOperationalNotification(
        { NOTIFICATION_WEBHOOK_URL: "https://hooks.example.test/trips" },
        "inquiry.created",
        { id: 1 }
      ),
    /at least 32 characters/
  );
});

test("Turnstile verification is bound to the submitting hostname", async () => {
  const originalFetch = globalThis.fetch;
  const request = new Request("https://adventuresoflifegh.com/api/inquiries");

  try {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({ success: true, hostname: "attacker.example" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    const mismatch = await verifyTurnstileToken({
      request,
      env: { TURNSTILE_SECRET_KEY: "test-secret" },
      token: "test-token",
    });
    assert.equal(mismatch.ok, false);

    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({ success: true, hostname: "adventuresoflifegh.com" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    const matching = await verifyTurnstileToken({
      request,
      env: { TURNSTILE_SECRET_KEY: "test-secret" },
      token: "test-token",
    });
    assert.equal(matching.ok, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Pages preview hostnames are always excluded from search indexes", async () => {
  const response = await applySiteMiddleware({
    request: new Request("https://preview.adventures-of-life-gh.pages.dev/journeys"),
    next: async () => new Response("preview", { status: 200 }),
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("X-Robots-Tag"), "noindex, nofollow, noarchive");

  const productionAlias = await applySiteMiddleware({
    request: new Request("https://adventures-of-life-gh.pages.dev/journeys?source=test"),
    next: async () => new Response("should not run"),
  });
  assert.equal(productionAlias.status, 301);
  assert.equal(
    productionAlias.headers.get("Location"),
    "https://adventuresoflifegh.com/journeys?source=test"
  );
  assert.equal(
    productionAlias.headers.get("X-Robots-Tag"),
    "noindex, nofollow, noarchive"
  );
});
