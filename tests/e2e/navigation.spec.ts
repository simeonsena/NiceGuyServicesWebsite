import { expect, test } from "@playwright/test";

test("every desktop and mobile menu link opens its destination", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const destinations = [
    [
      "Services",
      "/services",
      "Appliance repair with a clear, practical process",
    ],
    ["Pricing", "/pricing", "A clear price before repair work begins"],
    ["Service Area", "/service-area", "Check Your Service Area"],
    [
      "About",
      "/about",
      "Practical service without the national call-center experience",
    ],
    ["FAQ", "/faq", "Frequently asked questions"],
  ];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [label, path, heading] of destinations) {
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute(
        "data-hydrated",
        "true",
      );
      if (width === 390) {
        await page
          .getByRole("button", { name: "Open navigation menu" })
          .click();
      }
      const menu = page.getByRole("navigation", {
        name: width === 390 ? "Mobile navigation" : "Primary navigation",
        exact: true,
      });
      await menu.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(path + "$"));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    }
  }
});
