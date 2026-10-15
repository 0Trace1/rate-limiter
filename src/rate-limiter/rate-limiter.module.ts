import { Module } from '@nestjs/common';
import { RateLimiterService } from './services/rate-limiter.service.js';
import { FixedWindowStrategy } from './strategies/fixed-window.strategy.js';
import { RateLimitGuard } from './guard/rate-limit.guard.js';
import { ClientKeyService } from './services/client-key.service.js';
import { SlidingLogStrategy } from './strategies/sliding-log.strategy.js';

@Module({
  providers: [
    FixedWindowStrategy,
    SlidingLogStrategy,
    RateLimiterService,
    ClientKeyService,
    RateLimitGuard,
  ],
  exports: [
    FixedWindowStrategy,
    SlidingLogStrategy,
    RateLimiterService,
    RateLimitGuard,
    ClientKeyService,
  ],
})
export class RateLimiterModule {}
