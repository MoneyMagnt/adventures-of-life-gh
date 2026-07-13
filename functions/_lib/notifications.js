"use strict";

const encoder = new TextEncoder();

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");

const signPayload = async (secret, payload) => {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
};

export const sendOperationalNotification = async (env, event, data) => {
  const webhookUrl = String(env?.NOTIFICATION_WEBHOOK_URL || "").trim();
  if (!webhookUrl) return { configured: false };

  const secret = String(env?.NOTIFICATION_WEBHOOK_SECRET || "");
  if (secret.length < 32) {
    throw new Error("NOTIFICATION_WEBHOOK_SECRET must contain at least 32 characters.");
  }

  let url;
  try {
    url = new URL(webhookUrl);
  } catch {
    throw new Error("NOTIFICATION_WEBHOOK_URL is invalid.");
  }

  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("Notification webhooks must use HTTPS.");
  }

  const body = JSON.stringify({
    event,
    sentAt: new Date().toISOString(),
    data,
  });
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "User-Agent": "Adventures-of-Life-GH/1.0",
  };
  headers["X-Adventures-Signature"] = `sha256=${await signPayload(secret, body)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  let response;
  try {
    response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Notification webhook returned ${response.status}.`);
  }

  return { configured: true, delivered: true };
};
