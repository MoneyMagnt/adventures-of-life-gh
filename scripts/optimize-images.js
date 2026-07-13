"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const outputDirectory = path.join(root, "assets", "optimized");
const checkOnly = process.argv.includes("--check");
const images = [
  { id: "oboadaka", source: "assets/trips/oboadaka-waterfall-50-plus.webp", width: 1400 },
  { id: "shai", source: "assets/trips/shai-sayu-cave-group.jpg", width: 1440 },
  { id: "togo", source: "assets/responsive/togo-cathedral-group-1080.webp", width: 1080 },
  { id: "ada", source: "assets/responsive/ada-nkyinkyim-cover-1440.webp", width: 1440 },
  { id: "asenema", source: "assets/trips/asenema-group-home.jpg", width: 1440 },
  { id: "adakluto", source: "assets/trips/adakluto-group.webp", width: 1400 },
];

const ffmpegCheck = spawnSync("ffmpeg", ["-version"], { encoding: "utf8" });
if (!checkOnly && ffmpegCheck.status !== 0) {
  throw new Error("ffmpeg is required to generate responsive images.");
}

fs.mkdirSync(outputDirectory, { recursive: true });

const manifest = {};
for (const image of images) {
  const sourcePath = path.join(root, image.source);
  if (!fs.existsSync(sourcePath)) throw new Error(`Missing image source: ${image.source}`);

  const hash = crypto.createHash("sha256").update(fs.readFileSync(sourcePath)).digest("hex").slice(0, 10);
  const widths = [...new Set([480, 768, Math.min(image.width, 1440)])]
    .filter((width) => width <= image.width)
    .sort((left, right) => left - right);

  manifest[image.id] = { source: image.source, hash, formats: { avif: [], webp: [] } };

  for (const width of widths) {
    for (const format of ["avif", "webp"]) {
      const filename = `home-hero-${image.id}.${hash}-${width}.${format}`;
      const relativeOutput = `assets/optimized/${filename}`;
      const outputPath = path.join(root, relativeOutput);
      manifest[image.id].formats[format].push({ width, src: `/${relativeOutput}` });

      if (checkOnly) {
        if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size < 1024) {
          throw new Error(`Missing optimized image: ${relativeOutput}`);
        }
        continue;
      }

      if (fs.existsSync(outputPath)) continue;

      const codecArguments = format === "avif"
        ? ["-c:v", "libaom-av1", "-still-picture", "1", "-crf", "34", "-cpu-used", "6", "-pix_fmt", "yuv420p"]
        : ["-c:v", "libwebp", "-q:v", "78", "-compression_level", "5", "-pix_fmt", "yuv420p"];
      const result = spawnSync(
        "ffmpeg",
        [
          "-hide_banner",
          "-loglevel",
          "error",
          "-y",
          "-i",
          sourcePath,
          "-vf",
          `scale=${width}:-2:flags=lanczos`,
          "-frames:v",
          "1",
          ...codecArguments,
          outputPath,
        ],
        { encoding: "utf8" }
      );

      if (result.status !== 0) {
        throw new Error(`ffmpeg failed for ${relativeOutput}: ${result.stderr.trim()}`);
      }
    }
  }
}

const manifestPath = path.join(outputDirectory, "home-hero-manifest.json");
const manifestJson = `${JSON.stringify(manifest, null, 2)}\n`;
if (checkOnly) {
  const current = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, "utf8") : "";
  if (current !== manifestJson) throw new Error("Responsive image manifest is out of sync.");
  console.log("Responsive homepage images are present and current.");
} else {
  fs.writeFileSync(manifestPath, manifestJson, "utf8");
  console.log("Generated responsive AVIF and WebP homepage images.");
}
