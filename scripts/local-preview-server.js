"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "127.0.0.1";
const port = Number(process.argv[2] || 3001);
const rootDir = path.resolve(process.cwd());
const allowedDirectories = new Set([
  "admin",
  "assets",
  "fr",
  "styles",
  "trips",
]);
const allowedCleanRoutes = new Set([
  "about",
  "booking-terms",
  "community",
  "journeys",
  "privacy",
]);
const allowedRootFiles = new Set([
  "404.html",
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
]);

const mimeTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

const sendResponse = (response, statusCode, body, headers = {}) => {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...headers,
  });
  response.end(body);
};

const resolveFilePath = (requestUrl) => {
  let requestPath;

  try {
    requestPath = decodeURIComponent(new URL(requestUrl, `http://${host}:${port}`).pathname);
  } catch {
    return null;
  }

  const pathSegments = requestPath
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.toLowerCase());
  const isSecurityContact = requestPath.toLowerCase() === "/.well-known/security.txt";

  if (!isSecurityContact && pathSegments.some((segment) => segment.startsWith("."))) {
    return null;
  }

  const isRootRequest = pathSegments.length === 0;
  const isAllowedRootFile =
    pathSegments.length === 1 && allowedRootFiles.has(pathSegments[0]);
  const isAllowedCleanRoute =
    pathSegments.length === 1 && allowedCleanRoutes.has(pathSegments[0]);
  const isAllowedDirectory =
    pathSegments.length >= 1 && allowedDirectories.has(pathSegments[0]);

  if (
    !isRootRequest &&
    !isSecurityContact &&
    !isAllowedRootFile &&
    !isAllowedCleanRoute &&
    !isAllowedDirectory
  ) {
    return null;
  }

  const normalizedPath = path.normalize(requestPath);
  let filePath = path.resolve(rootDir, `.${normalizedPath}`);
  const relativePath = path.relative(rootDir, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  if (normalizedPath === path.sep || normalizedPath === "/") {
    filePath = path.join(rootDir, "index.html");
  } else if (!path.extname(filePath)) {
    const htmlCandidate = `${filePath}.html`;
    const directoryCandidate = path.join(filePath, "index.html");

    if (fs.existsSync(htmlCandidate)) {
      filePath = htmlCandidate;
    } else if (fs.existsSync(directoryCandidate)) {
      filePath = directoryCandidate;
    }
  }

  return filePath;
};

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    sendResponse(response, 405, "Method not allowed", {
      Allow: "GET, HEAD",
      "Content-Type": "text/plain; charset=utf-8",
    });
    return;
  }

  const filePath = resolveFilePath(request.url);

  if (!filePath) {
    sendResponse(response, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      const notFoundPath = path.join(rootDir, "404.html");

      fs.readFile(notFoundPath, (notFoundError, notFoundFile) => {
        if (notFoundError) {
          sendResponse(response, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
          return;
        }

        sendResponse(response, 404, notFoundFile, { "Content-Type": "text/html; charset=utf-8" });
      });

      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extension] || "application/octet-stream";

    fs.readFile(filePath, (readError, file) => {
      if (readError) {
        sendResponse(response, 500, "Server error", { "Content-Type": "text/plain; charset=utf-8" });
        return;
      }

      sendResponse(response, 200, request.method === "HEAD" ? null : file, {
        "Content-Type": contentType,
      });
    });
  });
});

server.listen(port, host, () => {
  console.log(`Adventures of Life preview server running at http://${host}:${port}`);
});

