import { Injectable } from '@nestjs/common';
import {
  RateLimitConfig,
  RateLimiterStrategy,
  RateLimitResult,
} from '../interface/rate-limiter-strategy.interface.js';
import { RedisService } from '@/redis/redis.service.js';
import { randomUUID } from 'crypto';

@Injectable()
export class SlidingLogStrategy implements RateLimiterStrategy {
  constructor(private readonly redisService: RedisService) {}

  async check(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const redis = this.redisService.getClient();

    const now = Date.now();

    const requestId = randomUUID();

    const redisKey = `rate-limit:sliding-log:${key}`;

    const [allowed, count, retryAfterMs] = await redis.slidingLog(
      redisKey,
      now,
      config.windowMs,
      config.limit,
      requestId,
    );

    const remaining = Math.max(config.limit - count, 0);

    return {
      allowed: allowed === 1,
      limit: config.limit,
      remaining,
      ...(allowed === 0 ? { retryAfterMs } : {}),
    };
  }
}
