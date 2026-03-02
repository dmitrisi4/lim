export const VOCABULARY_WORD_PROGRESS_STORAGE_KEY = "lim.vocabulary-word-progress.v1";

export type VocabularyWordProgress = Record<string, boolean>;

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

export function readVocabularyWordProgress(storage?: Storage): VocabularyWordProgress {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) {
    return {};
  }

  let raw: string | null = null;
  try {
    raw = resolvedStorage.getItem(VOCABULARY_WORD_PROGRESS_STORAGE_KEY);
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

    const normalized: VocabularyWordProgress = {};
    for (const [wordId, value] of Object.entries(parsed)) {
      if (typeof wordId === "string" && wordId.length > 0 && typeof value === "boolean") {
        normalized[wordId] = value;
      }
    }

    return normalized;
  } catch {
    return {};
  }
}

export function writeVocabularyWordProgress(wordId: string, learned: boolean, storage?: Storage): VocabularyWordProgress {
  const resolvedStorage = resolveStorage(storage);
  const next = readVocabularyWordProgress(resolvedStorage ?? undefined);

  if (!wordId) {
    return next;
  }

  next[wordId] = learned;

  if (resolvedStorage) {
    try {
      resolvedStorage.setItem(VOCABULARY_WORD_PROGRESS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      return next;
    }
  }

  return next;
}

export function toggleVocabularyWordProgress(wordId: string, storage?: Storage): VocabularyWordProgress {
  const current = readVocabularyWordProgress(storage);
  const nextValue = !current[wordId];
  return writeVocabularyWordProgress(wordId, nextValue, storage);
}
