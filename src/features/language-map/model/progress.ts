export const LANGUAGE_MAP_PROGRESS_STORAGE_KEY = "lim.language-map-node-progress.v1";

export type LanguageMapNodeStatus = "new" | "learning" | "learned";

export type LanguageMapProgress = Record<string, LanguageMapNodeStatus>;

const STATUS_SEQUENCE: readonly LanguageMapNodeStatus[] = ["new", "learning", "learned"];

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

function isLanguageMapNodeStatus(value: unknown): value is LanguageMapNodeStatus {
  return value === "new" || value === "learning" || value === "learned";
}

export function getLanguageMapNodeStatus(nodeId: string, progress: LanguageMapProgress): LanguageMapNodeStatus {
  if (!nodeId) {
    return "new";
  }

  const value = progress[nodeId];
  return isLanguageMapNodeStatus(value) ? value : "new";
}

export function readLanguageMapProgress(storage?: Storage): LanguageMapProgress {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) {
    return {};
  }

  let raw: string | null = null;
  try {
    raw = resolvedStorage.getItem(LANGUAGE_MAP_PROGRESS_STORAGE_KEY);
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

    const normalized: LanguageMapProgress = {};
    for (const [nodeId, value] of Object.entries(parsed)) {
      if (typeof nodeId === "string" && nodeId.length > 0 && isLanguageMapNodeStatus(value)) {
        normalized[nodeId] = value;
      }
    }

    return normalized;
  } catch {
    return {};
  }
}

export function setLanguageMapNodeStatus(
  nodeId: string,
  status: LanguageMapNodeStatus,
  storage?: Storage
): LanguageMapProgress {
  const resolvedStorage = resolveStorage(storage);
  const next = readLanguageMapProgress(resolvedStorage ?? undefined);

  if (!nodeId) {
    return next;
  }

  next[nodeId] = status;

  if (resolvedStorage) {
    try {
      resolvedStorage.setItem(LANGUAGE_MAP_PROGRESS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      return next;
    }
  }

  return next;
}

export function cycleLanguageMapNodeStatus(nodeId: string, storage?: Storage): LanguageMapProgress {
  const current = readLanguageMapProgress(storage);
  const currentStatus = getLanguageMapNodeStatus(nodeId, current);
  const index = STATUS_SEQUENCE.indexOf(currentStatus);
  const nextStatus = STATUS_SEQUENCE[(index + 1) % STATUS_SEQUENCE.length] ?? "new";
  return setLanguageMapNodeStatus(nodeId, nextStatus, storage);
}
