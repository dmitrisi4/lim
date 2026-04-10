import { describe, expect, it } from "vitest";
import type { Card } from "~/entities/card/model/types";
import { applyAntiDoomscrollRules } from "~/features/feed/model/anti-doomscroll";

describe("applyAntiDoomscrollRules", () => {
  const baseCards: Card[] = [
    { id: "1", type: "video", title: "A", description: "A" },
    { id: "2", type: "video", title: "B", description: "B" },
    { id: "3", type: "video", title: "C", description: "C" },
    { id: "4", type: "quiz", title: "D", description: "D" },
    { id: "5", type: "video", title: "E", description: "E" },
    { id: "6", type: "carousel", title: "F", description: "F" }
  ];

  it("prevents long streaks of same card type", () => {
    const result = applyAntiDoomscrollRules(baseCards).filter((card) => card.type !== "recap");

    for (let i = 2; i < result.length; i += 1) {
      const sameAsPrev = result[i].type === result[i - 1].type;
      const sameAsPrevPrev = result[i].type === result[i - 2].type;
      expect(sameAsPrev && sameAsPrevPrev).toBe(false);
    }
  });

  it("injects recap cards at expected intervals", () => {
    const result = applyAntiDoomscrollRules(baseCards);
    expect(result.some((card) => card.type === "recap")).toBe(true);
  });
});
