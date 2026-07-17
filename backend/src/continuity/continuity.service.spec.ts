import { Test, TestingModule } from '@nestjs/testing';
import { ContinuityService } from './continuity.service';

describe('ContinuityService', () => {
  let service: ContinuityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContinuityService],
    }).compile();

    service = module.get<ContinuityService>(ContinuityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
