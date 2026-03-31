import { describe, expect, it } from "vitest";
import {
  COMPLETED_CARD_PROGRESS_STORAGE_KEY,
  countCompletedCards,
  markCardCompleted,
  markCardUncompleted,
  readCompletedCardProgress
} from "~/entities/card/model/completed-progress";

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

describe("completed-card progress", () => {
  it("reads only valid boolean entries", () => {
    const storage = createStorageMock({
      [COMPLETED_CARD_PROGRESS_STORAGE_KEY]: JSON.stringify({
        "card-1": true,
        "card-2": false,
        "card-3": "yes",
        "": true
      })
    });

    expect(readCompletedCardProgress(storage)).toEqual({
      "card-1": true,
      "card-2": false
    });
  });

  it("marks and unmarks card completion", () => {
    const storage = createStorageMock();

    let next = markCardCompleted("card-1", storage);
    expect(next["card-1"]).toBe(true);

    next = markCardUncompleted("card-1", storage);
    expect(next["card-1"]).toBeUndefined();
  });

  it("counts completed cards against a related card set", () => {
    const progress = {
      "card-1": true,
      "card-2": true,
      "card-3": false
    };

    expect(countCompletedCards(["card-1", "card-2", "card-3", "card-4"], progress)).toEqual({
      total: 4,
      completed: 2
    });
  });
});
