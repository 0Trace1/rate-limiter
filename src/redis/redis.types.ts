import { Redis } from 'ioredis';

export interface RedisWithRateLimitCommands extends Redis {
  fixedWindow(key: string, windowMs: number): Promise<number>;

  slidingLog(
    key: string,
    now: number,
    windowMs: number,
    limit: number,
    requestId: string,
  ): Promise<[number, number, number]>;

  slidingCounter(
    currentKey: string,
    previousKey: string,
    now: number,
    windowMs: number,
    limit: number,
  ): Promise<[number, number, number]>;
}
