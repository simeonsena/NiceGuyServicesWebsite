import assert from "node:assert/strict";
import test from "node:test";

import {
  validateBooking,
  validateContact,
} from "../../src/domain/validation.ts";

const validBooking = {
  name: "Test Customer",
  phone: "513-555-0100",
  email: "test@example.com",
  address: "100 Main Street",
  city: "Cincinnati",
  state: "OH",
  zip: "45202",
  appliance: "Washer",
  brand: "Example brand",
  problemDescription: "The drum stops during the wash cycle.",
  preferredDate: "2026-09-15",
  preferredWindow: "Morning",
  diagnosticPolicyAccepted: true,
  servicePolicyAccepted: true,
};

test("accepts a qualified pending booking request", () => {
  const result = validateBooking(validBooking);
  assert.equal(result.success, true);
});

test("rejects missing fields, invalid contact details, and unaccepted policies", () => {
  assert.equal(validateBooking({}).success, false);
  assert.equal(
    validateBooking({ ...validBooking, email: "bad" }).success,
    false,
  );
  assert.equal(
    validateBooking({ ...validBooking, phone: "12" }).success,
    false,
  );
  assert.equal(
    validateBooking({ ...validBooking, diagnosticPolicyAccepted: false })
      .success,
    false,
  );
});

test("rejects refrigeration and HVAC requests", () => {
  for (const appliance of ["Refrigerator", "Freezer", "HVAC", "Furnace"])
    assert.equal(
      validateBooking({ ...validBooking, appliance }).success,
      false,
    );
});

test("requires clarification for the other supported category", () => {
  const result = validateBooking({
    ...validBooking,
    appliance: "Other supported residential appliance",
  });
  assert.equal(result.success, false);
});

test("validates the separate contact request on the server", () => {
  assert.equal(
    validateContact({
      name: "Test Customer",
      contact: "test@example.com",
      subject: "Dishwasher question",
      message: "I would like to ask whether this is a supported service.",
    }).success,
    true,
  );
  assert.equal(validateContact({ name: "" }).success, false);
});
