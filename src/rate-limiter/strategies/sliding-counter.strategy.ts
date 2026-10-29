import { Injectable } from '@nestjs/common';
import {
  RateLimitConfig,
  RateLimiterStrategy,
  RateLimitResult,
} from '../interface/rate-limiter-strategy.interface.js';
import { RedisService } from '@/redis/redis.service.js';

@Injectable()
export class SlidingCounterStrategy implements RateLimiterStrategy {
  constructor(private readonly redisService: RedisService) {}

  async check(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const redis = this.redisService.getClient();

    const now = Date.now();

    const windowId = Math.floor(now / config.windowMs);
    const prefix = `rate-limiter:sliding-counter:${key}`;

    const currentKey = `${prefix}:${windowId}`;
    const previousKey = `${prefix}:${windowId - 1}`;

    const [allowed, estimatedCount, retryAfterMs] = await redis.slidingCounter(
      currentKey,
      previousKey,
      now,
      config.windowMs,
      config.limit,
    );

    const remaining = Math.max(0, Math.floor(config.limit - estimatedCount));

    return {
      allowed: allowed === 1,
      limit: config.limit,
      remaining,
      ...(allowed === 0 ? { retryAfterMs } : {}),
    };
  }
}
