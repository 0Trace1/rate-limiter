import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { RateLimitKeyType } from '../interface/index.js';

@Injectable()
export class ClientKeyService {
  resolve(request: Request, keyType: RateLimitKeyType = 'ip'): string {
    switch (keyType) {
      case 'ip':
        return `ip:${request.ip}`;

      case 'user': {
        const userId = (request as any).user?.id;

        if (!userId) {
          return `ip:${request.ip}`;
        }

        return `user:${userId}`;
      }

      case 'api-key': {
        const apiKey = request.headers['x-api-key'];

        if (!apiKey) {
          return `ip:${request.ip}`;
        }

        return `api-key:${apiKey}`;
      }

      default:
        return `ip:${request.ip}`;
    }
  }
}
