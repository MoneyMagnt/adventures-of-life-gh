"use strict";

const { test, expect } = require("@playwright/test");

const dismissPopupBeforeLoad = async (page) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("aol-next-trip-popup-dismissed-at", String(Date.now()));
  });
};

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) => route.abort());
});

test("homepage stays inside every target viewport and the menu remains usable", async ({ page }) => {
  await dismissPopupBeforeLoad(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toHaveCount(1);

  const widthState = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(widthState.scrollWidth).toBeLessThanOrEqual(widthState.clientWidth + 1);

  if ((page.viewportSize()?.width || 0) < 1024) {
    await page.evaluate(() => window.scrollTo(0, Math.min(1200, document.body.scrollHeight / 2)));
    const toggle = page.locator("[data-menu-toggle]");
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    const panel = page.locator("[data-menu-panel]");
    await expect(panel).toHaveClass(/is-open/);
    await expect(panel.locator('.site-menu-nav a[href="/journeys"]')).toBeVisible();
    const panelState = await panel.evaluate((element) => ({
      clientHeight: element.clientHeight,
      overflowY: getComputedStyle(element).overflowY,
    }));
    expect(["auto", "scroll"]).toContain(panelState.overflowY);
    expect(panelState.clientHeight).toBeGreaterThan(0);
  } else {
    await expect(page.locator("[data-menu-toggle]")).toBeHidden();
    await expect(page.locator('.site-menu-nav a[href="/journeys"]')).toBeVisible();
    await expect(page.locator('.site-menu-actions a[href="/#contact"]')).toBeVisible();
    await expect(page.locator("[data-language-switcher]")).toBeVisible();
    await expect(page.locator(".site-menu-social .social-link")).toHaveCount(4);
  }
});

test("journeys journal fits every target viewport", async ({ page }) => {
  await page.goto("/journeys", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".jy-journal-page")).toBeVisible();
  await expect(page.locator(".jy-stop")).toHaveCount(10);
  await expect(
    page.locator('.jy-stop.is-next[data-stop="july"] .jy-stop-cta[data-message*="31 July"]')
  ).toBeVisible();

  const widthState = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(widthState.scrollWidth).toBeLessThanOrEqual(widthState.clientWidth + 1);
});

test("mobile menu remains available while scrolling across primary pages", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "phone-360x640", "Run the cross-page menu sweep once.");

  for (const route of ["/", "/journeys", "/community", "/about"]) {
    await dismissPopupBeforeLoad(page);
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => window.scrollTo(0, Math.min(1200, document.body.scrollHeight / 2)));

    const toggle = page.locator("[data-menu-toggle]");
    await expect(toggle, route).toBeVisible();
    await toggle.click();
    await expect(toggle, route).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("[data-menu-panel]"), route).toHaveClass(/is-open/);
    await page.keyboard.press("Escape");
    await expect(toggle, route).toHaveAttribute("aria-expanded", "false");
  }
});

test("current trip and clean public routes render", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1024", "Run the route sweep once.");
  await dismissPopupBeforeLoad(page);
  const routes = ["/", "/journeys", "/community", "/about", "/privacy", "/booking-terms", "/trips/cote-divoire-28-august", "/fr/", "/fr/journeys", "/fr/community", "/fr/about", "/fr/privacy", "/fr/booking-terms", "/fr/trips/cote-divoire-28-august"];

  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1"), route).toHaveCount(1);
  }
});

test("language switch moves between crawlable English and French routes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1024", "Run the locale navigation check once.");
  test.setTimeout(60000);
  await dismissPopupBeforeLoad(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await Promise.all([
    page.waitForURL(/\/fr\/$/, { waitUntil: "domcontentloaded" }),
    page.locator('[data-lang-option="fr"]').click(),
  ]);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator("h1")).toContainText("On le voit déjà");
  await Promise.all([
    page.waitForURL(/\/$/, { waitUntil: "domcontentloaded" }),
    page.locator('[data-lang-option="en"]').click(),
  ]);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.evaluate(() => window.localStorage.setItem("aol-language", "fr"));
  await page.goto("/journeys", { waitUntil: "domcontentloaded" });
  await page.waitForURL(/\/fr\/journeys\/?$/, { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});

test("form controllers load only on pages that use them", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1024", "Run the form module check once.");
  await dismissPopupBeforeLoad(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('select[name="interest"] option').first()).toContainText(
    "La Côte d’Ivoire Experience (next trip)"
  );
  await expect(page.locator('script[src*="/assets/js/forms.js"]')).toHaveCount(1);

  await page.goto("/community", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#review-invite-status")).toContainText("Local preview");
  await expect(page.locator('script[src*="/assets/js/forms.js"]')).toHaveCount(1);

  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await expect(page.locator('script[src*="/assets/js/forms.js"]')).toHaveCount(0);
});

test("next-trip popup can be closed on the shortest phone and stays dismissed", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "phone-360x640", "Popup geometry is tested on the shortest target phone.");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.localStorage.removeItem("aol-next-trip-popup-dismissed-at"));
  await page.reload({ waitUntil: "domcontentloaded" });

  const popup = page.locator("[data-next-trip-popup]");
  await expect(popup).toHaveClass(/is-open/, { timeout: 5000 });
  const close = popup.locator(".fg-next-trip-close");
  await expect(close).toBeVisible();
  const closeBox = await close.boundingBox();
  expect(closeBox).not.toBeNull();
  expect(closeBox.y).toBeGreaterThanOrEqual(0);
  expect(closeBox.y + closeBox.height).toBeLessThanOrEqual(640);
  await close.click();
  await expect(popup).toBeHidden();

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2200);
  await expect(popup).toBeHidden();
});

test("homepage gallery is large, control-free, and draggable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "Run the desktop gesture check once.");
  await dismissPopupBeforeLoad(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const carousel = page.locator("[data-home-hero-carousel]");
  await expect(carousel.locator("button")).toHaveCount(0);
  await expect(carousel.locator(".fg-hero-carousel-controls, .fg-hero-carousel-dots")).toHaveCount(0);

  const viewport = carousel.locator(".fg-hero-carousel-viewport");
  const viewportBox = await viewport.boundingBox();
  expect(viewportBox).not.toBeNull();
  expect(viewportBox.height).toBeGreaterThanOrEqual(600);

  const track = page.locator("[data-home-hero-track]");
  const initialTransform = await track.evaluate((element) => element.style.transform);
  await page.mouse.move(viewportBox.x + viewportBox.width * 0.72, viewportBox.y + viewportBox.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(viewportBox.x + viewportBox.width * 0.24, viewportBox.y + viewportBox.height * 0.5, { steps: 6 });
  await page.mouse.up();
  await expect.poll(() => track.evaluate((element) => element.style.transform)).not.toBe(initialTransform);
});

test("local preview refuses private repository files", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1024", "Run the security route sweep once.");
  const privateRoutes = [
    "/.git/HEAD",
    "/functions/api/reviews.js",
    "/scripts/local-preview-server.js",
    "/reviews-d1-schema.sql",
    "/_headers",
    "/package.json",
    "/playwright.config.js",
    "/tests/site.spec.js",
    "/data/trips.json",
  ];

  for (const route of privateRoutes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(403);
  }

  const publicController = await request.get("/assets/js/home-page.js");
  expect(publicController.status()).toBe(200);
  expect(publicController.headers()["content-type"]).toContain("text/javascript");

  const securityContact = await request.get("/.well-known/security.txt");
  expect(securityContact.status()).toBe(200);
  expect(await securityContact.text()).toContain("Contact: https://wa.me/233551472190");
});
