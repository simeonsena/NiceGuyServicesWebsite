import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function gotoReady(page: import("@playwright/test").Page, path: string) {
  await page.goto(path);
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
}

test("desktop navigation, brand, homepage content, and pricing are accurate", async ({
  page,
}) => {
  await gotoReady(page, "/");
  await expect(
    page.getByRole("heading", { level: 1, name: /Honest Appliance Repair/i }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("banner")
      .getByRole("link", { name: /Nice Guy Appliance Services home/i }),
  ).toHaveAttribute("href", "/");
  await expect(
    page.locator('img[alt="Nice Guy Appliance Services"]').first(),
  ).toBeVisible();
  for (const appliance of [
    "Washer",
    "Dryer",
    "Dishwasher",
    "Oven",
    "Microwave",
  ])
    await expect(
      page.getByRole("heading", { name: new RegExp(appliance, "i") }).first(),
    ).toBeVisible();
  const serviceCards = await page.locator(".service-card").allTextContents();
  expect(serviceCards.join(" ")).not.toMatch(/refrigerator|HVAC/i);
  await expect(
    page.locator('a[href="tel:513-804-7766"]').first(),
  ).toBeAttached();
  await expect(
    page.locator('a[href="mailto:ssena@niceguyservices.com"]').first(),
  ).toBeAttached();
  await expect(page.locator(".trust-item__mark")).toHaveText([
    "\u2022",
    "\u2022",
    "\u2022",
    "\u2022",
  ]);
  const brandBounds = await page.locator(".brand-link").boundingBox();
  const logoBounds = await page.locator(".brand-link img").boundingBox();
  expect(brandBounds).not.toBeNull();
  expect(logoBounds).not.toBeNull();
  expect(logoBounds!.y).toBeGreaterThanOrEqual(brandBounds!.y);
  expect(logoBounds!.y + logoBounds!.height).toBeLessThanOrEqual(
    brandBounds!.y + brandBounds!.height,
  );
  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "Pricing", exact: true })
    .click();
  await expect(page).toHaveURL(/\/pricing$/);
  await expect(page.getByText("$99", { exact: true })).toBeVisible();
  await expect(page.getByText("$250", { exact: true })).toBeVisible();
  await expect(page.getByText("+$200", { exact: true })).toBeVisible();
  await expect(
    page.getByText(/actual acquisition cost/i).first(),
  ).toBeVisible();
});

test("mobile menu opens, receives focus, closes with Escape, and keeps actions visible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoReady(page, "/");
  const menu = page.getByRole("button", { name: /Open navigation menu/i });
  await menu.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Services" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  await expect(
    page
      .getByRole("navigation", { name: "Quick actions" })
      .getByRole("link", { name: "Call Now" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Quick actions" })
      .getByRole("link", { name: "Email Us" }),
  ).toBeVisible();
});

test("service-area checker handles likely, outside, and manual review", async ({
  page,
}) => {
  await gotoReady(page, "/service-area");
  const input = page.getByLabel("Service address or ZIP code");
  await input.fill("45202");
  await page.getByRole("button", { name: "Check area" }).click();
  await expect(page.getByText("Regional ZIP found")).toBeVisible();
  await input.fill("43004");
  await page.getByRole("button", { name: "Check area" }).click();
  await expect(page.getByText("Likely outside the normal area")).toBeVisible();
  await input.fill("Main Street");
  await page.getByRole("button", { name: "Check area" }).click();
  await expect(page.getByText("Manual review needed")).toBeVisible();
});

test("schedule and contact pages offer working contact links without false forms", async ({
  page,
  request,
}) => {
  for (const path of ["/schedule-service", "/contact"]) {
    await gotoReady(page, path);
    await expect(page.locator("form")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "513-804-7766" }).first(),
    ).toHaveAttribute("href", "tel:513-804-7766");
    await expect(
      page.getByRole("link", { name: "ssena@niceguyservices.com" }).first(),
    ).toHaveAttribute("href", "mailto:ssena@niceguyservices.com");
    await expect(page.getByText("By appointment").first()).toBeVisible();
  }
  const bookingResponse = await request.post("/api/v1/bookings", { data: {} });
  expect(bookingResponse.status()).toBe(410);
  const contactResponse = await request.post("/api/v1/contact", { data: {} });
  expect(contactResponse.status()).toBe(410);
});

test("accessibility scans pass on critical pages", async ({ page }) => {
  for (const path of [
    "/",
    "/pricing",
    "/service-area",
    "/schedule-service",
    "/contact",
  ]) {
    await gotoReady(page, path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations,
      `${path}: ${results.violations.map((item) => item.id).join(", ")}`,
    ).toEqual([]);
  }
});

test("critical pages fit all required responsive widths without horizontal overflow", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const paths = [
    "/",
    "/pricing",
    "/service-area",
    "/schedule-service",
    "/contact",
  ];
  for (const width of [320, 375, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: width >= 768 ? 900 : 844 });
    for (const path of paths) {
      await gotoReady(page, path);
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(
        dimensions.scrollWidth,
        `${path} at ${width}px`,
      ).toBeLessThanOrEqual(dimensions.clientWidth + 1);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  }
});

test("custom 404 and internal links work without console errors", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on(
    "console",
    (message) => message.type() === "error" && errors.push(message.text()),
  );
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto("/not-a-real-page");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
  errors.length = 0;
  const routes = [
    "/",
    "/services",
    "/services/washer-repair",
    "/pricing",
    "/service-area",
    "/about",
    "/faq",
    "/schedule-service",
    "/contact",
    "/service-policies",
    "/privacy",
    "/accessibility",
  ];
  for (const route of routes) {
    expect((await request.get(route)).status(), route).toBeLessThan(400);
    await page.goto(route);
  }
  expect(errors).toEqual([]);
});
