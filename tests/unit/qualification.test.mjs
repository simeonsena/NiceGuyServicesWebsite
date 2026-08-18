import assert from "node:assert/strict";
import test from "node:test";

import {
  assessServiceArea,
  getSafetyWarnings,
  validateUpload,
} from "../../src/domain/qualification.ts";

test("classifies likely in-area and out-of-area ZIP codes", () => {
  assert.equal(assessServiceArea("45202").status, "likely-inside");
  assert.equal(assessServiceArea("43004").status, "outside");
});

test("sends uncertain and malformed locations to manual review", () => {
  assert.equal(assessServiceArea("123 Main Street").status, "manual-review");
  assert.equal(assessServiceArea("").status, "manual-review");
});

test("surfaces every required urgent safety warning", () => {
  for (const issue of [
    "gasOdor",
    "smoke",
    "sparking",
    "burningSmell",
    "severeLeakNearElectrical",
  ]) {
    assert.ok(getSafetyWarnings({ [issue]: true }).length > 0, issue);
  }
});

test("enforces photo upload type and five-megabyte size limits", () => {
  assert.equal(validateUpload({ type: "image/jpeg", size: 1024 }).valid, true);
  assert.equal(
    validateUpload({ type: "application/pdf", size: 1024 }).valid,
    false,
  );
  assert.equal(
    validateUpload({ type: "image/png", size: 5 * 1024 * 1024 + 1 }).valid,
    false,
  );
});
