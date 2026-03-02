import type { Card, CardType } from "~/entities/card/model/types";

const INTERACTIVE_TYPES: CardType[] = ["quiz", "match", "mini_game"];
const VALID_TYPES: CardType[] = ["video", "carousel", "quiz", "match", "mini_game", "recap"];

export function isCardType(value: string): value is CardType {
  return VALID_TYPES.includes(value as CardType);
}

export function isInteractiveCard(card: Card): boolean {
  return INTERACTIVE_TYPES.includes(card.type);
}

export function isRecapCard(card: Card): boolean {
  return card.type === "recap";
}
