import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';

import { RedisWithRateLimitCommands } from './redis.types.js';
import { ConfigService } from '@nestjs/config';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: RedisWithRateLimitCommands;

  constructor(private readonly configService: ConfigService) {
    const redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: parseInt(this.configService.get<string>('REDIS_PORT', '6379'), 10),
    });

    const fixedWindowScript = readFileSync(
      join(__dirname, '../rate-limiter/scripts/fixed-window.lua'),
      'utf-8',
    );

    redis.defineCommand('fixedWindow', {
      numberOfKeys: 1,
      lua: fixedWindowScript,
    });

    this.redis = redis as RedisWithRateLimitCommands;
  }

  getClient(): RedisWithRateLimitCommands {
    return this.redis;
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
