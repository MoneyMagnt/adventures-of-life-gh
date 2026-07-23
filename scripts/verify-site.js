"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const errors = [];
const publicPages = [
  "index.html",
  "journeys.html",
  "community.html",
  "about.html",
  "privacy.html",
  "booking-terms.html",
  "404.html",
  "trips/cote-divoire-28-august/index.html",
  "fr/index.html",
  "fr/journeys/index.html",
  "fr/community/index.html",
  "fr/about/index.html",
  "fr/privacy/index.html",
  "fr/booking-terms/index.html",
  "fr/trips/cote-divoire-28-august/index.html",
];
const forbiddenPublicFiles = [
  "about/index.html",
  "community/index.html",
  "journeys/index.html",
  "mobile-preview.html",
  "mobile-preview/index.html",
  "trips/oboadaka-waterfall-27-june/index.html",
];
const javascriptFiles = [
  "script.js",
  "i18n.js",
  "trip-data.js",
  "admin.js",
  "assets/js/home-page.js",
  "assets/js/journeys-page.js",
  "assets/js/forms.js",
  "functions/_middleware.js",
  "functions/admin/_middleware.js",
  "functions/api/admin/_middleware.js",
  "functions/api/admin/dashboard.js",
  "functions/api/admin/review-invites.js",
  "functions/_lib/admin-auth.js",
  "functions/_lib/data-retention.js",
  "functions/_lib/notifications.js",
  "functions/_lib/security.js",
  "functions/api/inquiries.js",
  "functions/api/review-invite.js",
  "functions/api/reviews.js",
  "functions/api/site-config.js",
  "scripts/generate-review-invites.js",
  "scripts/build-public.js",
  "scripts/local-preview-server.js",
  "scripts/migrate-i18n-keys.js",
  "scripts/optimize-images.js",
  "scripts/prune-unused-css.js",
  "scripts/sync-trip-content.js",
  "scripts/sync-french-pages.js",
  "scripts/verify-site.js",
  "scripts/verify-live-site.js",
];

const fail = (message) => errors.push(message);
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const decodeMetadata = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&ocirc;/g, "ô")
    .replace(/&rsquo;/g, "’")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
const seoExpectations = {
  "index.html": {
    title: "Group Trips in Ghana & West Africa | Adventures of Life GH",
    description: "Join hosted group trips from Accra across Ghana and West Africa, including waterfall days, hikes, beach weekends, museum visits and cross-border experiences.",
    canonical: "https://adventuresoflifegh.com/",
  },
  "journeys.html": {
    title: "2026 Group Trips from Accra | Ghana & West Africa",
    description: "Explore the confirmed 2026 group trip lineup from Accra, including Côte d’Ivoire, Wli Waterfalls, Amedzofe, Benin and completed Adventures of Life GH trips.",
    canonical: "https://adventuresoflifegh.com/journeys",
  },
  "community.html": {
    title: "Ghana Group Trip Photos & Reviews | Adventures of Life GH",
    description: "See real Ghana group trip photos, verified traveller reviews and the 50+ person Oboadaka Waterfall recap from Adventures of Life GH.",
    canonical: "https://adventuresoflifegh.com/community",
  },
  "about.html": {
    title: "About Adventures of Life GH | Group Trips from Accra",
    description: "Meet Zico, founder and trip host at Adventures of Life GH, and learn how the community grew from one group trip into routes across Ghana and West Africa.",
    canonical: "https://adventuresoflifegh.com/about",
  },
  "trips/cote-divoire-28-august/index.html": {
    title: "Côte d’Ivoire Group Trip from Accra | 28 Aug 2026",
    description: "Book a four-day Côte d’Ivoire group trip from Accra, departing 28 August 2026. GHS 3,300 total, with a GHS 500 deposit, transport, stays and meals included.",
    canonical: "https://adventuresoflifegh.com/trips/cote-divoire-28-august/",
  },
  "fr/index.html": {
    title: "Voyages de groupe au Ghana | Adventures of Life GH",
    description: "Rejoins des voyages de groupe au départ d'Accra, au Ghana et en Afrique de l'Ouest : cascades, randonnées, plages, musées et expériences transfrontalières.",
    canonical: "https://adventuresoflifegh.com/fr/",
  },
  "fr/journeys/index.html": {
    title: "Voyages 2026 depuis Accra | Ghana & Afrique de l'Ouest",
    description: "Découvre le programme confirmé des voyages de groupe 2026 au départ d'Accra : Côte d'Ivoire, cascades de Wli, Amedzofe, Bénin et voyages déjà réalisés.",
    canonical: "https://adventuresoflifegh.com/fr/journeys",
  },
  "fr/community/index.html": {
    title: "Photos & avis de voyages au Ghana | Adventures of Life GH",
    description: "Découvre de vraies photos de voyages de groupe au Ghana, des avis vérifiés et le retour en images d'Oboadaka avec plus de 50 participants.",
    canonical: "https://adventuresoflifegh.com/fr/community",
  },
  "fr/about/index.html": {
    title: "Adventures of Life GH | Voyages de groupe depuis Accra",
    description: "Rencontre Zico, fondateur et hôte des voyages Adventures of Life GH, et découvre comment la communauté s'est développée au Ghana et en Afrique de l'Ouest.",
    canonical: "https://adventuresoflifegh.com/fr/about",
  },
  "fr/trips/cote-divoire-28-august/index.html": {
    title: "Voyage en Côte d'Ivoire depuis Accra | 28 août 2026",
    description: "Réserve un voyage de groupe de quatre jours en Côte d'Ivoire au départ d'Accra le 28 août 2026 : 3 300 GHS, acompte de 500 GHS, transport, hébergement et repas inclus.",
    canonical: "https://adventuresoflifegh.com/fr/trips/cote-divoire-28-august/",
  },
};

const securityContact = read(".well-known/security.txt");
if (!securityContact.includes("Canonical: https://adventuresoflifegh.com/.well-known/security.txt")) {
  fail(".well-known/security.txt is missing its canonical security contact URL.");
}

for (const relativePath of publicPages) {
  if (!exists(relativePath)) {
    fail(`Missing public page: ${relativePath}`);
  }
}

for (const relativePath of forbiddenPublicFiles) {
  if (exists(relativePath)) {
    fail(`Obsolete or duplicate public page still exists: ${relativePath}`);
  }
}

if (!exists("admin/index.html")) {
  fail("Missing protected admin interface: admin/index.html");
}

const resolvePublicReference = (rawReference) => {
  if (!rawReference.startsWith("/") || rawReference.startsWith("//")) return null;

  const pathname = rawReference.split(/[?#]/, 1)[0];
  if (!pathname || pathname === "/") return "index.html";
  if (pathname.startsWith("/api/")) return null;

  const relative = decodeURIComponent(pathname).replace(/^\/+/, "");
  const direct = path.join(root, relative);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return relative;
  if (fs.existsSync(`${direct}.html`)) return `${relative}.html`;

  const directoryIndex = path.join(direct, "index.html");
  if (fs.existsSync(directoryIndex)) return path.join(relative, "index.html");
  return false;
};

for (const relativePath of publicPages) {
  if (!exists(relativePath)) continue;
  const html = read(relativePath);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const canonicalCount = (html.match(/<link\s+rel=["']canonical["']/gi) || []).length;

  if (h1Count !== 1) fail(`${relativePath} has ${h1Count} H1 elements; expected exactly one.`);
  if (relativePath !== "404.html" && canonicalCount !== 1) {
    fail(`${relativePath} has ${canonicalCount} canonical links; expected exactly one.`);
  }
  if (relativePath !== "404.html") {
    for (const language of ["en", "fr", "x-default"]) {
      if (!new RegExp(`<link\\s+rel=["']alternate["'][^>]+hreflang=["']${language}["']`, "i").test(html)) {
        fail(`${relativePath} is missing the ${language} hreflang alternate.`);
      }
    }
  }
  if (relativePath.startsWith("fr/") && !/<html\s+lang=["']fr["']/i.test(html)) {
    fail(`${relativePath} is a French route without lang=fr.`);
  }
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${relativePath} is missing a title.`);
  if (!/<meta\s+name=["']description["']/i.test(html)) {
    fail(`${relativePath} is missing a meta description.`);
  }

  const expectedSeo = seoExpectations[relativePath];
  if (expectedSeo) {
    const title = decodeMetadata(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
    const descriptionTag = html.match(/<meta\s+name=["']description["'][^>]*>/i)?.[0] || "";
    const description = decodeMetadata(descriptionTag.match(/content=(["'])(.*?)\1/i)?.[2] || "");
    const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] || "";

    if (title !== expectedSeo.title) {
      fail(`${relativePath} has an unexpected SEO title: ${title}`);
    }
    if (description !== expectedSeo.description) {
      fail(`${relativePath} has an unexpected meta description.`);
    }
    if (canonical !== expectedSeo.canonical) {
      fail(`${relativePath} has canonical ${canonical}; expected ${expectedSeo.canonical}.`);
    }
  }

  for (const scriptTag of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attributes = scriptTag[1];
    const content = scriptTag[2].trim();
    const isExternal = /\bsrc=["'][^"']+["']/i.test(attributes);
    const isStructuredData = /\btype=["']application\/ld\+json["']/i.test(attributes);
    if (isStructuredData && content) {
      try {
        JSON.parse(content);
      } catch (error) {
        fail(`${relativePath} contains invalid JSON-LD: ${error.message}`);
      }
    }
    if (!isExternal && !isStructuredData && content) {
      fail(`${relativePath} contains executable inline JavaScript, which violates the site CSP.`);
    }
  }

  const references = html.matchAll(/(?:href|src)=["']([^"']+)["']/gi);
  for (const match of references) {
    const resolved = resolvePublicReference(match[1]);
    if (resolved === false) {
      fail(`${relativePath} references a missing local file or route: ${match[1]}`);
    }
  }
}

const searchableFiles = ["index.html", "journeys.html", "community.html", "script.js", "sitemap.xml"];
for (const relativePath of searchableFiles) {
  if (read(relativePath).includes("/trips/oboadaka-waterfall-27-june")) {
    fail(`${relativePath} still links to the expired Oboadaka booking page.`);
  }
}

const sitemap = read("sitemap.xml");
if (!sitemap.includes("<loc>https://adventuresoflifegh.com/trips/cote-divoire-28-august/</loc>")) {
  fail("sitemap.xml does not include the current Cote d'Ivoire trip page.");
}
if (sitemap.includes("<loc>https://adventuresoflifegh.com/trips/cote-divoire-28-august</loc>")) {
  fail("sitemap.xml lists the redirecting Cote d'Ivoire URL instead of its canonical URL.");
}

const tripManifest = JSON.parse(read("data/trips.json"));
const activeTrip = tripManifest.trips.find((trip) => trip.id === tripManifest.activeTripId);
if (!activeTrip) {
  fail("data/trips.json points to an active trip that does not exist.");
} else {
  const criticalSurfaces = ["index.html", "journeys.html", "sitemap.xml"];
  criticalSurfaces.forEach((relativePath) => {
    const content = read(relativePath);
    if (!content.includes(activeTrip.bookingPath)) {
      fail(`${relativePath} does not use the active trip booking path from data/trips.json.`);
    }
  });

  const landingPath = `${activeTrip.bookingPath.replace(/^\/+|\/+$/g, "")}/index.html`;
  if (!exists(landingPath)) {
    fail(`The active trip landing page does not exist: ${landingPath}`);
  } else {
    const landing = read(landingPath);
    for (const value of [activeTrip.price.amount, activeTrip.price.deposit]) {
      if (!landing.includes(String(value))) {
        fail(`${landingPath} is missing active trip price value ${value}.`);
      }
    }
  }
}
if (sitemap.includes("/trips/oboadaka-waterfall-27-june")) {
  fail("sitemap.xml still includes the expired Oboadaka booking page.");
}

const coteLanding = read("trips/cote-divoire-28-august/index.html");
if (!coteLanding.includes('"@type": "TouristTrip"')) {
  fail("The Cote d'Ivoire landing page is missing TouristTrip structured data.");
}
if (coteLanding.includes('"@type": "Event"')) {
  fail("The Cote d'Ivoire tour package must not be marked up as a Google Event.");
}

const publicJavaScript = [
  "script.js",
  "i18n.js",
  "trip-data.js",
  "admin.js",
  "assets/js/home-page.js",
  "assets/js/journeys-page.js",
  "assets/js/forms.js",
];
const unsafeDomSinks = /\b(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval|Function)\b/;
for (const relativePath of publicJavaScript) {
  if (exists(relativePath) && unsafeDomSinks.test(read(relativePath))) {
    fail(`${relativePath} contains an avoidable DOM or code-execution sink.`);
  }
}

const headersFile = read("_headers");
for (const directive of [
  "Content-Security-Policy:",
  "Strict-Transport-Security:",
  "X-Content-Type-Options: nosniff",
  "X-Frame-Options: DENY",
  "Referrer-Policy:",
  "Permissions-Policy:",
]) {
  if (!headersFile.includes(directive)) {
    fail(`_headers is missing required security directive: ${directive}`);
  }
}

const previewServer = read("scripts/local-preview-server.js");
if (!previewServer.includes('const host = "127.0.0.1"')) {
  fail("The local preview server is not bound exclusively to 127.0.0.1.");
}
if (!previewServer.includes("allowedRootFiles") || !previewServer.includes("allowedDirectories")) {
  fail("The local preview server is not using an explicit public allowlist.");
}

for (const relativePath of javascriptFiles) {
  if (!exists(relativePath)) {
    fail(`Missing JavaScript file: ${relativePath}`);
    continue;
  }

  const result = spawnSync(process.execPath, ["--check", path.join(root, relativePath)], {
    encoding: "utf8",
  });
  if (result.status !== 0) {
    fail(`JavaScript syntax check failed for ${relativePath}: ${result.stderr.trim()}`);
  }
}

if (errors.length) {
  console.error("Site verification failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Site verification passed: ${publicPages.length} pages and ${javascriptFiles.length} scripts checked.`);
