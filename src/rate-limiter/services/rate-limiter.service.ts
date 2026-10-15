import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { RateLimiterStrategy, RateLimitOptions } from '../interface/index.js';
import {
  FixedWindowStrategy,
  SlidingLogStrategy,
} from '../strategies/index.js';

@Injectable()
export class RateLimiterService {
  private readonly strategies: Map<string, RateLimiterStrategy>;

  constructor(
    private readonly fixedWindow: FixedWindowStrategy,
    private readonly slidingLog: SlidingLogStrategy,
  ) {
    this.strategies = new Map<string, RateLimiterStrategy>([
      ['fixed-window', this.fixedWindow],
      ['sliding-log', this.slidingLog],
    ]);
  }

  async check(key: string, options: RateLimitOptions) {
    const strategy = this.strategies.get(options.algorithm);
    if (!strategy) {
      throw new Error(
        `Rate Limiter Algorithm "${options.algorithm}" is not implemented`,
      );
    }

    try {
      return await strategy.check(key, {
        limit: options.limit,
        windowMs: options.windowMs,
      });
    } catch (error) {
      if (options.failureMode === 'closed') {
        throw new ServiceUnavailableException('Rate Limiter Unavailable');
      }
    }
    return {
      allowed: true,
      limit: options.limit,
      remaining: options.limit,
    };
  }
}
