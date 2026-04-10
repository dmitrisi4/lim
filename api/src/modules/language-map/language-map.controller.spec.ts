import { Test, TestingModule } from '@nestjs/testing';
import { LanguageMapController } from './language-map.controller';

describe('LanguageMapController', () => {
  let controller: LanguageMapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LanguageMapController],
    }).compile();

    controller = module.get<LanguageMapController>(LanguageMapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
