export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}
export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterMs?: number;
}
export interface RateLimiterStrategy {
  check(key: string, config: RateLimitConfig): Promise<RateLimitResult>;
}
