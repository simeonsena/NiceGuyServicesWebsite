export const businessConfig = {
  name: "Nice Guy Appliance Services",
  legalName: "Nice Guy Services LLC",
  domain: "niceguyservices.com",
  canonicalUrl: "https://niceguyservices.com",
  phone: "513-804-7766",
  email: "ssena@niceuyservices.com",
  addressLabel: "[BUSINESS_ADDRESS_OR_SERVICE_AREA_LABEL]",
  hours: "[BUSINESS_HOURS]",
  serviceArea: {
    centerName: "Cincinnati city center",
    radiusMiles: 25,
  },
  pricing: {
    diagnosticFee: 100,
    standardLabor: 250,
    additionalTechnicianCharge: 200,
    diagnosticFeeWaivedWithCompletedRepair: true,
    partsPolicy:
      "Parts are charged at actual acquisition cost whenever practical, without an inflated retail markup.",
    disclaimer:
      "Final repair cost depends on the diagnosis, required parts, appliance configuration, accessibility, and whether additional labor is required. Pricing is confirmed before repair work begins.",
  },
  warranty: {
    workmanshipDays: 30,
    customerSuppliedPartsDays: 30,
  },
  supportedAppliances: [
    "Washer",
    "Dryer",
    "Dishwasher",
    "Oven",
    "Range",
    "Microwave",
    "Other supported residential appliance",
  ],
  excludedServices: [
    "Refrigerator",
    "Freezer",
    "Air conditioner",
    "Furnace",
    "HVAC",
    "Refrigeration",
    "Commercial appliance",
  ],
  callsToAction: {
    primary: "Schedule Service",
    secondary: "Call Now",
  },
  brand: {
    logo: "/nice-guy-appliance-services-logo.png",
    socialImage: "/og.png",
  },
  integrations: {
    bookingProvider: "local-development",
    notificationProvider: "disabled",
    paymentProvider: "disabled",
    analyticsId: "",
  },
} as const;

export type SupportedAppliance =
  (typeof businessConfig.supportedAppliances)[number];

export const serviceRoutes = [
  {
    slug: "washer-repair",
    name: "Washer repair",
    appliance: "Washer",
    summary:
      "Diagnosis and repair for washers that will not drain, spin, fill, start, or complete a cycle.",
    commonIssues: [
      "Drain and pump problems",
      "Spin-cycle and balance faults",
      "Door or lid lock failures",
      "Leaks and fill problems",
      "Control and error-code diagnosis",
    ],
  },
  {
    slug: "dryer-repair",
    name: "Dryer repair",
    appliance: "Dryer",
    summary:
      "Practical troubleshooting for electric or gas dryers that will not heat, tumble, start, or finish normally.",
    commonIssues: [
      "No heat or inconsistent heat",
      "Drum will not turn",
      "Long drying times",
      "Unexpected noises",
      "Controls and sensors",
    ],
  },
  {
    slug: "dishwasher-repair",
    name: "Dishwasher repair",
    appliance: "Dishwasher",
    summary:
      "In-home diagnosis for dishwashers with cleaning, draining, leaking, latch, or control problems.",
    commonIssues: [
      "Poor cleaning results",
      "Standing water or drain faults",
      "Leaks around the unit",
      "Door-latch problems",
      "No-start and control failures",
    ],
  },
  {
    slug: "oven-range-repair",
    name: "Oven & range repair",
    appliance: "Oven or range",
    summary:
      "Careful diagnosis for ovens and ranges with heating, ignition, temperature, burner, or control concerns.",
    commonIssues: [
      "Oven will not heat",
      "Temperature is inaccurate",
      "Burner or element failures",
      "Ignition problems",
      "Door and control faults",
    ],
  },
  {
    slug: "microwave-repair",
    name: "Microwave repair",
    appliance: "Microwave",
    summary:
      "Assessment of supported residential microwaves with power, heating, turntable, door, or control issues.",
    commonIssues: [
      "Unit will not start",
      "Food is not heating",
      "Turntable problems",
      "Door-switch faults",
      "Control and display issues",
    ],
  },
] as const;

export const serviceDetails = {
  "washer-repair": {
    prepare:
      "Leave the washer accessible and note whether water remains in the tub. If a leak is active, stop using the machine and avoid standing water near electrical connections.",
    diagnosticFocus:
      "The visit may include the drain path, pump, hoses, door or lid lock, suspension, drive components, controls, and stored error information when available.",
    decisionNote:
      "A washer repair decision often depends on bearing or tub condition, prior leaks, part availability, and whether the repair requires extensive disassembly.",
  },
  "dryer-repair": {
    prepare:
      "Clean the lint screen and make the dryer accessible. Stop using it if you smell burning, see smoke or sparks, or suspect a gas leak.",
    diagnosticFocus:
      "The technician may assess airflow, heating components, ignition, drum drive, sensors, switches, controls, and the symptoms you have observed.",
    decisionNote:
      "Long dry times can involve the appliance, the vent path, or both. The diagnosis separates dryer faults from home-vent conditions before a repair is recommended.",
  },
  "dishwasher-repair": {
    prepare:
      "Leave standing water in place if it can be done safely because it may help reproduce the problem. Stop using the dishwasher if water is reaching electrical components.",
    diagnosticFocus:
      "The visit may cover fill and drain systems, wash performance, spray components, seals, door hardware, heating, sensors, and controls.",
    decisionNote:
      "Floor or cabinet damage and repeated leakage matter in the repair decision. The recommendation considers both the machine and the surrounding installation.",
  },
  "oven-range-repair": {
    prepare:
      "Stop using the appliance if you smell gas, see sparking, or notice uncontrolled heating. Keep the model number available and note which burners or oven modes are affected.",
    diagnosticFocus:
      "The visit may assess heating elements, ignition, burners, temperature sensing, power supply symptoms, door components, and electronic controls.",
    decisionNote:
      "Built-in access, gas or electrical configuration, part availability, and safe removal can affect the labor plan and whether a second technician is needed.",
  },
  "microwave-repair": {
    prepare:
      "Stop using a microwave that sparks, smokes, smells burned, or has a damaged door. Do not remove the cabinet or attempt internal diagnosis.",
    diagnosticFocus:
      "The assessment may cover power, controls, door switches, turntable operation, heating symptoms, installation access, and overall condition.",
    decisionNote:
      "Because microwave designs and part costs vary widely, replacement can be more practical in some cases. The recommendation considers safety, access, and total value.",
  },
} as const;

export const faqItems = [
  [
    "What appliances do you repair?",
    "Washers, dryers, dishwashers, ovens, ranges, microwaves, and other supported residential appliances after review.",
  ],
  [
    "Do you repair refrigerators?",
    "No. Nice Guy Appliance Services does not service refrigerators, freezers, or other refrigeration equipment.",
  ],
  [
    "Do you service air conditioners or furnaces?",
    "No. Air conditioners, furnaces, and other HVAC systems are outside the services offered.",
  ],
  [
    "What areas do you serve?",
    "Residential addresses that appear to be within 25 miles of Cincinnati city center. Borderline addresses can be reviewed manually.",
  ],
  [
    "What is the diagnostic fee?",
    "The diagnostic fee is $100 when you decline the recommended repair. It is waived when you approve and complete the recommended repair.",
  ],
  [
    "How much is standard labor?",
    "Standard labor is a flat $250 per completed repair, plus parts. A qualifying two-technician repair may add $200 after advance disclosure.",
  ],
  [
    "How are parts priced?",
    "Parts are charged at actual acquisition cost whenever practical, without an inflated retail markup. Availability and cost are confirmed after diagnosis.",
  ],
  [
    "Do you install customer-supplied parts?",
    "A compatible and appropriate part may be considered. Installation can be declined if a part is damaged, incorrect, unsafe, used, modified, or incompatible.",
  ],
  [
    "What warranty do you provide?",
    "Labor performed by Nice Guy Appliance Services has a 30-day workmanship warranty. Customer-supplied parts receive the stated 30-day coverage described in the service policies.",
  ],
  [
    "Can I provide a model number and photos?",
    "Yes. The booking form accepts a model number plus optional appliance and model-label photos to help prepare for the visit.",
  ],
  [
    "What if a part is discontinued?",
    "Part availability is considered after diagnosis. If a suitable part cannot be obtained, the options and practical repair-versus-replace recommendation will be explained.",
  ],
  [
    "Do you provide estimates before diagnosis?",
    "Final pricing cannot be guaranteed from symptoms alone. The diagnosis, parts, access, and labor needs determine the repair price presented for approval.",
  ],
  [
    "What brands do you service?",
    "Brand coverage is confirmed case by case. Add the brand and model number to your booking request so support can be reviewed without guessing.",
  ],
  [
    "Do you repair commercial appliances?",
    "Commercial appliance service is not offered unless it is explicitly added later.",
  ],
  [
    "What should I do if I smell gas or see sparks?",
    "Stop using the appliance. Keep clear of immediate danger and contact the appropriate emergency service or utility when needed. The booking form will show a prominent safety warning.",
  ],
  [
    "What happens after I submit a booking request?",
    "You receive a request number and a summary. The appointment remains pending until Nice Guy Appliance Services confirms the date and window directly.",
  ],
] as const;
