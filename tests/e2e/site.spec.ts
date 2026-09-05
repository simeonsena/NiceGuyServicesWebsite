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
      .getByRole("link", { name: "Schedule Service" }),
  ).toBeVisible();
});

test("service-area checker handles likely, outside, and manual review", async ({
  page,
}) => {
  await gotoReady(page, "/service-area");
  const input = page.getByLabel("Service address or ZIP code");
  await input.fill("45202");
  await page.getByRole("button", { name: "Check area" }).click();
  await expect(page.getByText("Likely in range")).toBeVisible();
  await input.fill("43004");
  await page.getByRole("button", { name: "Check area" }).click();
  await expect(page.getByText("Likely outside the normal area")).toBeVisible();
  await input.fill("Main Street");
  await page.getByRole("button", { name: "Check area" }).click();
  await expect(page.getByText("Manual review needed")).toBeVisible();
});

test("booking validates, triages safety, enforces uploads, and produces a pending receipt", async ({
  page,
}) => {
  await gotoReady(page, "/schedule-service");
  await page
    .getByRole("button", { name: "Submit appointment request" })
    .click();
  await expect(page.getByRole("alert").first()).toContainText(
    /Review the highlighted/i,
  );
  await page.getByLabel("Customer name *").fill("Test Customer");
  await page.getByLabel("Phone number *").fill("513-555-0100");
  await page.getByLabel("Email address *").fill("test@example.com");
  await page.getByLabel("Service address *").fill("100 Main Street");
  await page.getByLabel("City *").fill("Cincinnati");
  await page.getByLabel("ZIP code *").fill("45202");
  await page.getByLabel("Appliance category *").selectOption("Washer");
  await expect(
    page
      .getByLabel("Appliance category *")
      .locator('option[value="Refrigerator"]'),
  ).toHaveCount(0);
  await page.getByLabel("Brand *").fill("Example brand");
  await page
    .getByLabel("Describe the problem *")
    .fill("The washer drum stops in the middle of every cycle.");
  await page.getByLabel("Preferred date *").fill("2026-09-15");
  await page.getByLabel("Preferred time window *").selectOption("Morning");
  await page.getByLabel("Gas odor").check();
  await expect(
    page.getByRole("alert").filter({ hasText: "Stop using the appliance" }),
  ).toBeVisible();
  await page.getByLabel("Gas odor").uncheck();
  await page.getByLabel(/customer-supplied part/i).check();
  await page.getByLabel(/second technician may be required/i).check();
  await page.getByLabel("Appliance or problem photo").setInputFiles({
    name: "unsafe.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("not an image"),
  });
  await page.getByLabel(/diagnostic-fee policy/i).check();
  await page.getByLabel(/cancellation and service policies/i).check();
  await page
    .getByRole("button", { name: "Submit appointment request" })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    /Review the selected image/i,
  );
  await page.getByLabel("Appliance or problem photo").setInputFiles([]);
  await page
    .getByRole("button", { name: "Submit appointment request" })
    .click();
  await expect(page).toHaveURL(/\/booking-confirmation/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /pending confirmation/i,
  );
  await expect(page.getByText("Request number", { exact: true })).toBeVisible();
  await expect(page.getByText(/not confirmed/i).first()).toBeVisible();
});

test("contact form exposes server errors and succeeds without losing clarity", async ({
  page,
}) => {
  await gotoReady(page, "/contact");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("alert")).toContainText(
    /Review the highlighted/i,
  );
  await page.getByLabel("Name *").fill("Test Customer");
  await page.getByLabel("Phone or email *").fill("test@example.com");
  await page.getByLabel("Subject *").fill("Dishwasher question");
  await page
    .getByLabel("Message *")
    .fill("I would like to ask whether this dishwasher issue is supported.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText(/received for review/i);
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
