import { Module } from '@nestjs/common';
import { RateLimiterService } from './services/rate-limiter.service.js';
import { FixedWindowStrategy } from './strategies/fixed-window.strategy.js';
import { RateLimitGuard } from './guard/rate-limit.guard.js';
import { ClientKeyService } from './services/client-key.service.js';
import { SlidingLogStrategy } from './strategies/sliding-log.strategy.js';
import { SlidingCounterStrategy } from './strategies/sliding-counter.strategy.js';

@Module({
  providers: [
    FixedWindowStrategy,
    SlidingLogStrategy,
    SlidingCounterStrategy,
    RateLimiterService,
    ClientKeyService,
    RateLimitGuard,
  ],
  exports: [
    FixedWindowStrategy,
    SlidingLogStrategy,
    SlidingCounterStrategy,
    RateLimiterService,
    RateLimitGuard,
    ClientKeyService,
  ],
})
export class RateLimiterModule {}
