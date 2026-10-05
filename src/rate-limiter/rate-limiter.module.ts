import { Module } from '@nestjs/common';
import { RateLimiterService } from './services/rate-limiter.service.js';
import { FixedWindowStrategy } from './strategies/fixed-window.strategy.js';
import { RateLimitGuard } from './guard/rate-limit.guard.js';
import { ClientKeyService } from './services/client-key.service.js';

@Module({
  providers: [
    FixedWindowStrategy,
    RateLimiterService,
    ClientKeyService,
    RateLimitGuard,
  ],
  exports: [
    FixedWindowStrategy,
    RateLimiterService,
    RateLimitGuard,
    ClientKeyService,
  ],
})
export class RateLimiterModule {}
