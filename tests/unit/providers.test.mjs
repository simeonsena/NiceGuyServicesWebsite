import assert from "node:assert/strict";
import test from "node:test";

import { MemoryRateLimiter } from "../../src/server/rate-limit.ts";
import { LocalBookingProvider } from "../../src/providers/booking.ts";
import { DisabledNotificationProvider } from "../../src/providers/notifications.ts";

const request = {
  name: "Test Customer",
  appliance: "Washer",
  preferredDate: "2026-09-15",
  preferredWindow: "Morning",
};

test("creates pending requests without claiming a confirmed appointment", async () => {
  const provider = new LocalBookingProvider(() => "NGA-TEST-001");
  const result = await provider.createBooking(request, "request-key-1");
  assert.equal(result.reference, "NGA-TEST-001");
  assert.equal(result.status, "pending");
  assert.match(result.message, /pending confirmation/i);
});

test("returns the same result for a duplicate idempotency key", async () => {
  let count = 0;
  const provider = new LocalBookingProvider(() => `NGA-${++count}`);
  const first = await provider.createBooking(request, "duplicate-key");
  const second = await provider.createBooking(request, "duplicate-key");
  assert.deepEqual(second, first);
  assert.equal(count, 1);
});

test("keeps notifications explicitly disabled until a provider is configured", async () => {
  const provider = new DisabledNotificationProvider();
  const result = await provider.sendBookingRequest({ reference: "NGA-TEST" });
  assert.equal(result.sent, false);
  assert.match(result.reason, /not configured/i);
});

test("rate limits repeated form requests", () => {
  const limiter = new MemoryRateLimiter({ limit: 2, windowMs: 60_000 });
  assert.equal(limiter.check("client").allowed, true);
  assert.equal(limiter.check("client").allowed, true);
  assert.equal(limiter.check("client").allowed, false);
});
