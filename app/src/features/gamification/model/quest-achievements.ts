import { createLocalStorageProvider } from "~/shared/lib/local-storage-provider";

export const QUEST_ACHIEVEMENT_STORAGE_KEY = "lim.quest-achievement-progress.v1";

export type QuestAchievementProgress = Record<string, boolean>;

function sanitizeQuestAchievementProgress(raw: unknown): QuestAchievementProgress {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const normalized: QuestAchievementProgress = {};
  for (const [questId, value] of Object.entries(raw)) {
    if (typeof questId === "string" && questId.length > 0 && typeof value === "boolean") {
      normalized[questId] = value;
    }
  }

  return normalized;
}

const questAchievementProvider = createLocalStorageProvider<QuestAchievementProgress>({
  key: QUEST_ACHIEVEMENT_STORAGE_KEY,
  getDefaultValue: () => ({}),
  sanitize: sanitizeQuestAchievementProgress
});

export function readQuestAchievementProgress(storage?: Storage): QuestAchievementProgress {
  return questAchievementProvider.read(storage);
}

export function setQuestAchievementClaimed(
  questId: string,
  claimed: boolean,
  storage?: Storage
): QuestAchievementProgress {
  if (!questId) {
    return readQuestAchievementProgress(storage);
  }

  return questAchievementProvider.update((current) => {
    const next = { ...current };

    if (claimed) {
      next[questId] = true;
    } else {
      delete next[questId];
    }

    return next;
  }, storage);
}

export function claimQuestAchievement(questId: string, storage?: Storage): QuestAchievementProgress {
  return setQuestAchievementClaimed(questId, true, storage);
}

export function isQuestAchievementClaimed(questId: string, progress: QuestAchievementProgress): boolean {
  return progress[questId] === true;
}
