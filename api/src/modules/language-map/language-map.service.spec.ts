import { Test, TestingModule } from '@nestjs/testing';
import { LanguageMapService } from './language-map.service';

describe('LanguageMapService', () => {
  let service: LanguageMapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LanguageMapService],
    }).compile();

    service = module.get<LanguageMapService>(LanguageMapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
