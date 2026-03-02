import type { Card } from "~/entities/card/model/types";

export interface RewardPreview {
  xp: number;
  correct: boolean | null;
}

function normalizeAnswer(answer: string): string {
  const [withoutHint] = answer.split("||");
  return withoutHint.trim().toLowerCase();
}

export function calcRewardPreview(card: Card, answer?: string): RewardPreview {
  const base = card.reward?.xp ?? 5;
  const expected = card.interaction?.correctAnswer;

  if (!expected) {
    return { xp: base, correct: null };
  }

  if (!answer) {
    return { xp: Math.max(5, Math.floor(base / 2)), correct: false };
  }

  const correct = normalizeAnswer(answer) === normalizeAnswer(expected);

  return {
    xp: correct ? base : Math.max(5, Math.floor(base / 2)),
    correct
  };
}
