import { describe, expect, it } from "vitest";
import {
  QUEST_ACHIEVEMENT_STORAGE_KEY,
  claimQuestAchievement,
  readQuestAchievementProgress,
  setQuestAchievementClaimed
} from "~/features/gamification/model/quest-achievements";

function createStorageMock(initial: Record<string, string> = {}): Storage {
  const state = new Map(Object.entries(initial));

  return {
    get length() {
      return state.size;
    },
    clear() {
      state.clear();
    },
    getItem(key: string) {
      return state.get(key) ?? null;
    },
    key(index: number) {
      return [...state.keys()][index] ?? null;
    },
    removeItem(key: string) {
      state.delete(key);
    },
    setItem(key: string, value: string) {
      state.set(key, value);
    }
  };
}

describe("quest achievements progress", () => {
  it("reads only valid boolean values from storage", () => {
    const storage = createStorageMock({
      [QUEST_ACHIEVEMENT_STORAGE_KEY]: JSON.stringify({
        "quest-1": true,
        "quest-2": false,
        "quest-3": "yes",
        "": true
      })
    });

    expect(readQuestAchievementProgress(storage)).toEqual({
      "quest-1": true,
      "quest-2": false
    });
  });

  it("claims and unclaims quest achievements", () => {
    const storage = createStorageMock();

    let next = claimQuestAchievement("ashen-initiation", storage);
    expect(next["ashen-initiation"]).toBe(true);

    next = setQuestAchievementClaimed("ashen-initiation", false, storage);
    expect(next["ashen-initiation"]).toBeUndefined();
  });
});
