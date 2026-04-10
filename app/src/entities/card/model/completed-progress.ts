import { createLocalStorageProvider } from "~/shared/lib/local-storage-provider";

export const COMPLETED_CARD_PROGRESS_STORAGE_KEY = "lim.completed-card-progress.v1";

export type CompletedCardProgress = Record<string, boolean>;

function sanitizeCompletedCardProgress(raw: unknown): CompletedCardProgress {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const normalized: CompletedCardProgress = {};
  for (const [cardId, value] of Object.entries(raw)) {
    if (typeof cardId === "string" && cardId.length > 0 && typeof value === "boolean") {
      normalized[cardId] = value;
    }
  }

  return normalized;
}

const completedCardProgressProvider = createLocalStorageProvider<CompletedCardProgress>({
  key: COMPLETED_CARD_PROGRESS_STORAGE_KEY,
  getDefaultValue: () => ({}),
  sanitize: sanitizeCompletedCardProgress
});

export function readCompletedCardProgress(storage?: Storage): CompletedCardProgress {
  return completedCardProgressProvider.read(storage);
}

export function writeCompletedCardProgress(cardId: string, completed: boolean, storage?: Storage): CompletedCardProgress {
  if (!cardId) {
    return readCompletedCardProgress(storage);
  }

  return completedCardProgressProvider.update((current) => {
    const next = { ...current };
    if (completed) {
      next[cardId] = true;
    } else {
      delete next[cardId];
    }

    return next;
  }, storage);
}

export function markCardCompleted(cardId: string, storage?: Storage): CompletedCardProgress {
  return writeCompletedCardProgress(cardId, true, storage);
}

export function markCardUncompleted(cardId: string, storage?: Storage): CompletedCardProgress {
  return writeCompletedCardProgress(cardId, false, storage);
}

export function isCardCompleted(cardId: string, progress: CompletedCardProgress): boolean {
  return progress[cardId] === true;
}

export function countCompletedCards(cardIds: readonly string[], progress: CompletedCardProgress): {
  total: number;
  completed: number;
} {
  const uniqueIds = [...new Set(cardIds.filter((cardId) => cardId.length > 0))];
  const completed = uniqueIds.filter((cardId) => progress[cardId] === true).length;

  return {
    total: uniqueIds.length,
    completed
  };
}
