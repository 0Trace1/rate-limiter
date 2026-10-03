import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FixedWindowModule } from './fixed_window/fixed_window.module.js';

@Module({
  imports: [FixedWindowModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
