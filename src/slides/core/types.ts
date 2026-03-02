import type { Card } from "~/entities/card/model/types";

export type EnglishLevel = "a1" | "a2" | "b1" | "b2" | "c1";

export type SlideCategory = "grammar" | "vocabulary" | "speaking" | "listening" | "reading";

export type RuleTag = string;

export interface SlideModuleMeta {
  id: string;
  title: string;
  description: string;
  level: EnglishLevel;
  category: SlideCategory;
  ruleTags: RuleTag[];
}

export interface SlideModule {
  meta: SlideModuleMeta;
  cards: Card[];
}

export interface SlideLearnerProfile {
  targetLevels: EnglishLevel[];
  targetCategories?: SlideCategory[];
  preferredCategories: SlideCategory[];
  focusRules?: RuleTag[];
}

export interface SlideSelectionParams {
  modules: SlideModule[];
  cursor: number;
  limit: number;
  profile: SlideLearnerProfile;
}

export interface SlideSelectionResult {
  cards: Card[];
  nextCursor: number;
  hasMore: boolean;
  startIndex: number;
  totalAvailable: number;
}
