import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import { FixedWindowStrategy } from './rate-limiter/strategies/fixed-window.strategy.js';
import { RateLimitGuard } from './rate-limiter/guard/rate-limit.guard.js';
import { RateLimit } from './rate-limiter/decorators/rate-limit.decorator.js';

@Controller()
@UseGuards(RateLimitGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly fixedWindow: FixedWindowStrategy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  @RateLimit({
    algorithm: 'fixed-window',
    limit: 5,
    windowMs: 60_000,
    keyType: 'ip',
    failureMode: 'open',
  })
  test() {
    return {
      message: 'Request Allowed',
    };
  }
}
