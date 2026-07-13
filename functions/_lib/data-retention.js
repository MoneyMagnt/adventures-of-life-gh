"use strict";

const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

let inquirySchemaPromise = null;
let lastInquiryCleanupAt = 0;

const hasColumn = async (db, table, column) => {
  const result = await db.prepare(`PRAGMA table_info(${table})`).all();
  return (result.results || []).some((item) => item.name === column);
};

export const ensureInquiryRetention = (db) => {
  if (!inquirySchemaPromise) {
    inquirySchemaPromise = (async () => {
      if (!(await hasColumn(db, "inquiries", "updated_at"))) {
        try {
          await db.prepare("ALTER TABLE inquiries ADD COLUMN updated_at TEXT").run();
        } catch (error) {
          if (!String(error?.message || error).toLowerCase().includes("duplicate column")) {
            throw error;
          }
        }
      }

      await db
        .prepare(
          `UPDATE inquiries
           SET updated_at = created_at
           WHERE updated_at IS NULL OR updated_at = ''`
        )
        .run();

      await db
        .prepare(
          `CREATE INDEX IF NOT EXISTS idx_inquiries_updated_at
           ON inquiries (updated_at DESC, id DESC)`
        )
        .run();
    })().catch((error) => {
      inquirySchemaPromise = null;
      throw error;
    });
  }

  return inquirySchemaPromise;
};

export const cleanupExpiredInquiryData = async (db) => {
  await ensureInquiryRetention(db);

  const now = Date.now();
  if (now - lastInquiryCleanupAt < CLEANUP_INTERVAL_MS) return;

  await db
    .prepare(
      `DELETE FROM inquiries
       WHERE datetime(COALESCE(updated_at, created_at)) < datetime('now', '-24 months')`
    )
    .run();
  lastInquiryCleanupAt = now;
};
