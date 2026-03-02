import type { Card } from "~/entities/card/model/types";
import { materializeModuleCards } from "~/slides/core/tracking";
import type {
  SlideLearnerProfile,
  SlideModule,
  SlideSelectionParams,
  SlideSelectionResult
} from "~/slides/core/types";

function getRuleFocusScore(module: SlideModule, profile: SlideLearnerProfile): number {
  if (!profile.focusRules?.length) {
    return 0;
  }

  const hits = module.meta.ruleTags.filter((rule) => profile.focusRules?.includes(rule)).length;
  return hits * 2;
}

function scoreModule(module: SlideModule, profile: SlideLearnerProfile): number {
  const levelScore = profile.targetLevels.includes(module.meta.level) ? 6 : 1;
  const categoryScore = profile.preferredCategories.includes(module.meta.category) ? 4 : 0;
  const focusScore = getRuleFocusScore(module, profile);

  return levelScore + categoryScore + focusScore;
}

function compareByScoreThenId(a: { module: SlideModule; score: number }, b: { module: SlideModule; score: number }): number {
  if (b.score !== a.score) {
    return b.score - a.score;
  }

  return a.module.meta.id.localeCompare(b.module.meta.id);
}

function interleaveCardBuckets(cardBuckets: Card[][]): Card[] {
  const result: Card[] = [];
  let offset = 0;
  let hasCards = true;

  while (hasCards) {
    hasCards = false;

    for (const cards of cardBuckets) {
      if (offset < cards.length) {
        result.push(cards[offset]);
        hasCards = true;
      }
    }

    offset += 1;
  }

  return result;
}

function normalizeCursor(cursor: number, poolSize: number): number {
  if (poolSize === 0 || cursor <= 0) {
    return 0;
  }

  return cursor % poolSize;
}

export function buildSlidePool(modules: SlideModule[], profile: SlideLearnerProfile): Card[] {
  const levelFilteredModules =
    profile.targetLevels.length > 0
      ? modules.filter((module) => profile.targetLevels.includes(module.meta.level))
      : modules;

  const categoryFilteredModules =
    profile.targetCategories && profile.targetCategories.length > 0
      ? levelFilteredModules.filter((module) => profile.targetCategories?.includes(module.meta.category))
      : levelFilteredModules;

  const sourceModules =
    categoryFilteredModules.length > 0
      ? categoryFilteredModules
      : levelFilteredModules.length > 0
        ? levelFilteredModules
        : modules;

  const sortedModules = sourceModules
    .map((module) => ({ module, score: scoreModule(module, profile) }))
    .sort(compareByScoreThenId)
    .map((entry) => entry.module);

  const cardBuckets = sortedModules.map((module) => materializeModuleCards(module.meta, module.cards));
  return interleaveCardBuckets(cardBuckets);
}

export function buildAllSlideCards(modules: SlideModule[]): Card[] {
  const sorted = [...modules].sort((a, b) => a.meta.id.localeCompare(b.meta.id));
  return sorted.flatMap((module) => materializeModuleCards(module.meta, module.cards));
}

export function selectSlideCards(params: SlideSelectionParams): SlideSelectionResult {
  const pool = buildSlidePool(params.modules, params.profile);

  if (pool.length === 0) {
    return {
      cards: [],
      nextCursor: 0,
      hasMore: false,
      startIndex: 0,
      totalAvailable: 0
    };
  }

  const safeLimit = Math.max(1, Math.min(params.limit, pool.length));
  const safeCursor = normalizeCursor(params.cursor, pool.length);
  const cards: Card[] = [];

  for (let i = 0; i < safeLimit; i += 1) {
    cards.push(pool[(safeCursor + i) % pool.length]);
  }

  return {
    cards,
    nextCursor: normalizeCursor(safeCursor + safeLimit, pool.length),
    hasMore: true,
    startIndex: safeCursor,
    totalAvailable: pool.length
  };
}
