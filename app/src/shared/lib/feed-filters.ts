import type { EnglishLevel, SlideCategory } from "~/slides/core/types";
import type { LearningLanguage } from "~/shared/i18n/ui";

export type FeedAnswerFilter = "correct" | "incorrect" | "unanswered";

export interface FeedFilters {
  levels: EnglishLevel[];
  categories: SlideCategory[];
  answers: FeedAnswerFilter[];
}

export const FEED_LEVEL_OPTIONS: readonly EnglishLevel[] = ["a1", "a2", "b1", "b2", "c1"];
export const FEED_CATEGORY_OPTIONS: readonly SlideCategory[] = ["grammar", "vocabulary", "speaking", "listening", "reading"];
export const FEED_ANSWER_OPTIONS: readonly FeedAnswerFilter[] = ["correct", "incorrect", "unanswered"];

interface FeedFilterInput {
  levels?: string[];
  categories?: string[];
  answers?: string[];
}

function isEnglishLevel(value: string): value is EnglishLevel {
  return FEED_LEVEL_OPTIONS.includes(value as EnglishLevel);
}

function isSlideCategory(value: string): value is SlideCategory {
  return FEED_CATEGORY_OPTIONS.includes(value as SlideCategory);
}

function isFeedAnswerFilter(value: string): value is FeedAnswerFilter {
  return FEED_ANSWER_OPTIONS.includes(value as FeedAnswerFilter);
}

function unique<T extends string>(values: T[]): T[] {
  return [...new Set(values)];
}

export function normalizeFeedFilters(input: FeedFilterInput): FeedFilters {
  const rawLevels = unique((input.levels ?? []).filter(isEnglishLevel));
  const categories = unique((input.categories ?? []).filter(isSlideCategory));
  const answers = unique((input.answers ?? []).filter(isFeedAnswerFilter));

  return {
    levels: rawLevels.length > 0 ? rawLevels : ["a1"],
    categories,
    answers
  };
}

export function parseFeedFiltersFromSearchParams(searchParams: URLSearchParams): FeedFilters {
  return normalizeFeedFilters({
    levels: searchParams.getAll("level"),
    categories: searchParams.getAll("category"),
    answers: searchParams.getAll("answer")
  });
}

export function buildFeedHref(cursor: number, filters: FeedFilters, language?: LearningLanguage): string {
  const params = new URLSearchParams();
  params.set("cursor", String(Math.max(0, cursor)));

  filters.levels.forEach((level) => params.append("level", level));
  filters.categories.forEach((category) => params.append("category", category));
  filters.answers.forEach((answer) => params.append("answer", answer));
  if (language) {
    params.set("lang", language);
  }

  return `/feed?${params.toString()}`;
}
