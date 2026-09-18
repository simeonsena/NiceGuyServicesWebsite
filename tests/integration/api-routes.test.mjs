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

test("retired submission APIs reject old form posts without issuing receipts", async () => {
  for (const [route, handler] of [
    ["bookings", createBooking],
    ["contact", createContact],
  ]) {
    const response = await handler(
      new Request(`http://localhost/api/v1/${route}`, {
        method: "POST",
        body: new FormData(),
      }),
    );
    assert.equal(response.status, 410);
    const data = await response.json();
    assert.match(data.message, /513-804-7766/);
    assert.match(data.message, /ssena@niceguyservices\.com/);
    assert.equal(data.reference, undefined);
  }
});
