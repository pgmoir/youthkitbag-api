import { Test, TestingModule } from '@nestjs/testing';
import { KitbagsService } from './kitbags.service';

describe('KitbagsService', () => {
  let service: KitbagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KitbagsService],
    }).compile();

    service = module.get<KitbagsService>(KitbagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
