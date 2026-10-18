// Owner-approved public examples, reviewed October 11, 2026.
// Based on V&V public listings and available Encompass comparisons.
// These are not account quotes, inventory guarantees, or statistical averages.
export const partsPricing = {
  title: "Estimated OEM parts price ranges",
  disclaimer:
    "These examples help you budget for common repairs. Parts prices vary by appliance model, supplier, and availability, and some replacements fall outside the ranges shown. Diagnostic service, labor, and applicable tax are additional. Suitable aftermarket alternatives may cost less and can be discussed when available. Your exact repair total will be confirmed for approval before work begins.",
  washerNote:
    "Some model-specific suspension parts, including certain Samsung suspension rods, can cost substantially more than the common kit examples shown. These may be sold individually; the required parts and full cost will be confirmed before repair.",
  scopeNote:
    "Whole heater housings, circulation-pump assemblies, induction components, and unusual model-specific parts may cost more.",
  appliances: {
    "dishwasher-repair": [
      { name: "Drain pump", min: 60, max: 135 },
      { name: "Water inlet valve", min: 35, max: 70 },
      { name: "Heating element", min: 40, max: 80 },
    ],
    "dryer-repair": [
      { name: "Heating element", min: 55, max: 130 },
      { name: "Drum belt", min: 10, max: 45 },
      { name: "Idler pulley / assembly", min: 15, max: 60 },
    ],
    "washer-repair": [
      { name: "Drain pump / pump assembly", min: 45, max: 200 },
      { name: "Lid lock / service kit", min: 75, max: 110 },
      { name: "Common complete suspension-rod kits", min: 80, max: 110 },
    ],
    "oven-range-repair": [
      { name: "Bake element", min: 25, max: 100 },
      { name: "Gas oven igniter", min: 45, max: 220 },
      { name: "Coil surface element", min: 15, max: 60 },
      { name: "Radiant surface element", min: 85, max: 180 },
    ],
  },
} as const;
