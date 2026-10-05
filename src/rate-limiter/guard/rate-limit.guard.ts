import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  // TooManyRequestsException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimiterService } from '../services/rate-limiter.service.js';
import { ClientKeyService } from '../services/client-key.service.js';
import { RateLimitOptions } from '../interface/rate-limit-options.interface.js';
import { RATE_LIMIT_METADATA } from '../decorators/rate-limit.decorator.js';
import { Request, Response } from 'express';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rateLimiter: RateLimiterService,
    private readonly clientKeyService: ClientKeyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.getAllAndOverride<RateLimitOptions>(
      RATE_LIMIT_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (!options) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest<Request>();
    const key = this.clientKeyService.resolve(request, options.keyType);

    const result = await this.rateLimiter.check(key, options);
    const response: Response = context.switchToHttp().getResponse<Response>();

    this.setRateLimitHeaders(response, result, options);

    if (!result.allowed) {
      const retryAfterSeconds = Math.ceil((result.retryAfterMs ?? 0) / 1000);
      response.setHeader('Retry-After', retryAfterSeconds);
      throw new HttpException(
        {
          message: 'Too many requests',
          retryAfterMs: result.retryAfterMs,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }
  private setRateLimitHeaders(
    response: Response,
    result: any,
    options: RateLimitOptions,
  ) {
    const now = Date.now();

    const windowStart = Math.floor(now / options.windowMs) * options.windowMs;
    const windowEnd = windowStart + options.windowMs;

    response.setHeader('X-RateLimit-Limit', result.limit);
    response.setHeader('X-RateLimit-Remaining', result.remaining);
    response.setHeader('X-RateLimit-Reset', Math.ceil(windowEnd / 1000));
  }
}
