/**
 * Simple in-memory sliding window rate limiter.
 * For production, replace with @upstash/ratelimit + Redis.
 */

const requests = new Map<string, number[]>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Get existing timestamps and filter to current window
  const timestamps = (requests.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= limit) {
    return { success: false, remaining: 0 };
  }

  timestamps.push(now);
  requests.set(key, timestamps);

  // Cleanup old entries periodically
  if (requests.size > 10000) {
    const keys = Array.from(requests.keys());
    for (const k of keys) {
      const v = requests.get(k)!;
      const active = v.filter((t) => t > windowStart);
      if (active.length === 0) {
        requests.delete(k);
      } else {
        requests.set(k, active);
      }
    }
  }

  return { success: true, remaining: limit - timestamps.length };
}
