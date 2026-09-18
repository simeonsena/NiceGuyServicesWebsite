export type ServiceAreaStatus = "likely-inside" | "outside" | "manual-review";

export type ServiceAreaAssessment = {
  status: ServiceAreaStatus;
  message: string;
  zip: string | null;
};

const likelyCincinnatiPrefixes = new Set([
  "450",
  "451",
  "452",
  "410",
  "411",
  "470",
]);
const knownOutsidePrefixes = new Set([
  "430",
  "431",
  "432",
  "454",
  "455",
  "456",
]);

export function assessServiceArea(input: string): ServiceAreaAssessment {
  const zip = input.match(/\b\d{5}(?:-\d{4})?\b/)?.[0]?.slice(0, 5) ?? null;
  if (!zip) {
    return {
      status: "manual-review",
      message:
        "Add a five-digit ZIP code for an initial check, or call or email us with the address for review.",
      zip,
    };
  }

  const prefix = zip.slice(0, 3);
  if (likelyCincinnatiPrefixes.has(prefix)) {
    return {
      status: "likely-inside",
      message:
        "This ZIP code is in the broader Cincinnati region, but ZIP codes do not establish distance. Call or email with the complete address for confirmation before scheduling.",
      zip,
    };
  }
  if (knownOutsidePrefixes.has(prefix)) {
    return {
      status: "outside",
      message:
        "This ZIP code appears to be outside the normal service area. Call or email us with the full address for review.",
      zip,
    };
  }
  return {
    status: "manual-review",
    message:
      "The automated check cannot confirm this location. Call or email us with the full address for review.",
    zip,
  };
}

export type SafetyFlags = Partial<
  Record<
    | "gasOdor"
    | "smoke"
    | "sparking"
    | "fire"
    | "burningSmell"
    | "severeLeakNearElectrical",
    boolean
  >
>;

export function getSafetyWarnings(flags: SafetyFlags): string[] {
  const warnings: string[] = [];
  if (flags.gasOdor)
    warnings.push(
      "Stop using the appliance. Leave the area if the gas odor is strong and contact your gas utility or emergency services from a safe location.",
    );
  if (flags.smoke || flags.fire)
    warnings.push(
      "Stop using the appliance. Keep clear of smoke or fire and contact emergency services when there is immediate danger.",
    );
  if (flags.sparking)
    warnings.push(
      "Stop using the appliance and disconnect power only when it is safe to do so. Keep clear of exposed electrical hazards.",
    );
  if (flags.burningSmell)
    warnings.push(
      "Stop using the appliance. A burning electrical odor may indicate an urgent electrical hazard.",
    );
  if (flags.severeLeakNearElectrical)
    warnings.push(
      "Stay clear of water near electrical components. Do not touch the appliance or standing water if an electrical hazard may be present.",
    );
  return warnings;
}

const allowedUploadTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
export const maxUploadBytes = 5 * 1024 * 1024;

export function validateUpload(file: { type: string; size: number }) {
  if (!allowedUploadTypes.has(file.type))
    return { valid: false, error: "Use a JPG, PNG, or WebP image." };
  if (file.size > maxUploadBytes)
    return { valid: false, error: "Each image must be 5 MB or smaller." };
  return { valid: true, error: null };
}
