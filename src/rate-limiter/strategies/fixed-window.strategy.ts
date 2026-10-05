import { Injectable } from '@nestjs/common';
import { RedisService } from '@/redis/redis.service.js';
import {
  RateLimitConfig,
  RateLimiterStrategy,
  RateLimitResult,
} from '../interface/index.js';

@Injectable()
export class FixedWindowStrategy implements RateLimiterStrategy {
  constructor(private readonly redisService: RedisService) {}
  async check(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const redisClient = this.redisService.getClient();
    const window = Math.floor(Date.now() / config.windowMs);
    const redisKey = `rate-limit:${key}:${window}`;
    const count = await redisClient.fixedWindow(redisKey, config.windowMs);

    const allowed = count <= config.limit;

    const remaining = Math.max(config.limit - count, 0);

    let retryAfterMs: number | undefined;

    if (!allowed) {
      const ttl = await redisClient.pttl(redisKey);

      retryAfterMs = Math.max(ttl, 0);
    }

    return {
      allowed,
      limit: config.limit,
      remaining,
      retryAfterMs,
    };
  }
}
