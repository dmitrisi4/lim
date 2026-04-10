import type { CategoryOverviewItem, LevelOverviewItem, LearningOverviewSnapshot } from "~/shared/api/mock-db";
import type { SlideCategory } from "~/slides/core/types";

export interface LearnerProfileSnapshot {
  estimatedLevel: string;
  estimatedLevelLabel: string;
  knownTopics: string[];
  weakAreas: string[];
  unlockedQuestCount: number;
  masteredCategories: SlideCategory[];
}

function pickEstimatedLevel(levels: LevelOverviewItem[]): LevelOverviewItem | null {
  const attempted = levels.filter((item) => item.attempts > 0 || item.quality !== null);
  if (attempted.length === 0) {
    return levels[0] ?? null;
  }

  return attempted
    .slice()
    .sort((a, b) => {
      const qualityA = a.quality ?? 0;
      const qualityB = b.quality ?? 0;
      if (qualityA === qualityB) {
        return b.attempts - a.attempts;
      }
      return qualityB - qualityA;
    })[0] ?? null;
}

export function buildLearnerProfileSnapshot(overview: LearningOverviewSnapshot): LearnerProfileSnapshot {
  const estimated = pickEstimatedLevel(overview.levels);
  const sortedCategories = overview.categories.slice().sort((a, b) => (b.quality ?? 0) - (a.quality ?? 0));
  const masteredCategories = sortedCategories.filter((item) => (item.quality ?? 0) >= 70).slice(0, 3);
  const weakAreas = sortedCategories
    .slice()
    .sort((a, b) => (a.quality ?? 0) - (b.quality ?? 0))
    .filter((item) => item.attempts > 0)
    .slice(0, 3)
    .map((item) => item.category);

  const knownTopics = masteredCategories.map((item) => item.category);

  return {
    estimatedLevel: estimated?.level ?? "a1",
    estimatedLevelLabel: estimated?.level.toUpperCase() ?? "A1",
    knownTopics,
    weakAreas,
    unlockedQuestCount: Math.max(1, masteredCategories.length * 2),
    masteredCategories: masteredCategories.map((item) => item.category)
  };
}
