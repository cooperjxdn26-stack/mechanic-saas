import { Test, TestingModule } from '@nestjs/testing';
import { ContinuityController } from './continuity.controller';

describe('ContinuityController', () => {
  let controller: ContinuityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContinuityController],
    }).compile();

    controller = module.get<ContinuityController>(ContinuityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
