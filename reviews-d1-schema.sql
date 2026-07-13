CREATE TABLE IF NOT EXISTS api_rate_limits (
  route TEXT NOT NULL,
  identifier TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (route, identifier, window_start)
);

CREATE TABLE IF NOT EXISTS review_invites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  trip TEXT NOT NULL,
  trip_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'issued',
  expires_at TEXT DEFAULT NULL,
  used_at TEXT DEFAULT NULL,
  review_id INTEGER DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_review_invites_status_expiry
ON review_invites (status, expires_at, id DESC);

CREATE INDEX IF NOT EXISTS idx_review_invites_status_used
ON review_invites (status, used_at, created_at);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  public_name TEXT NOT NULL,
  contact TEXT NOT NULL,
  trip TEXT NOT NULL,
  trip_date TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT NOT NULL,
  approved INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invite_id INTEGER DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_approved_created_at
ON reviews (approved, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_trip_contact
ON reviews (trip, contact);

CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_invite_id
ON reviews (invite_id)
WHERE invite_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  trip TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  source_path TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at
ON inquiries (created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_inquiries_updated_at
ON inquiries (updated_at DESC, id DESC);
