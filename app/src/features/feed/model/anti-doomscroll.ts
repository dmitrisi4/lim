import type { Card } from "~/entities/card/model/types";
import type { LearningLanguage } from "~/shared/i18n/ui";
import { getUiCopy } from "~/shared/i18n/ui";

const MAX_SAME_TYPE_STREAK = 2;
const RECAP_INTERVAL = 4;

function rebalanceConsecutiveTypes(cards: Card[]): Card[] {
  const result = [...cards];

  for (let i = MAX_SAME_TYPE_STREAK; i < result.length; i += 1) {
    const current = result[i];
    const prevOne = result[i - 1];
    const prevTwo = result[i - 2];

    if (current.type === prevOne.type && current.type === prevTwo.type) {
      const swapIndex = result.findIndex((card, idx) => idx > i && card.type !== current.type);
      if (swapIndex > i) {
        const nextDifferent = result[swapIndex];
        result[swapIndex] = current;
        result[i] = nextDifferent;
      }
    }
  }

  return result;
}

function buildRecapCard(slice: Card[], recapIndex: number, language: LearningLanguage): Card {
  const summary = slice.map((card) => card.title).join(" · ");
  const ui = getUiCopy(language);

  return {
    id: `recap-${recapIndex}-${slice[0]?.id ?? "chunk"}`,
    type: "recap",
    title: `${ui.recapTitle} #${recapIndex}`,
    description: `${ui.recapDescriptionPrefix}: ${summary}`,
    reward: {
      xp: 6
    },
    tracking: {
      topic: "recap",
      difficulty: "easy"
    }
  };
}

function insertRecaps(cards: Card[], language: LearningLanguage): Card[] {
  const output: Card[] = [];
  let nonRecapCount = 0;

  for (let i = 0; i < cards.length; i += 1) {
    output.push(cards[i]);
    nonRecapCount += 1;

    const atBoundary = nonRecapCount % RECAP_INTERVAL === 0;
    const hasMoreCards = i < cards.length - 1;

    if (atBoundary && hasMoreCards) {
      const start = i - (RECAP_INTERVAL - 1);
      const chunk = cards.slice(Math.max(0, start), i + 1);
      output.push(buildRecapCard(chunk, nonRecapCount / RECAP_INTERVAL, language));
    }
  }

  return output;
}

export function applyAntiDoomscrollRules(cards: Card[], language: LearningLanguage = "en"): Card[] {
  return insertRecaps(rebalanceConsecutiveTypes(cards), language);
}
