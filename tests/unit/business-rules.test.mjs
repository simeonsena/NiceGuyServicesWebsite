import assert from "node:assert/strict";
import test from "node:test";

import { businessConfig } from "../../src/config/business.ts";

test("centralizes the authoritative business identity and territory", () => {
  assert.equal(businessConfig.name, "Nice Guy Appliance Services");
  assert.equal(businessConfig.domain, "niceguyservices.com");
  assert.equal(businessConfig.phone, "513-804-7766");
  assert.equal(businessConfig.email, "ssena@niceguyservices.com");
  assert.equal(businessConfig.serviceArea.centerName, "Cincinnati city center");
  assert.equal(businessConfig.serviceArea.radiusMiles, 25);
  assert.equal(businessConfig.hours, "By appointment");
  assert.doesNotMatch(businessConfig.addressLabel, /\[|\]/);
});

test("keeps pricing rules exact and consistent", () => {
  assert.equal(businessConfig.pricing.diagnosticFee, 99);
  assert.equal(businessConfig.pricing.standardLabor, 250);
  assert.equal(businessConfig.pricing.additionalTechnicianCharge, 200);
  assert.equal(
    businessConfig.pricing.diagnosticFeeWaivedWithCompletedRepair,
    true,
  );
  assert.match(businessConfig.pricing.partsPolicy, /actual acquisition cost/i);
});

test("allows only supported residential appliance categories", () => {
  assert.deepEqual(businessConfig.supportedAppliances, [
    "Washer",
    "Dryer",
    "Dishwasher",
    "Oven",
    "Range",
    "Microwave",
    "Other supported residential appliance",
  ]);
  assert.ok(businessConfig.excludedServices.includes("Refrigerator"));
  assert.ok(businessConfig.excludedServices.includes("HVAC"));
  assert.ok(!businessConfig.supportedAppliances.includes("Refrigerator"));
});

test("states both required 30-day policies", () => {
  assert.equal(businessConfig.warranty.workmanshipDays, 30);
  assert.equal(businessConfig.warranty.customerSuppliedPartsDays, 30);
});
