"use strict";

const APEX_ORIGIN = String(
  process.env.LIVE_SITE_ORIGIN || "https://adventuresoflifegh.com"
).replace(/\/$/, "");
const ALIAS_ORIGINS = [
  "https://www.adventuresoflifegh.com",
  "https://adventures-of-life-gh.pages.dev",
];
const errors = [];

const fail = (message) => errors.push(message);

const request = async (url, options = {}) => {
  try {
    const { headers = {}, ...requestOptions } = options;
    return await fetch(url, {
      ...requestOptions,
      redirect: "manual",
      signal: AbortSignal.timeout(15000),
      headers: {
        "User-Agent": "Adventures-of-Life-live-verifier/1.0",
        ...headers,
      },
    });
  } catch (error) {
    fail(`${url} could not be reached: ${error.message}`);
    return null;
  }
};

const expectStatus = (response, expected, label) => {
  if (!response) return;
  const allowed = Array.isArray(expected) ? expected : [expected];
  if (!allowed.includes(response.status)) {
    fail(`${label} returned ${response.status}; expected ${allowed.join(" or ")}.`);
  }
};

const verifyCanonicalRedirect = async (origin) => {
  const response = await request(`${origin}/journeys?live-check=1`);
  expectStatus(response, [301, 308], origin);
  if (!response) return;

  const location = response.headers.get("location") || "";
  const expected = `${APEX_ORIGIN}/journeys?live-check=1`;
  if (location !== expected) {
    fail(`${origin} redirects to ${location || "nothing"}; expected ${expected}.`);
  }
  if (
    origin.endsWith(".pages.dev") &&
    !String(response.headers.get("x-robots-tag") || "").includes("noindex")
  ) {
    fail(`${origin} is missing X-Robots-Tag: noindex on its redirect response.`);
  }
};

const verifySecurityHeaders = (response) => {
  if (!response) return;
  const required = new Map([
    ["content-security-policy", "default-src 'self'"],
    ["strict-transport-security", "max-age="],
    ["x-content-type-options", "nosniff"],
    ["x-frame-options", "DENY"],
    ["referrer-policy", "strict-origin-when-cross-origin"],
    ["permissions-policy", "camera=()"],
  ]);

  for (const [name, expectedFragment] of required) {
    const value = response.headers.get(name) || "";
    if (!value.includes(expectedFragment)) {
      fail(`The apex response is missing a valid ${name} header.`);
    }
  }
};

const run = async () => {
  const home = await request(`${APEX_ORIGIN}/`);
  expectStatus(home, 200, "Apex homepage");
  verifySecurityHeaders(home);

  for (const origin of ALIAS_ORIGINS) {
    await verifyCanonicalRedirect(origin);
  }

  const currentTrip = await request(`${APEX_ORIGIN}/trips/cote-divoire-28-august`);
  expectStatus(currentTrip, 200, "Current Côte d'Ivoire trip page");

  const expiredTrip = await request(
    `${APEX_ORIGIN}/trips/oboadaka-waterfall-27-june`
  );
  expectStatus(expiredTrip, [301, 308], "Expired Oboadaka trip route");
  if (expiredTrip) {
    const location = expiredTrip.headers.get("location") || "";
    if (!location.endsWith("/community#oboadaka")) {
      fail(`Expired Oboadaka route redirects to ${location || "nothing"}.`);
    }
  }

  const siteConfig = await request(`${APEX_ORIGIN}/api/site-config`);
  expectStatus(siteConfig, 200, "Site security configuration");
  if (siteConfig) {
    if (siteConfig.headers.get("access-control-allow-origin") === "*") {
      fail("The live API is exposing a wildcard Access-Control-Allow-Origin header.");
    }
    if (!String(siteConfig.headers.get("cache-control") || "").includes("no-store")) {
      fail("The live API is missing Cache-Control: no-store.");
    }
    if (siteConfig.headers.get("cross-origin-resource-policy") !== "same-origin") {
      fail("The live API is missing Cross-Origin-Resource-Policy: same-origin.");
    }
    if (!String(siteConfig.headers.get("content-security-policy") || "").includes("default-src 'none'")) {
      fail("The live API is missing its restrictive Content-Security-Policy.");
    }
    const config = await siteConfig.json().catch(() => null);
    if (!config || String(config.turnstileSiteKey || "").trim().length < 10) {
      fail("TURNSTILE_SITE_KEY is missing from the deployed Pages environment.");
    }
    if (config?.reviewInviteRequired !== true) {
      fail("Review invite enforcement is not enabled in the live API.");
    }
  }

  const admin = await request(`${APEX_ORIGIN}/admin/`);
  expectStatus(admin, [302, 401, 403], "Protected admin route");

  const crossSitePost = await request(`${APEX_ORIGIN}/api/inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://attacker.invalid",
      "Sec-Fetch-Site": "cross-site",
    },
    body: JSON.stringify({ name: "Security test" }),
  });
  expectStatus(crossSitePost, 403, "Cross-site inquiry submission");

  if (errors.length) {
    console.error("Live verification failed:\n");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("Live verification passed: deployment, canonical URLs, forms, and security controls are active.");
};

run();
