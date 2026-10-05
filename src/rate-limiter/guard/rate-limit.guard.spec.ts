import { RateLimitGuard } from './rate-limit.guard.js';

describe('RateLimitGuard', () => {
  it('should be defined', () => {
    expect(new RateLimitGuard()).toBeDefined();
  });
});
