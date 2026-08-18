import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    `${process.pid}-${Date.now()}-${pathname}`,
  );
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("homepage clearly presents the business, qualification rules, and canonical logo", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /Nice Guy Appliance Services/);
  assert.match(html, /Honest Appliance Repair Without Inflated Parts Markup/i);
  assert.match(html, /50 miles of Cincinnati/i);
  for (const appliance of [
    "washers",
    "dryers",
    "dishwashers",
    "ovens",
    "ranges",
    "microwaves",
  ])
    assert.match(html, new RegExp(appliance, "i"));
  assert.match(html, /nice-guy-appliance-services-logo\.png/);
  assert.match(html, /Schedule Service/);
  assert.match(html, /Call Now/);
  assert.doesNotMatch(html, /codex-preview/);
});

test("pricing route renders every exact pricing rule", async () => {
  const response = await render("/pricing");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /\$100/);
  assert.match(html, /\$250/);
  assert.match(html, /\$200/);
  assert.match(html, /actual acquisition cost/i);
  assert.match(html, /waived.*completed repair/is);
  assert.match(html, /Final repair cost depends on the diagnosis/i);
});

test("service area, booking, and contact routes expose accessible forms", async () => {
  for (const [path, heading] of [
    ["/service-area", "Check Your Service Area"],
    ["/schedule-service", "Schedule Appliance Service"],
    ["/contact", "Contact Nice Guy Appliance Services"],
  ]) {
    const response = await render(path);
    const html = await response.text();
    assert.equal(response.status, 200, path);
    assert.match(html, new RegExp(`<h1[^>]*>[^<]*${heading}`, "i"), path);
    assert.match(html, /<form\b/i, path);
    assert.match(html, /<label\b/i, path);
  }
});

test("publishes canonical metadata and returns a useful custom 404", async () => {
  const home = await render("/");
  const homeHtml = await home.text();
  assert.match(homeHtml, /https:\/\/niceguyservices\.com/);
  assert.match(homeHtml, /application\/ld\+json/);

  const missing = await render("/definitely-not-a-page");
  const missingHtml = await missing.text();
  assert.equal(missing.status, 404);
  assert.match(missingHtml, /Page not found/i);
  assert.match(missingHtml, /Return home/i);
});

test("publishes indexable SEO routes for the production domain", async () => {
  const robots = await render("/robots.txt");
  const robotsText = await robots.text();
  assert.equal(robots.status, 200);
  assert.match(robotsText, /Allow: \//);
  assert.match(
    robotsText,
    /Sitemap: https:\/\/niceguyservices\.com\/sitemap\.xml/,
  );

  const sitemap = await render("/sitemap.xml");
  const sitemapText = await sitemap.text();
  assert.equal(sitemap.status, 200);
  assert.match(
    sitemapText,
    /https:\/\/niceguyservices\.com\/services\/washer-repair/,
  );
  assert.doesNotMatch(sitemapText, /localhost|booking-confirmation/);

  const manifest = await render("/manifest.webmanifest");
  assert.equal(manifest.status, 200);
  assert.match(await manifest.text(), /Nice Guy Appliance Services/);
});

test("redirects www, insecure canonical requests, and documented legacy paths", async () => {
  const workerUrl = new URL("../../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("redirect-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const env = {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  };
  const ctx = { waitUntil() {}, passThroughOnException() {} };

  const www = await worker.fetch(
    new Request("http://www.niceguyservices.com/pricing"),
    env,
    ctx,
  );
  assert.equal(www.status, 308);
  assert.equal(
    www.headers.get("location"),
    "https://niceguyservices.com/pricing",
  );

  const insecure = await worker.fetch(
    new Request("http://niceguyservices.com/faq"),
    env,
    ctx,
  );
  assert.equal(insecure.status, 308);
  assert.equal(
    insecure.headers.get("location"),
    "https://niceguyservices.com/faq",
  );

  const legacy = await worker.fetch(
    new Request("https://niceguyservices.com/book"),
    env,
    ctx,
  );
  assert.equal(legacy.status, 308);
  assert.equal(
    legacy.headers.get("location"),
    "https://niceguyservices.com/schedule-service",
  );
});
