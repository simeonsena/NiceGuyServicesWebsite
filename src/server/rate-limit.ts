type RateLimitOptions = { limit: number; windowMs: number };
type Entry = { count: number; resetsAt: number };

export class MemoryRateLimiter {
  private readonly entries = new Map<string, Entry>();
  private readonly options: RateLimitOptions;

  constructor(options: RateLimitOptions) {
    this.options = options;
  }

  check(key: string, now = Date.now()) {
    const current = this.entries.get(key);
    if (!current || current.resetsAt <= now) {
      const resetsAt = now + this.options.windowMs;
      this.entries.set(key, { count: 1, resetsAt });
      return { allowed: true, remaining: this.options.limit - 1, resetsAt };
    }
    if (current.count >= this.options.limit)
      return { allowed: false, remaining: 0, resetsAt: current.resetsAt };
    current.count += 1;
    return {
      allowed: true,
      remaining: this.options.limit - current.count,
      resetsAt: current.resetsAt,
    };
  }
}

export function requestClientKey(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local-client"
  );
}

export function hasValidOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
