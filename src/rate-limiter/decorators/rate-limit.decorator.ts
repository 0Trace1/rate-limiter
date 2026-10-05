import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { RateLimitOptions } from '../interface/rate-limit-options.interface.js';

export const RATE_LIMIT_METADATA = 'rate-limit';

export const RateLimit = (
  options: RateLimitOptions,
): CustomDecorator<typeof RATE_LIMIT_METADATA> =>
  SetMetadata(RATE_LIMIT_METADATA, options);
