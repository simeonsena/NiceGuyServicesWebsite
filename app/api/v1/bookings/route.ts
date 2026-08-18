import { validateUpload } from "../../../../src/domain/qualification.ts";
import { validateBooking } from "../../../../src/domain/validation.ts";
import {
  bookingProvider,
  type BookingRequest,
} from "../../../../src/providers/booking.ts";
import { notificationProvider } from "../../../../src/providers/notifications.ts";
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
    const uploads = getImageFiles(formData);
    for (const file of uploads) {
      const validation = validateUpload(file);
      if (!validation.valid)
        return Response.json(
          {
            message: validation.error,
            fieldErrors: { uploads: [validation.error] },
          },
          { status: 400 },
        );
    }

    const parsed = validateBooking(formDataToObject(formData));
    if (!parsed.success)
      return Response.json(
        {
          message: "Review the highlighted booking fields.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );

    const idempotencyKey =
      request.headers.get("idempotency-key")?.slice(0, 120) ||
      crypto.randomUUID();
    const result = await bookingProvider.createBooking(
      parsed.data as BookingRequest,
      idempotencyKey,
    );
    const notification = await notificationProvider.sendBookingRequest({
      reference: result.reference,
    });

    return Response.json(
      {
        ...result,
        notification,
        details: {
          name: parsed.data.name,
          appliance: parsed.data.appliance,
          address: `${parsed.data.address}, ${parsed.data.city}, ${parsed.data.state} ${parsed.data.zip}`,
          preferredDate: parsed.data.preferredDate,
          preferredWindow: parsed.data.preferredWindow,
        },
      },
      { status: 202 },
    );
  } catch {
    return Response.json(
      {
        message:
          "The booking request could not be submitted. Your entered information is still in the form.",
      },
      { status: 500 },
    );
  }
}
