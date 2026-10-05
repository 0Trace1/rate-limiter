import { Redis } from 'ioredis';

export interface RedisWithRateLimitCommands extends Redis {
  fixedWindow(key: string, windowMs: number): Promise<number>;
}
