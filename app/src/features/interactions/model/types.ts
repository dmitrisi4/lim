import type { CardType } from "~/entities/card/model/types";
import type { LearningLanguage } from "~/shared/i18n/ui";

export interface CardCompletionInput {
  cardId: string;
  cardType: CardType;
  answer?: string;
  correct?: boolean | null;
}

export interface InteractionSubmissionInput extends CardCompletionInput {
  userId: string;
  language?: LearningLanguage;
  durationMs?: number;
}

export interface ProgressSnapshot {
  xp: number;
  level: number;
  dailyGoal: number;
  dailyCompleted: number;
  streakDays: number;
}

export interface InteractionSubmitResult {
  ok: boolean;
  cardId: string;
  message: string;
  xpDelta: number;
  streakDelta: number;
  correct: boolean | null;
  progress: ProgressSnapshot;
}
