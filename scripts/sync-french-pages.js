"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");
const auditMissing = process.argv.includes("--audit-missing");
const missingTranslations = new Set();
const unkeyedTranslations = new Set();
const origin = "https://adventuresoflifegh.com";
const pages = [
  { source: "index.html", route: "/" },
  { source: "journeys.html", route: "/journeys" },
  { source: "community.html", route: "/community" },
  { source: "about.html", route: "/about" },
  { source: "privacy.html", route: "/privacy" },
  { source: "booking-terms.html", route: "/booking-terms" },
  { source: "trips/cote-divoire-28-august/index.html", route: "/trips/cote-divoire-28-august/" },
];

const sandbox = {
  window: {},
  document: { addEventListener() {} },
  console,
};
vm.runInNewContext(fs.readFileSync(path.join(root, "i18n.js"), "utf8"), sandbox, {
  filename: "i18n.js",
});

const translations = sandbox.window.AOL_I18N_DATA?.translations?.fr || {};
const attributeTranslations = sandbox.window.AOL_I18N_DATA?.attributeTranslations?.fr || {};
const metaTranslations = sandbox.window.AOL_I18N_DATA?.pageMetaTranslations?.fr || {};
const stableCatalogPath = path.join(root, "data", "i18n-fr-stable.json");
const stableMessages = fs.existsSync(stableCatalogPath)
  ? JSON.parse(fs.readFileSync(stableCatalogPath, "utf8")).messages || {}
  : {};

if (!Object.keys(translations).length) {
  throw new Error("Could not load the French translation dictionary from i18n.js.");
}

const entityMap = {
  amp: "&", apos: "'", gt: ">", lt: "<", nbsp: " ", quot: '"',
  agrave: "à", Agrave: "À", acirc: "â", ccedil: "ç", Ccedil: "Ç",
  eacute: "é", Eacute: "É", egrave: "è", ecirc: "ê", euml: "ë",
  icirc: "î", iuml: "ï", ocirc: "ô", Ocirc: "Ô", ouml: "ö",
  ugrave: "ù", ucirc: "û", uuml: "ü", rsquo: "’", lsquo: "‘",
  rdquo: "”", ldquo: "“", ndash: "–", mdash: "—", middot: "·",
};

const decodeEntities = (value) =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&([a-zA-Z]+);/g, (match, name) => entityMap[name] ?? match);

const escapeText = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const escapeAttribute = (value) =>
  escapeText(value).replace(/"/g, "&quot;");

const normalize = (value) => decodeEntities(String(value)).replace(/\s+/g, " ").trim();

const frenchRoute = (route) => (route === "/" ? "/fr/" : `/fr${route}`);
const normalizeRoutePath = (route) => (route === "/" ? "/" : route.replace(/\/+$/, ""));

const rewriteUrl = (value) => {
  let url;
  let absolute = false;
  try {
    if (value.startsWith(origin)) {
      url = new URL(value);
      absolute = true;
    } else if (value.startsWith("/")) {
      url = new URL(value, origin);
    } else {
      return value;
    }
  } catch {
    return value;
  }

  const routes = pages.map((page) => page.route).sort((left, right) => right.length - left.length);
  const matched = routes.find((route) =>
    normalizeRoutePath(url.pathname) === normalizeRoutePath(route)
  );
  if (!matched) return value;

  url.pathname = frenchRoute(matched);
  return absolute ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
};

const translateJson = (value, propertyName = "") => {
  if (Array.isArray(value)) return value.map((nested) => translateJson(nested, propertyName));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, translateJson(nested, key)]));
  }
  if (typeof value !== "string") return value;
  if (propertyName === "inLanguage" && value === "en") return "fr";
  if (value.startsWith(origin) || value.startsWith("/")) return rewriteUrl(value);
  const key = normalize(value);
  return translations[key] || metaTranslations[key] || value;
};

const translatePage = (sourceHtml, route) => {
  const englishUrl = `${origin}${route === "/" ? "/" : route}`;
  const frenchUrl = `${origin}${frenchRoute(route)}`;
  let html = sourceHtml;

  html = html.replace(
    /<script\b([^>]*)type=["']application\/ld\+json["']([^>]*)>([\s\S]*?)<\/script>/gi,
    (full, before, after, content) => {
      try {
        const localized = translateJson(JSON.parse(content));
        return `<script${before}type="application/ld+json"${after}>\n${JSON.stringify(localized, null, 2)}\n    </script>`;
      } catch {
        return full;
      }
    }
  );

  const protectedBlocks = [];
  html = html.replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, (block) => {
    const marker = `__AOL_PROTECTED_BLOCK_${protectedBlocks.length}__`;
    protectedBlocks.push(block);
    return marker;
  });

  const stableBlocks = [];
  html = html.replace(
    /<!--i18n:([a-z0-9._-]+)-->([\s\S]*?)<!--\/i18n-->/gi,
    (full, key, sourceText) => {
      const message = stableMessages[key];
      if (!message?.fr) {
        throw new Error(`Missing stable French translation for ${key}.`);
      }
      if (message.en && normalize(sourceText) !== message.en) {
        throw new Error(
          `English copy for ${key} changed. Update data/i18n-fr-stable.json before generating French pages.`
        );
      }
      const marker = `__AOL_STABLE_TEXT_${stableBlocks.length}__`;
      stableBlocks.push(`<!--i18n:${key}-->${escapeText(message.fr)}<!--/i18n-->`);
      return marker;
    }
  );

  html = html.replace(/<title>([\s\S]*?)<\/title>/i, (full, text) => {
    const translated = metaTranslations[normalize(text)] || translations[normalize(text)];
    return translated ? `<title>${escapeText(translated)}</title>` : full;
  });

  html = html.replace(/<meta\b[^>]*>/gi, (tag) => {
    if (!/(?:name|property)=["'](?:description|og:title|og:description|twitter:title|twitter:description)["']/i.test(tag)) return tag;
    return tag.replace(/content=(["'])(.*?)\1/i, (attribute, quote, content) => {
      const translated = metaTranslations[normalize(content)] || translations[normalize(content)];
      return translated ? `content=${quote}${escapeAttribute(translated)}${quote}` : attribute;
    });
  });

  html = html.replace(/(<body\b[^>]*>)([\s\S]*?)(<\/body>)/i, (full, open, body, close) => {
    const translatedBody = body.replace(/>([^<>]+)</g, (segment, text) => {
      const key = normalize(text);
      const translated = translations[key];
      if (!translated) {
        if (auditMissing && key.length >= 24 && /[A-Za-z]/.test(key) && !/^https?:/i.test(key) && !key.includes("__AOL_PROTECTED_BLOCK_") && !key.includes("__AOL_STABLE_TEXT_")) {
          missingTranslations.add(key);
        }
        return segment;
      }
      unkeyedTranslations.add(`${route}: ${key}`);
      const leading = text.match(/^\s*/)?.[0] || "";
      const trailing = text.match(/\s*$/)?.[0] || "";
      return `>${leading}${escapeText(translated)}${trailing}<`;
    });
    return `${open}${translatedBody}${close}`;
  });

  html = html.replace(/\b(aria-label|title|placeholder|data-message)=(["'])(.*?)\2/gi, (full, attribute, quote, content) => {
    const translated = attributeTranslations[normalize(content)] || translations[normalize(content)];
    return translated ? `${attribute}=${quote}${escapeAttribute(translated)}${quote}` : full;
  });

  protectedBlocks.forEach((block, index) => {
    html = html.replace(`__AOL_PROTECTED_BLOCK_${index}__`, block);
  });
  stableBlocks.forEach((block, index) => {
    html = html.replace(`__AOL_STABLE_TEXT_${index}__`, block);
  });

  html = html.replace(/\bhref=(["'])(.*?)\1/gi, (full, quote, href) => {
    const rewritten = rewriteUrl(decodeEntities(href));
    return `href=${quote}${escapeAttribute(rewritten)}${quote}`;
  });
  html = html.replace(/<html\s+lang=["'][^"']+["']/i, '<html lang="fr"');
  html = html.replace(/<body\b([^>]*)>/i, (full, attributes) =>
    attributes.includes("data-static-locale")
      ? full
      : `<body${attributes} data-static-locale="fr">`
  );

  html = html.replace(/\s*<link\b[^>]*rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*\/?>/gi, "");
  html = html.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][^"']+["']\s*\/?>/i,
    `<link rel="canonical" href="${frenchUrl}" />\n    <link rel="alternate" hreflang="en" href="${englishUrl}" />\n    <link rel="alternate" hreflang="fr" href="${frenchUrl}" />\n    <link rel="alternate" hreflang="x-default" href="${englishUrl}" />`
  );
  html = html.replace(/<meta\s+property=["']og:url["']\s+content=["'][^"']+["']\s*\/?>/i, `<meta property="og:url" content="${frenchUrl}" />`);
  html = html.replace(/<meta\s+property=["']og:site_name["']/i, '<meta property="og:locale" content="fr_FR" />\n    <meta property="og:locale:alternate" content="en_GH" />\n    <meta property="og:site_name"');

  return html;
};

for (const page of pages) {
  const source = fs.readFileSync(path.join(root, page.source), "utf8");
  const generated = translatePage(source, page.route);
  const output = path.join(root, frenchRoute(page.route).replace(/^\//, ""), "index.html");

  if (checkOnly) {
    const current = fs.existsSync(output) ? fs.readFileSync(output, "utf8") : "";
    if (current !== generated) {
      console.error(`${path.relative(root, output)} is out of sync. Run: npm run sync:fr`);
      process.exitCode = 1;
    }
  } else {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, generated, "utf8");
  }
}

if (!process.exitCode) {
  console.log(checkOnly ? "French pages are in sync." : `Generated ${pages.length} French pages.`);
}

if (checkOnly && unkeyedTranslations.size) {
  console.error("French body copy still depends on exact English text. Run: npm run i18n:migrate");
  [...unkeyedTranslations].sort().forEach((value) => console.error(`- ${value}`));
  process.exitCode = 1;
}

if (auditMissing && missingTranslations.size) {
  console.log("\nPotentially untranslated visible strings:");
  [...missingTranslations].sort().forEach((value) => console.log(`- ${value}`));
}
