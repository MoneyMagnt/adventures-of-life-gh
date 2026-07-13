"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "dist");
const rootFiles = [
  "404.html",
  "_headers",
  "_redirects",
  "about.html",
  "admin.js",
  "adventuresoflifelogo.jpg",
  "booking-terms.html",
  "community.html",
  "favicon.ico",
  "i18n.js",
  "index.html",
  "journeys.html",
  "privacy.html",
  "robots.txt",
  "script.js",
  "sitemap.xml",
  "styles.css",
  "trip-data.js",
];
const publicDirectories = [
  ".well-known",
  "admin",
  "assets/js",
  "fr",
  "styles",
  "trips/cote-divoire-28-august",
];
const textExtensions = new Set([".css", ".html", ".js", ".json", ".xml"]);
const copied = new Set();

const assertInsideRoot = (target) => {
  const resolved = path.resolve(target);
  if (resolved !== output && !resolved.startsWith(`${output}${path.sep}`)) {
    throw new Error(`Refusing to write outside dist: ${resolved}`);
  }
};

const copyFile = (relativePath) => {
  const cleanPath = relativePath.replace(/^[/\\]+/, "").replace(/\\/g, "/");
  const source = path.join(root, cleanPath);
  const destination = path.join(output, cleanPath);
  assertInsideRoot(destination);

  if (!fs.existsSync(source) || !fs.statSync(source).isFile()) {
    throw new Error(`Missing public build file: ${cleanPath}`);
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
  copied.add(cleanPath);
};

const copyDirectory = (relativeDirectory) => {
  const sourceDirectory = path.join(root, relativeDirectory);
  for (const entry of fs.readdirSync(sourceDirectory, { withFileTypes: true })) {
    const relativePath = path.posix.join(relativeDirectory.replace(/\\/g, "/"), entry.name);
    if (entry.isDirectory()) {
      copyDirectory(relativePath);
    } else if (entry.isFile()) {
      copyFile(relativePath);
    }
  }
};

assertInsideRoot(output);
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

rootFiles.forEach(copyFile);
publicDirectories.forEach(copyDirectory);

const assetReferences = new Set();
for (const relativePath of [...copied]) {
  if (!textExtensions.has(path.extname(relativePath).toLowerCase())) continue;
  const content = fs.readFileSync(path.join(root, relativePath), "utf8");
  for (const match of content.matchAll(/(?:^|["'(=,\s])\/?(assets\/[A-Za-z0-9._~!$&'()*+,;=:@%/-]+)/g)) {
    const assetPath = decodeURIComponent(match[1]).split(/[?#]/)[0];
    assetReferences.add(assetPath);
  }
}

assetReferences.forEach(copyFile);

const forbiddenNames = new Set([
  ".env",
  ".git",
  ".wrangler",
  "data",
  "functions",
  "node_modules",
  "package.json",
  "reviews-d1-schema.sql",
  "scripts",
  "security-tests",
  "tests",
]);
const outputFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (forbiddenNames.has(entry.name)) {
      throw new Error(`Private path entered the public build: ${entry.name}`);
    }
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolutePath);
    if (entry.isFile()) outputFiles.push(absolutePath);
  }
};
walk(output);

const oversized = outputFiles.find((file) => fs.statSync(file).size > 25 * 1024 * 1024);
if (oversized) {
  throw new Error(`Public file exceeds Cloudflare's 25 MiB limit: ${path.relative(output, oversized)}`);
}

const totalBytes = outputFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);
console.log(
  `Public build ready: ${outputFiles.length} files, ${(totalBytes / 1024 / 1024).toFixed(2)} MiB.`
);
