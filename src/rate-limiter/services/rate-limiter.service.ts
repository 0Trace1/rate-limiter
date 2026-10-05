import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { RateLimiterStrategy } from '../interface/rate-limiter-strategy.interface.js';
import { FixedWindowStrategy } from '../strategies/fixed-window.strategy.js';
import { RateLimitOptions } from '../interface/index.js';

@Injectable()
export class RateLimiterService {
  private readonly strategies: Map<string, RateLimiterStrategy>;

  constructor(private readonly fixedWindow: FixedWindowStrategy) {
    this.strategies = new Map([['fixed-window', this.fixedWindow]]);
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
