import type { FeedAnswerFilter } from "~/shared/lib/feed-filters";

export const CARD_ANSWER_OUTCOMES_STORAGE_KEY = "lim.card-answer-outcomes.v1";

type CardAnswerOutcomes = Record<string, FeedAnswerFilter>;

function isFeedAnswerFilter(value: unknown): value is FeedAnswerFilter {
  return value === "correct" || value === "incorrect";
}

function resolveStorage(storage?: Storage): Storage | null {
  if (storage) {
    return storage;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readCardAnswerOutcomes(storage?: Storage): CardAnswerOutcomes {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) {
    return {};
  }

  let raw: string | null = null;
  try {
    raw = resolvedStorage.getItem(CARD_ANSWER_OUTCOMES_STORAGE_KEY);
  } catch {
    return {};
  }

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const normalized: CardAnswerOutcomes = {};
    for (const [cardId, value] of Object.entries(parsed)) {
      if (typeof cardId === "string" && cardId.length > 0 && isFeedAnswerFilter(value)) {
        normalized[cardId] = value;
      }
    }

    return normalized;
  } catch {
    return {};
  }
}

export function writeCardAnswerOutcome(cardId: string, correct: boolean, storage?: Storage): CardAnswerOutcomes {
  const resolvedStorage = resolveStorage(storage);
  const next = readCardAnswerOutcomes(resolvedStorage ?? undefined);
  if (!cardId) {
    return next;
  }

  next[cardId] = correct ? "correct" : "incorrect";

  if (resolvedStorage) {
    try {
      resolvedStorage.setItem(CARD_ANSWER_OUTCOMES_STORAGE_KEY, JSON.stringify(next));
    } catch {
      return next;
    }
  }

  return next;
}
