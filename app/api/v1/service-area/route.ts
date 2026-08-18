import { assessServiceArea } from "../../../../src/domain/qualification.ts";
import {
  hasValidOrigin,
  MemoryRateLimiter,
  requestClientKey,
} from "../../../../src/server/rate-limit.ts";

const limiter = new MemoryRateLimiter({ limit: 30, windowMs: 60_000 });

export async function POST(request: Request) {
  if (!hasValidOrigin(request))
    return Response.json(
      { message: "Invalid request origin." },
      { status: 403 },
    );
  if (!limiter.check(requestClientKey(request)).allowed)
    return Response.json(
      { message: "Please wait before checking again." },
      { status: 429 },
    );
  try {
    const body = (await request.json()) as { location?: unknown };
    const location =
      typeof body.location === "string" ? body.location.slice(0, 240) : "";
    return Response.json(assessServiceArea(location));
  } catch {
    return Response.json(
      {
        status: "manual-review",
        message:
          "The location could not be checked. Submit it for manual review.",
      },
      { status: 400 },
    );
  }
}
