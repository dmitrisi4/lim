import { describe, expect, it } from "vitest";
import {
  LANGUAGE_MAP_PROGRESS_STORAGE_KEY,
  cycleLanguageMapNodeStatus,
  getLanguageMapNodeStatus,
  readLanguageMapProgress,
  setLanguageMapNodeStatus
} from "~/features/language-map/model/progress";

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

describe("language-map progress", () => {
  it("reads valid statuses and ignores invalid values", () => {
    const storage = createStorageMock({
      [LANGUAGE_MAP_PROGRESS_STORAGE_KEY]: JSON.stringify({
        "node-1": "learning",
        "node-2": "learned",
        "node-3": "done",
        "": "new"
      })
    });

    expect(readLanguageMapProgress(storage)).toEqual({
      "node-1": "learning",
      "node-2": "learned"
    });
  });

  it("stores the selected status and returns default when absent", () => {
    const storage = createStorageMock();

    const next = setLanguageMapNodeStatus("present-simple", "learned", storage);

    expect(next["present-simple"]).toBe("learned");
    expect(getLanguageMapNodeStatus("present-simple", next)).toBe("learned");
    expect(getLanguageMapNodeStatus("future-perfect", next)).toBe("new");
  });

  it("cycles through new, learning, learned", () => {
    const storage = createStorageMock();

    let next = cycleLanguageMapNodeStatus("present-simple", storage);
    expect(next["present-simple"]).toBe("learning");

    next = cycleLanguageMapNodeStatus("present-simple", storage);
    expect(next["present-simple"]).toBe("learned");

    next = cycleLanguageMapNodeStatus("present-simple", storage);
    expect(next["present-simple"]).toBe("new");
  });
});
