import { describe, expect, it } from "vitest";
import {
  QUEST_DEFINITIONS,
  buildQuestProgressSnapshot,
  getQuestRequirementProgress,
  getQuestStatus,
  isQuestReady,
  type QuestProgressSnapshot
} from "~/features/gamification/model/quests";

function createSnapshot(input: Partial<QuestProgressSnapshot>): QuestProgressSnapshot {
  return {
    totalCompleted: input.totalCompleted ?? 0,
    byLevel: {
      a1: input.byLevel?.a1 ?? 0,
      a2: input.byLevel?.a2 ?? 0,
      b1: input.byLevel?.b1 ?? 0,
      b2: input.byLevel?.b2 ?? 0,
      c1: input.byLevel?.c1 ?? 0
    },
    byCategory: {
      grammar: input.byCategory?.grammar ?? 0,
      vocabulary: input.byCategory?.vocabulary ?? 0,
      speaking: input.byCategory?.speaking ?? 0,
      listening: input.byCategory?.listening ?? 0,
      reading: input.byCategory?.reading ?? 0
    }
  };
}

describe("quest progress snapshot", () => {
  it("counts completed cards, including recap fallbacks", () => {
    const snapshot = buildQuestProgressSnapshot({
      "grammar.present-simple::quiz-he-s": true,
      "vocabulary.daily-routine::routine-verbs": true,
      "recap-12345": true,
      "unknown-card": true,
      "grammar.present-simple::match-does": false
    });

    expect(snapshot.totalCompleted).toBe(4);
    expect(snapshot.byLevel.a1).toBe(3);
    expect(snapshot.byCategory.grammar).toBe(1);
    expect(snapshot.byCategory.vocabulary).toBe(1);
    expect(snapshot.byCategory.reading).toBe(1);
  });
});

describe("quest readiness and status", () => {
  it("returns granular requirement progress", () => {
    const snapshot = createSnapshot({
      totalCompleted: 9,
      byLevel: { a1: 7 } as any,
      byCategory: { grammar: 4 } as any
    });

    const progress = getQuestRequirementProgress(
      {
        totalCompleted: 8,
        byLevel: { a1: 6 },
        byCategory: { grammar: 5 }
      },
      snapshot
    );

    expect(progress).toEqual([
      {
        id: "total-completed",
        kind: "total",
        current: 9,
        target: 8,
        done: true
      },
      {
        id: "level-a1",
        kind: "level",
        level: "a1",
        current: 7,
        target: 6,
        done: true
      },
      {
        id: "category-grammar",
        kind: "category",
        category: "grammar",
        current: 4,
        target: 5,
        done: false
      }
    ]);
  });

  it("switches status from ready to claimed when achievement is saved", () => {
    const quest = QUEST_DEFINITIONS.find((entry) => entry.id === "ashen-initiation");
    if (!quest) {
      throw new Error("Quest definition ashen-initiation must exist");
    }

    const snapshot = createSnapshot({
      totalCompleted: 5,
      byLevel: { a1: 4 } as any
    });

    expect(isQuestReady(quest.requirements, snapshot)).toBe(true);
    expect(getQuestStatus(quest, snapshot, {})).toBe("ready");
    expect(getQuestStatus(quest, snapshot, { [quest.id]: true })).toBe("claimed");
  });
});
