import { Test, TestingModule } from '@nestjs/testing';
import { FixedWindowController } from './fixed_window.controller.js';
import { FixedWindowService } from './fixed_window.service.js';

describe('FixedWindowController', () => {
  let controller: FixedWindowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FixedWindowController],
      providers: [FixedWindowService],
    }).compile();

    controller = module.get<FixedWindowController>(FixedWindowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
