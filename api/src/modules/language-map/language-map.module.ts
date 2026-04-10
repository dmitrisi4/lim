import { Module } from '@nestjs/common';
import { LanguageMapController } from './language-map.controller';
import { LanguageMapService } from './language-map.service';

@Module({
  controllers: [LanguageMapController],
  providers: [LanguageMapService]
})
export class LanguageMapModule {}
