import assert from "node:assert/strict";
import test from "node:test";

import { POST as checkArea } from "../../app/api/v1/service-area/route.ts";
import { POST as createBooking } from "../../app/api/v1/bookings/route.ts";
import { POST as createContact } from "../../app/api/v1/contact/route.ts";

test("service-area API handles likely, outside, and manual-review results", async () => {
  for (const [location, status] of [
    ["45202", "likely-inside"],
    ["43004", "outside"],
    ["Main Street", "manual-review"],
  ]) {
    const response = await checkArea(
      new Request("http://localhost/api/v1/service-area", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ location }),
      }),
    );
    assert.equal(response.status, 200);
    assert.equal((await response.json()).status, status);
  }
});

function validBookingForm() {
  const form = new FormData();
  const values = {
    name: "Test Customer",
    phone: "513-555-0100",
    email: "test@example.com",
    address: "100 Main Street",
    city: "Cincinnati",
    state: "OH",
    zip: "45202",
    appliance: "Washer",
    brand: "Example",
    problemDescription: "The drum stops in the middle of a cycle.",
    preferredDate: "2026-09-15",
    preferredWindow: "Morning",
    diagnosticPolicyAccepted: "on",
    servicePolicyAccepted: "on",
  };
  for (const [key, value] of Object.entries(values)) form.set(key, value);
  return form;
}

test("booking API rejects invalid input and creates a pending idempotent request", async () => {
  const invalid = await createBooking(
    new Request("http://localhost/api/v1/bookings", {
      method: "POST",
      body: new FormData(),
    }),
  );
  assert.equal(invalid.status, 400);

  const first = await createBooking(
    new Request("http://localhost/api/v1/bookings", {
      method: "POST",
      headers: { "idempotency-key": "api-test-key" },
      body: validBookingForm(),
    }),
  );
  assert.equal(first.status, 202);
  const firstData = await first.json();
  assert.equal(firstData.status, "pending");
  assert.doesNotMatch(firstData.message, /^confirmed/i);

  const second = await createBooking(
    new Request("http://localhost/api/v1/bookings", {
      method: "POST",
      headers: { "idempotency-key": "api-test-key" },
      body: validBookingForm(),
    }),
  );
  assert.equal((await second.json()).reference, firstData.reference);
});

test("contact API performs server validation and returns a receipt", async () => {
  const invalid = await createContact(
    new Request("http://localhost/api/v1/contact", {
      method: "POST",
      body: new FormData(),
    }),
  );
  assert.equal(invalid.status, 400);

  const form = new FormData();
  for (const [key, value] of Object.entries({
    name: "Test Customer",
    contact: "test@example.com",
    subject: "Dishwasher question",
    message: "I would like help deciding whether this is supported.",
  }))
    form.set(key, value);
  const response = await createContact(
    new Request("http://localhost/api/v1/contact", {
      method: "POST",
      body: form,
    }),
  );
  assert.equal(response.status, 201);
  assert.equal((await response.json()).received, true);
});
