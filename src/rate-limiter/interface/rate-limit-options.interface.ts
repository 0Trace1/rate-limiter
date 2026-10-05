export type RateLimitAlgorithm = 'fixed-window';

export type RateLimitKeyType = 'ip' | 'user' | 'api-key';

export type RateLimitFailureMode = 'open' | 'closed';

export interface RateLimitOptions {
  algorithm: RateLimitAlgorithm;
  limit: number;
  windowMs: number;
  keyType?: RateLimitKeyType;
  failureMode?: RateLimitFailureMode;
}
