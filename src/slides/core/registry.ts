import type { EnglishLevel, SlideModule } from "~/slides/core/types";
import { articlesModule } from "~/slides/modules/a1/grammar/articles.module";
import { canModalModule } from "~/slides/modules/a1/grammar/can-modal.module";
import { flashcardsEnRulesModule } from "~/slides/modules/a1/grammar/flashcards-en-rules.module";
import { possessivesModule } from "~/slides/modules/a1/grammar/possessives.module";
import { presentContinuousModule } from "~/slides/modules/a1/grammar/present-continuous.module";
import { presentSimpleModule } from "~/slides/modules/a1/grammar/present-simple.module";
import { thereIsAreModule } from "~/slides/modules/a1/grammar/there-is-are.module";
import { toBeBasicsModule } from "~/slides/modules/a1/grammar/to-be-basics.module";
import { classroomListeningModule } from "~/slides/modules/a1/listening/classroom.module";
import { listeningNumbersModule } from "~/slides/modules/a1/listening/numbers.module";
import { citySignsReadingModule } from "~/slides/modules/a1/reading/city-signs.module";
import { introductionsSpeakingModule } from "~/slides/modules/a1/speaking/introductions.module";
import { smallTalkModule } from "~/slides/modules/a1/speaking/small-talk.module";
import { colorsFamilyVocabularyModule } from "~/slides/modules/a1/vocabulary/colors-family.module";
import { dailyRoutineVocabularyModule } from "~/slides/modules/a1/vocabulary/daily-routine.module";
import { flashcardsEnWordsModule } from "~/slides/modules/a1/vocabulary/flashcards-en-words.module";
import { travelVocabularyModule } from "~/slides/modules/a1/vocabulary/travel.module";
import { workVocabularyModule } from "~/slides/modules/b1/vocabulary/work.module";

const slideModulesByLevel: Record<EnglishLevel, SlideModule[]> = {
  a1: [
    presentSimpleModule,
    presentContinuousModule,
    articlesModule,
    toBeBasicsModule,
    possessivesModule,
    thereIsAreModule,
    canModalModule,
    flashcardsEnRulesModule,
    travelVocabularyModule,
    dailyRoutineVocabularyModule,
    colorsFamilyVocabularyModule,
    flashcardsEnWordsModule,
    listeningNumbersModule,
    classroomListeningModule,
    smallTalkModule,
    introductionsSpeakingModule,
    citySignsReadingModule
  ],
  a2: [],
  b1: [workVocabularyModule],
  b2: [],
  c1: []
};

const START_LEVEL: EnglishLevel = "a1";

export function getSlideModules(levels: EnglishLevel[] = [START_LEVEL]): SlideModule[] {
  const requestedLevels = levels.length > 0 ? levels : [START_LEVEL];
  return requestedLevels.flatMap((level) => slideModulesByLevel[level] ?? []);
}

export function getAllSlideModules(): SlideModule[] {
  return Object.values(slideModulesByLevel).flatMap((modules) => modules);
}
