import {MemoryRateLimiter} from "../src/server/rate-limit.ts";
const limiter=new MemoryRateLimiter({limit:30,windowMs:60000});
import { assessServiceArea } from "../src/domain/qualification.ts";
type BookingEnv = { WEBSITE_OPS_URL?: string; WEBSITE_OPS_KEY?: string; WEBSITE_REQUESTS_ENABLED?: string };
export async function handleWebsiteBooking(
  request: Request,
  env: BookingEnv,
): Promise<Response> {
  const reply = (body: unknown, status = 200) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (!env.WEBSITE_OPS_URL || !env.WEBSITE_OPS_KEY)
    return reply(
      {
        error:
          "Online requests are temporarily unavailable. Please call 513-804-7766.",
      },
      503,
    );
  if (request.method !== "POST") return reply({ error: "Use POST" }, 405);
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return reply({ error: "Origin not allowed" }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return reply({ error: "JSON required" }, 415);
  if (Number(request.headers.get("content-length") ?? 0) > 12000)
    return reply({ error: "Request too large" }, 413);
  if(!limiter.check(request.headers.get("cf-connecting-ip")??"local").allowed) return reply({error:"Too many requests. Please wait a minute."},429);
  try {
    const raw = await request.text();
    if (raw.length > 12000) return reply({ error: "Request too large" }, 413);
    const body = JSON.parse(raw);
    if(body.action === "status") return reply({ready:env.WEBSITE_REQUESTS_ENABLED === "true"});
    if(env.WEBSITE_REQUESTS_ENABLED !== "true") return reply({error:"Please call to arrange service while online requests are being enabled."},503);
    if (!["slots", "submit"].includes(body.action))
      return reply({ error: "Invalid action" }, 400);
    if (body.action === "submit") {
      if (body.website || body.consent !== true)
        return reply({ error: "Review and accept the request terms." }, 400);
      if (assessServiceArea(body.data?.zip ?? "").status === "outside")
        return reply(
          { error: "Please call to review this service address." },
          400,
        );
    }
    const client = request.headers.get("cf-connecting-ip") ?? "unknown";
    const hashed = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(env.WEBSITE_OPS_KEY + client),
    );
    const clientHash = Array.from(new Uint8Array(hashed))
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("");
    const response = await fetch(env.WEBSITE_OPS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-website-key": env.WEBSITE_OPS_KEY,
      },
      body: JSON.stringify({
        action: body.action,
        id: body.id,
        data: body.data,
        clientHash,
      }),
      signal: AbortSignal.timeout(25000),
    });
    return reply(await response.json(), response.status);
  } catch {
    return reply(
      {
        error:
          "Could not verify submission. Retry the same request or call us before starting another.",
      },
      502,
    );
  }
}
