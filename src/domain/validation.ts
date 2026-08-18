import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .refine((value) => value.replace(/\D/g, "").length >= 10, {
    message: "Enter a phone number with at least 10 digits.",
  });

const applianceSchema = z.enum([
  "Washer",
  "Dryer",
  "Dishwasher",
  "Oven",
  "Range",
  "Microwave",
  "Other supported residential appliance",
]);

export const bookingSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name."),
    phone: phoneSchema,
    email: z.email("Enter a valid email address."),
    address: z.string().trim().min(5, "Enter the service address."),
    city: z.string().trim().min(2, "Enter the city."),
    state: z.string().trim().length(2, "Use a two-letter state code."),
    zip: z
      .string()
      .trim()
      .regex(/^\d{5}(?:-\d{4})?$/, "Enter a valid ZIP code."),
    appliance: applianceSchema,
    otherAppliance: z.string().trim().optional().default(""),
    brand: z.string().trim().min(1, "Enter the appliance brand or Unknown."),
    modelNumber: z.string().trim().optional().default(""),
    applianceAge: z.string().trim().optional().default(""),
    errorCode: z.string().trim().optional().default(""),
    problemDescription: z
      .string()
      .trim()
      .min(12, "Describe the problem in a little more detail."),
    problemBegan: z.string().trim().optional().default(""),
    operational: z.string().trim().optional().default("Unknown"),
    preferredDate: z.string().trim().min(1, "Choose a preferred date."),
    preferredWindow: z.string().trim().min(1, "Choose a preferred window."),
    secondaryPreference: z.string().trim().optional().default(""),
    accessNotes: z.string().trim().optional().default(""),
    parkingNotes: z.string().trim().optional().default(""),
    stacked: z.boolean().optional().default(false),
    builtIn: z.boolean().optional().default(false),
    mustBeMoved: z.boolean().optional().default(false),
    stairs: z.boolean().optional().default(false),
    secondTechnicianPossible: z.boolean().optional().default(false),
    customerSuppliedPart: z.boolean().optional().default(false),
    gasOdor: z.boolean().optional().default(false),
    smoke: z.boolean().optional().default(false),
    sparking: z.boolean().optional().default(false),
    fire: z.boolean().optional().default(false),
    burningSmell: z.boolean().optional().default(false),
    severeLeakNearElectrical: z.boolean().optional().default(false),
    contactConsent: z.boolean().optional().default(false),
    diagnosticPolicyAccepted: z.literal(true, {
      error: "Accept the diagnostic-fee policy to continue.",
    }),
    servicePolicyAccepted: z.literal(true, {
      error: "Accept the cancellation and service policies to continue.",
    }),
    company: z.string().max(0).optional().default(""),
  })
  .superRefine((value, context) => {
    if (
      value.appliance === "Other supported residential appliance" &&
      value.otherAppliance.length < 3
    ) {
      context.addIssue({
        code: "custom",
        path: ["otherAppliance"],
        message: "Describe the other residential appliance.",
      });
    }
  });

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  contact: z
    .string()
    .trim()
    .refine(
      (value) =>
        z.email().safeParse(value).success ||
        value.replace(/\D/g, "").length >= 10,
      "Enter a valid phone number or email address.",
    ),
  subject: z.string().trim().min(3, "Enter a subject."),
  message: z.string().trim().min(12, "Enter a more detailed message."),
  appliance: z.string().trim().optional().default(""),
  modelNumber: z.string().trim().optional().default(""),
  company: z.string().max(0).optional().default(""),
});

export function validateBooking(input: unknown) {
  return bookingSchema.safeParse(input);
}

export function validateContact(input: unknown) {
  return contactSchema.safeParse(input);
}
