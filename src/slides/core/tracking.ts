import type { Card, CardTracking } from "~/entities/card/model/types";
import type { EnglishLevel, SlideModuleMeta } from "~/slides/core/types";

const levelDifficultyMap: Record<EnglishLevel, CardTracking["difficulty"]> = {
  a1: "easy",
  a2: "easy",
  b1: "medium",
  b2: "hard",
  c1: "hard"
};

export function buildTrackingFromMeta(meta: SlideModuleMeta, tracking?: CardTracking): CardTracking {
  return {
    topic: tracking?.topic ?? meta.title,
    difficulty: tracking?.difficulty ?? levelDifficultyMap[meta.level],
    level: meta.level,
    category: meta.category,
    ruleTags: meta.ruleTags,
    moduleId: meta.id
  };
}

export function buildSlideCardId(moduleId: string, localCardId: string): string {
  return `${moduleId}::${localCardId}`;
}

export function materializeModuleCards(meta: SlideModuleMeta, cards: Card[]): Card[] {
  return cards.map((card) => ({
    ...card,
    id: buildSlideCardId(meta.id, card.id),
    tracking: buildTrackingFromMeta(meta, card.tracking)
  }));
}
