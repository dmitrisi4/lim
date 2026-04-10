import { describe, expect, it } from "vitest";
import type { Card } from "~/entities/card/model/types";
import { calcRewardPreview } from "~/features/gamification/model/calc-reward-preview";

describe("calcRewardPreview", () => {
  const quizCard: Card = {
    id: "quiz-1",
    type: "quiz",
    title: "Q",
    description: "D",
    interaction: {
      correctAnswer: "Регулярность"
    },
    reward: {
      xp: 20
    }
  };

  it("returns full reward for correct answer", () => {
    const result = calcRewardPreview(quizCard, "Регулярность");
    expect(result.correct).toBe(true);
    expect(result.xp).toBe(20);
  });

  it("returns reduced reward for wrong answer", () => {
    const result = calcRewardPreview(quizCard, "Интенсивность");
    expect(result.correct).toBe(false);
    expect(result.xp).toBe(10);
  });
});
