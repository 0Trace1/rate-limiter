import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module.js';
import { RedisModule } from './redis/redis.module.js';

@Module({
  imports: [
    RateLimiterModule,
    RedisModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
