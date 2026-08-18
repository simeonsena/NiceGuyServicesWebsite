import { validateUpload } from "../../../../src/domain/qualification.ts";
import { validateContact } from "../../../../src/domain/validation.ts";
import { contactProvider } from "../../../../src/providers/contact.ts";
import {
  formDataToObject,
  getImageFiles,
} from "../../../../src/server/form-data.ts";
import {
  hasValidOrigin,
  MemoryRateLimiter,
  requestClientKey,
} from "../../../../src/server/rate-limit.ts";

const limiter = new MemoryRateLimiter({ limit: 5, windowMs: 10 * 60_000 });

export async function POST(request: Request) {
  if (!hasValidOrigin(request))
    return Response.json(
      { message: "Invalid request origin." },
      { status: 403 },
    );
  if (!limiter.check(requestClientKey(request)).allowed)
    return Response.json(
      { message: "Too many requests. Please wait before trying again." },
      { status: 429 },
    );
  try {
    const formData = await request.formData();
    for (const file of getImageFiles(formData)) {
      const validation = validateUpload(file);
      if (!validation.valid)
        return Response.json(
          {
            message: validation.error,
            fieldErrors: { photo: [validation.error] },
          },
          { status: 400 },
        );
    }
    const parsed = validateContact(formDataToObject(formData));
    if (!parsed.success)
      return Response.json(
        {
          message: "Review the highlighted contact fields.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    const result = await contactProvider.createContactRequest(parsed.data);
    return Response.json(
      { ...result, message: "Your message was received for review." },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { message: "Your message could not be submitted. Please try again." },
      { status: 500 },
    );
  }
}
