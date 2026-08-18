const booleanFields = [
  "stacked",
  "builtIn",
  "mustBeMoved",
  "stairs",
  "secondTechnicianPossible",
  "customerSuppliedPart",
  "gasOdor",
  "smoke",
  "sparking",
  "fire",
  "burningSmell",
  "severeLeakNearElectrical",
  "contactConsent",
  "diagnosticPolicyAccepted",
  "servicePolicyAccepted",
] as const;

export function formDataToObject(formData: FormData) {
  const result: Record<string, string | boolean> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") result[key] = value;
  }
  for (const field of booleanFields) result[field] = formData.has(field);
  return result;
}

export function getImageFiles(formData: FormData) {
  return [
    formData.get("appliancePhoto"),
    formData.get("modelLabelPhoto"),
    formData.get("photo"),
  ].filter((value): value is File => value instanceof File && value.size > 0);
}
