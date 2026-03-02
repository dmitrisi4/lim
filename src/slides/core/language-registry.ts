import type { LearningLanguage } from "~/shared/i18n/ui";
import { getAllSlideModules } from "~/slides/core/registry";
import type { SlideModule } from "~/slides/core/types";
import { articulosGeneroNumeroModule } from "~/slides/modules/es/a1/grammar/articulos-genero-numero.module";
import { csvFlashcardsA1Module } from "~/slides/modules/es/a1/grammar/csv-flashcards.module";
import { irAInfinitivoModule } from "~/slides/modules/es/a1/grammar/ir-a-infinitivo.module";
import { numerosTiempoListeningModule } from "~/slides/modules/es/a1/listening/numeros-tiempo.module";
import { presenteBasicoModule } from "~/slides/modules/es/a1/grammar/presente-basico.module";
import { presenteIrregularesModule } from "~/slides/modules/es/a1/grammar/presente-irregulares.module";
import { serEstarModule } from "~/slides/modules/es/a1/grammar/ser-estar.module";
import { tenerLlamarseModule } from "~/slides/modules/es/a1/grammar/tener-llamarse.module";
import { senalesReadingModule } from "~/slides/modules/es/a1/reading/senales.module";
import { presentacionesSpeakingModule } from "~/slides/modules/es/a1/speaking/presentaciones.module";
import { coloresDiasTiempoVocabularyModule } from "~/slides/modules/es/a1/vocabulary/colores-dias-tiempo.module";
import { familiaComidaVocabularyModule } from "~/slides/modules/es/a1/vocabulary/familia-comida.module";
import { numeros0100VocabularyModule } from "~/slides/modules/es/a1/vocabulary/numeros-0-100.module";
import { viajesVocabularyModule } from "~/slides/modules/es/a1/vocabulary/viajes.module";

const englishSlideModules = getAllSlideModules();

const spanishSlideModules: SlideModule[] = [
  serEstarModule,
  tenerLlamarseModule,
  presenteBasicoModule,
  presenteIrregularesModule,
  articulosGeneroNumeroModule,
  irAInfinitivoModule,
  csvFlashcardsA1Module,
  familiaComidaVocabularyModule,
  numeros0100VocabularyModule,
  coloresDiasTiempoVocabularyModule,
  viajesVocabularyModule,
  numerosTiempoListeningModule,
  presentacionesSpeakingModule,
  senalesReadingModule
];

const slideModulesByLanguage: Record<LearningLanguage, SlideModule[]> = {
  en: englishSlideModules,
  es: spanishSlideModules
};

export function getSlideModulesForLanguage(language: LearningLanguage): SlideModule[] {
  return slideModulesByLanguage[language] ?? slideModulesByLanguage.en;
}
