export type CardType = "video" | "carousel" | "quiz" | "match" | "mini_game" | "recap" | "story";

export interface CardInteraction {
  prompt?: string;
  options?: string[];
  correctAnswer?: string;
}

export interface CardReward {
  xp: number;
}

export interface CardTracking {
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  level?: "a1" | "a2" | "b1" | "b2" | "c1";
  category?: "grammar" | "vocabulary" | "speaking" | "listening" | "reading";
  ruleTags?: string[];
  moduleId?: string;
}

export interface Card {
  id: string;
  type: CardType;
  title: string;
  description: string;
  payload?: {
    mediaUrl?: string;
    slides?: string[];
    text?: string[];
    focusMode?: "list" | "rule_examples";
    ruleSlidesCount?: number;
  };
  interaction?: CardInteraction;
  reward?: CardReward;
  tracking?: CardTracking;
}
