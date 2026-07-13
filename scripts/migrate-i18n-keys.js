"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "data", "i18n-fr-stable.json");
const pages = [
  { source: "index.html", prefix: "home" },
  { source: "journeys.html", prefix: "journeys" },
  { source: "community.html", prefix: "community" },
  { source: "about.html", prefix: "about" },
  { source: "privacy.html", prefix: "privacy" },
  { source: "booking-terms.html", prefix: "booking" },
  { source: "trips/cote-divoire-28-august/index.html", prefix: "cote" },
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
const catalog = fs.existsSync(catalogPath)
  ? JSON.parse(fs.readFileSync(catalogPath, "utf8"))
  : { version: 1, locale: "fr", messages: {} };

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

const normalize = (value) => decodeEntities(String(value)).replace(/\s+/g, " ").trim();
let added = 0;

for (const page of pages) {
  const sourcePath = path.join(root, page.source);
  const html = fs.readFileSync(sourcePath, "utf8");
  const usedNumbers = Object.keys(catalog.messages)
    .filter((key) => key.startsWith(`${page.prefix}.text.`))
    .map((key) => Number.parseInt(key.split(".").at(-1), 10))
    .filter(Number.isFinite);
  let nextNumber = usedNumbers.length ? Math.max(...usedNumbers) + 1 : 1;

  const protectedBlocks = [];
  const protect = (block) => {
    const marker = `<aol-i18n-protected data-index="${protectedBlocks.length}"></aol-i18n-protected>`;
    protectedBlocks.push(block);
    return marker;
  };

  let migrated = html.replace(
    /<!--i18n:[a-z0-9._-]+-->[\s\S]*?<!--\/i18n-->/gi,
    protect
  );
  migrated = migrated.replace(
    /<(script|style|svg|textarea|code|pre)\b[\s\S]*?<\/\1>/gi,
    protect
  );
  migrated = migrated.replace(/<!--[\s\S]*?-->/g, protect);

  migrated = migrated.replace(/(<body\b[^>]*>)([\s\S]*?)(<\/body>)/i, (full, open, body, close) => {
    const keyedBody = body.replace(/>([^<>]+)</g, (segment, text) => {
      const source = normalize(text);
      const translated = translations[source];
      if (!source || !translated) {
        return segment;
      }

      const key = `${page.prefix}.text.${String(nextNumber).padStart(3, "0")}`;
      nextNumber += 1;
      const leading = text.match(/^\s*/)?.[0] || "";
      const trailing = text.match(/\s*$/)?.[0] || "";
      const core = text.slice(leading.length, text.length - trailing.length || undefined);
      catalog.messages[key] = { en: source, fr: translated };
      added += 1;
      return `>${leading}<!--i18n:${key}-->${core}<!--/i18n-->${trailing}<`;
    });
    return `${open}${keyedBody}${close}`;
  });

  protectedBlocks.forEach((block, index) => {
    migrated = migrated.replace(
      `<aol-i18n-protected data-index="${index}"></aol-i18n-protected>`,
      block
    );
  });

  if (migrated !== html) {
    fs.writeFileSync(sourcePath, migrated, "utf8");
  }
}

fs.mkdirSync(path.dirname(catalogPath), { recursive: true });
fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`Stable i18n migration complete: ${added} body messages keyed.`);
