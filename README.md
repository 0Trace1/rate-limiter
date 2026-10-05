# Rate Limiter

A NestJS rate-limiting module backed by Redis. The current implementation supports a fixed-window algorithm and is designed to protect HTTP endpoints by tracking request counts per client key over a configured time window.

## Current status

Only the fixed-window strategy has been implemented.

Supported algorithm:
- `fixed-window`

Not implemented yet:
- sliding window
- token bucket
- leaky bucket
- other advanced rate-limit algorithms

## Architecture

The project includes:

- a `@RateLimit()` decorator for endpoint-level configuration
- a guard that enforces the limit before the request continues
- a strategy registry that resolves the configured algorithm
- a Redis-backed fixed-window implementation using a Lua script
- client-key resolution by IP, user ID, or API key

## Redis setup

This project expects Redis to be available on the local machine by default:

- host: `localhost`
- port: `6379`

You can override these values with environment variables:

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Install

```bash
npm install
```

## Run the app

```bash
npm run start
```

For development mode:

```bash
npm run start:dev
```

## Run tests

```bash
npm run test
```

## Fixed-window behavior

The fixed-window strategy uses a Redis key per client and per time bucket:

```ts
const window = Math.floor(Date.now() / config.windowMs);
const redisKey = `rate-limit:${key}:${window}`;
```

Each request increments the counter in Redis. The counter resets when the time bucket changes. The Lua script used for this is located in:

- `src/rate-limiter/scripts/fixed-window.lua`

It performs an atomic `INCR` and sets the TTL only on the first request in the bucket.

## Endpoint usage

```ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RateLimitGuard } from './rate-limiter/guard/rate-limit.guard.js';
import { RateLimit } from './rate-limiter/decorators/rate-limit.decorator.js';

@Controller()
@UseGuards(RateLimitGuard)
export class AppController {
  @Get('test')
  @RateLimit({
    algorithm: 'fixed-window',
    limit: 5,
    windowMs: 60_000,
    keyType: 'ip',
    failureMode: 'open',
  })
  test() {
    return { message: 'Request Allowed' };
  }
}
```

### Supported key types

```ts
keyType: 'ip' | 'user' | 'api-key'
```

- `ip`: rate limits by request IP
- `user`: rate limits by authenticated user ID when available, otherwise falls back to IP
- `api-key`: rate limits by `x-api-key` header when present, otherwise falls back to IP

## Response handling

When a request exceeds the configured limit, the guard responds with `429 Too Many Requests` and adds headers such as:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
- `Retry-After`

The response body includes the retry window in milliseconds:

```json
{
  "message": "Too many requests",
  "retryAfterMs": 15000
}
```

## Failure mode

The `failureMode` option is supported but optional.

- `open`: when Redis is unavailable, requests are allowed
- `closed`: when Redis is unavailable, the service throws a `503 Service Unavailable`

## Notes

This repository is a focused implementation of a Redis-backed rate limiter for fixed windows. It is intentionally limited to the `fixed-window` algorithm until additional strategies are added.
