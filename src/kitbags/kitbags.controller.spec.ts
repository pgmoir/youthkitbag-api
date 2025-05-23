import { Test, TestingModule } from '@nestjs/testing';
import { KitbagsController } from './kitbags.controller';
import { KitbagsService } from './kitbags.service';

describe('KitbagsController', () => {
  let controller: KitbagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KitbagsController],
      providers: [KitbagsService],
    }).compile();

    controller = module.get<KitbagsController>(KitbagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
