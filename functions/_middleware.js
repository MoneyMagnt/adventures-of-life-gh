const CANONICAL_HOST = "adventuresoflifegh.com";
const ALIAS_HOSTS = new Set([
  "www.adventuresoflifegh.com",
  "adventures-of-life-gh.pages.dev"
]);

const applySecurityHeaders = (headers) => {
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Origin-Agent-Cluster", "?1");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Permitted-Cross-Domain-Policies", "none");
};

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const requestHostname = url.hostname;

  if (ALIAS_HOSTS.has(requestHostname)) {
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    const headers = new Headers({ Location: url.toString() });
    applySecurityHeaders(headers);
    if (requestHostname.endsWith(".pages.dev")) {
      headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    }
    return new Response(null, { status: 301, headers });
  }

  const response = await context.next();
  const headers = new Headers(response.headers);

  applySecurityHeaders(headers);

  if (url.pathname.startsWith("/api/")) {
    headers.set("Cache-Control", "no-store");
    headers.set("Cross-Origin-Resource-Policy", "same-origin");
  }

  if (requestHostname.endsWith(".pages.dev")) {
    headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
