"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const manifestPath = path.join(root, "data", "trips.json");
const outputPath = path.join(root, "trip-data.js");
const checkOnly = process.argv.includes("--check");

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const activeTrip = manifest.trips.find((trip) => trip.id === manifest.activeTripId);

if (!activeTrip) {
  throw new Error(`Active trip ${manifest.activeTripId} does not exist in data/trips.json.`);
}

if (activeTrip.status !== "booking" || !activeTrip.bookingPath || !activeTrip.price) {
  throw new Error("The active trip must have booking status, a booking path, and pricing.");
}

const clientData = {
  schemaVersion: manifest.schemaVersion,
  updatedAt: manifest.updatedAt,
  activeTripId: manifest.activeTripId,
  activeTrip,
  trips: manifest.trips.map(({ id, name, shortName, dateLabel, status, kind, country, bookingPath, recapPath, journeySlot }) => ({
    id,
    name,
    shortName: shortName || name,
    dateLabel,
    status,
    kind,
    country,
    bookingPath: bookingPath || null,
    recapPath: recapPath || null,
    journeySlot,
  })),
};

const generated = `"use strict";\n\n// Generated from data/trips.json by scripts/sync-trip-content.js.\nwindow.AOL_TRIP_DATA = ${JSON.stringify(clientData, null, 2)};\n`;

if (checkOnly) {
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";
  if (current !== generated) {
    console.error("trip-data.js is out of sync. Run: npm run sync:trips");
    process.exit(1);
  }
  console.log("Trip manifest and generated browser data are in sync.");
} else {
  fs.writeFileSync(outputPath, generated, "utf8");
  console.log("Generated trip-data.js from data/trips.json.");
}
