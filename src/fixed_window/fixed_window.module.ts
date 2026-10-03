import { Module } from '@nestjs/common';
import { FixedWindowService } from './fixed_window.service.js';
import { FixedWindowController } from './fixed_window.controller.js';

@Module({
  controllers: [FixedWindowController],
  providers: [FixedWindowService],
})
export class FixedWindowModule {}
