import { Test, TestingModule } from '@nestjs/testing';
import { PickingController } from './picking.controller';

describe('PickingController', () => {
  let controller: PickingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PickingController],
    }).compile();

    controller = module.get<PickingController>(PickingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
