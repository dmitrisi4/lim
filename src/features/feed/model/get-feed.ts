import type { Card } from "~/entities/card/model/types";
import type { Streak } from "~/entities/streak/model/types";
import type { UserProgress } from "~/entities/user-progress/model/types";
import { applyAntiDoomscrollRules } from "~/features/feed/model/anti-doomscroll";
import type { LearningLanguage } from "~/shared/i18n/ui";
import { normalizeFeedFilters, type FeedAnswerFilter, type FeedFilters } from "~/shared/lib/feed-filters";
import type { EnglishLevel, SlideCategory } from "~/slides/core/types";
import { getMockFeedSlice, getMockProgressSnapshot } from "~/shared/api/mock-db";

export interface FeedPage {
  cards: Card[];
  nextCursor: number;
  hasMore: boolean;
  startIndex: number;
  totalAvailable: number;
  progress: UserProgress;
  streak: Streak;
  filters: FeedFilters;
}

export interface FeedRequestParams {
  userId: string;
  cursor: number;
  limit: number;
  language: LearningLanguage;
  levels?: EnglishLevel[];
  categories?: SlideCategory[];
  answers?: FeedAnswerFilter[];
}

export async function getFeedPage(params: FeedRequestParams): Promise<FeedPage> {
  const filters = normalizeFeedFilters({
    levels: params.levels,
    categories: params.categories,
    answers: params.answers
  });

  const slice = getMockFeedSlice(params.cursor, params.limit, params.userId, filters, params.language);
  const snapshot = getMockProgressSnapshot(params.userId);

  return {
    cards: applyAntiDoomscrollRules(slice.cards, params.language),
    nextCursor: slice.nextCursor,
    hasMore: slice.hasMore,
    startIndex: slice.startIndex,
    totalAvailable: slice.totalAvailable,
    progress: snapshot.progress,
    streak: snapshot.streak,
    filters
  };
}
