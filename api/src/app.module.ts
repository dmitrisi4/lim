import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { FeedModule } from './modules/feed/feed.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { LanguageMapModule } from './modules/language-map/language-map.module';
import { QuestsModule } from './modules/quests/quests.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UsersModule, FeedModule, VocabularyModule, LanguageMapModule, QuestsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
