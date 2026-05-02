"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const usage = () => {
  console.log(`Usage:
node scripts/generate-review-invites.js --input scripts/review-attendees.example.json --trip "Keta 3-Day Trip" --date "December 2025" [--site https://adventuresoflifegh.com] [--expires-days 21] [--output-dir scripts/output]
`);
};

const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : "";
};

const inputPath = getArg("--input");
const trip = String(getArg("--trip") || "").trim();
const tripDate = String(getArg("--date") || "").trim();
const siteOrigin = String(getArg("--site") || "https://adventuresoflifegh.com").trim().replace(/\/+$/, "");
const expiresDays = Number.parseInt(getArg("--expires-days") || "21", 10);
const outputDir = path.resolve(getArg("--output-dir") || "scripts/output");

if (!inputPath || !trip || !tripDate) {
  usage();
  process.exit(1);
}

const attendeesPath = path.resolve(inputPath);
if (!fs.existsSync(attendeesPath)) {
  console.error(`Input file not found: ${attendeesPath}`);
  process.exit(1);
}

let attendees;

try {
  attendees = JSON.parse(fs.readFileSync(attendeesPath, "utf8"));
} catch (error) {
  console.error("Could not parse the attendees JSON file.");
  process.exit(1);
}

if (!Array.isArray(attendees) || attendees.length === 0) {
  console.error("The attendees file must be a JSON array with at least one attendee.");
  process.exit(1);
}

const normalizedAttendees = attendees.map((entry, index) => {
  const name = String(entry?.name || "").trim();
  const contact = String(entry?.contact || "").trim();

  if (!name || !contact) {
    console.error(`Attendee ${index + 1} is missing a name or contact.`);
    process.exit(1);
  }

  return { name, contact };
});

const expiresAt = Number.isFinite(expiresDays) && expiresDays > 0
  ? new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toISOString()
  : "";

const slug = `${trip}-${tripDate}`
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "") || "review-invites";

fs.mkdirSync(outputDir, { recursive: true });

const escapeSql = (value) => String(value).replace(/'/g, "''");
const escapeCsv = (value) => `"${String(value).replace(/"/g, "\"\"")}"`;

const rows = normalizedAttendees.map(({ name, contact }) => {
  const token = crypto.randomBytes(24).toString("base64url");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const reviewLink = `${siteOrigin}/community?review_token=${encodeURIComponent(token)}`;

  return {
    name,
    contact,
    tokenHash,
    reviewLink,
  };
});

const sqlLines = [
  "BEGIN TRANSACTION;",
  ...rows.map(({ name, contact, tokenHash }) => {
    const values = [
      `'${escapeSql(tokenHash)}'`,
      `'${escapeSql(name)}'`,
      `'${escapeSql(contact)}'`,
      `'${escapeSql(trip)}'`,
      `'${escapeSql(tripDate)}'`,
      expiresAt ? `'${escapeSql(expiresAt)}'` : "NULL",
    ];

    return `INSERT INTO review_invites (token_hash, name, contact, trip, trip_date, expires_at) VALUES (${values.join(", ")});`;
  }),
  "COMMIT;",
  "",
].join("\n");

const csvLines = [
  "name,contact,trip,trip_date,review_link",
  ...rows.map(({ name, contact, reviewLink }) =>
    [
      escapeCsv(name),
      escapeCsv(contact),
      escapeCsv(trip),
      escapeCsv(tripDate),
      escapeCsv(reviewLink),
    ].join(",")
  ),
  "",
].join("\n");

const sqlPath = path.join(outputDir, `${slug}.sql`);
const csvPath = path.join(outputDir, `${slug}.csv`);

fs.writeFileSync(sqlPath, sqlLines, "utf8");
fs.writeFileSync(csvPath, csvLines, "utf8");

console.log(`Invite SQL written to: ${sqlPath}`);
console.log(`Invite links written to: ${csvPath}`);
console.log(`Generated ${rows.length} verified review invite link(s).`);
