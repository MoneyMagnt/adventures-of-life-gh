"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "0.0.0.0";
const port = Number(process.argv[2] || 3001);
const rootDir = process.cwd();

const mimeTypes = {
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
  ".xml": "application/xml; charset=utf-8",
};

const sendResponse = (response, statusCode, body, headers = {}) => {
  response.writeHead(statusCode, headers);
  response.end(body);
};

const resolveFilePath = (requestUrl) => {
  const requestPath = decodeURIComponent(new URL(requestUrl, `http://${host}:${port}`).pathname);
  const normalizedPath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(rootDir, normalizedPath);

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
  const filePath = resolveFilePath(request.url);

  if (!filePath.startsWith(rootDir)) {
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

      sendResponse(response, 200, file, { "Content-Type": contentType });
    });
  });
});

server.listen(port, host, () => {
  console.log(`Adventures of Life preview server running at http://${host}:${port}`);
});

