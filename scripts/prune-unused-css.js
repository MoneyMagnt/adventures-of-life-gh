"use strict";

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const selectorParser = require("postcss-selector-parser");

const rootDir = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");
const verbose = process.argv.includes("--verbose");
const cssFiles = [
  "styles.css",
  "styles/journeys.css",
  "styles/admin.css",
  "styles/legal.css",
];
const excludedDirectories = new Set([
  ".git",
  ".github",
  ".npm-cache",
  ".tools",
  ".wrangler",
  "adventurepics",
  "adventurepics_exports",
  "adventurepics_preview",
  "functions",
  "node_modules",
  "playwright-report",
  "scripts",
  "test-results",
  "tests",
]);
const excludedFiles = new Set([
  "apex-live.html",
  "playwright.config.js",
  "www-live.html",
  "www-script.js",
]);

const collectPublicSourceFiles = (directory, files = []) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    if (entry.isFile() && excludedFiles.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectPublicSourceFiles(absolutePath, files);
    else if (/\.(?:html|js)$/i.test(entry.name)) files.push(absolutePath);
  }
  return files;
};

const publicCorpus = collectPublicSourceFiles(rootDir)
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n");

const extractClasses = (selector) => {
  const classNames = [];
  selectorParser((selectors) => {
    selectors.walkClasses((node) => classNames.push(node.value));
  }).processSync(selector);
  return classNames;
};

const removeEmptyContainers = (root) => {
  let removed = true;
  while (removed) {
    removed = false;
    root.walkAtRules((rule) => {
      if (Array.isArray(rule.nodes) && rule.nodes.length === 0) {
        rule.remove();
        removed = true;
      }
    });
  }
};

let hasUnusedRules = false;

for (const relativePath of cssFiles) {
  const absolutePath = path.join(rootDir, relativePath);
  const input = fs.readFileSync(absolutePath, "utf8");
  const root = postcss.parse(input, { from: absolutePath });
  let removedRules = 0;

  root.walkRules((rule) => {
    let classNames;
    try {
      classNames = extractClasses(rule.selector);
    } catch {
      return;
    }

    if (
      classNames.length > 0 &&
      classNames.every((className) => !publicCorpus.includes(className))
    ) {
      if (verbose) console.log(`[remove] ${relativePath}: ${rule.selector}`);
      rule.remove();
      removedRules += 1;
    }
  });

  removeEmptyContainers(root);
  const output = root.toString();
  const removedBytes = Buffer.byteLength(input) - Buffer.byteLength(output);

  if (removedRules > 0) {
    hasUnusedRules = true;
    if (!checkOnly) fs.writeFileSync(absolutePath, output, "utf8");
  }

  console.log(
    `${relativePath}: ${removedRules} unused rules, ${Math.max(removedBytes, 0)} removable bytes.`
  );
}

if (checkOnly && hasUnusedRules) {
  console.error("Unused CSS rules were found. Run npm run prune:css and review the result.");
  process.exit(1);
}
