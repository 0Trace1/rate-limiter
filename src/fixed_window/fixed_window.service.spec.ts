import { Test, TestingModule } from '@nestjs/testing';
import { FixedWindowService } from './fixed_window.service.js';

describe('FixedWindowService', () => {
  let service: FixedWindowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FixedWindowService],
    }).compile();

    service = module.get<FixedWindowService>(FixedWindowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
