export type VocabularyWordType = "verb" | "other";
export type VocabularyProgressFilter = "all" | "learned" | "unlearned";

export type VocabularySection =
  | "base_verbs"
  | "daily_actions"
  | "movement_life"
  | "communication_thoughts"
  | "modals_constructions"
  | "additional_verbs"
  | "state_verbs"
  | "action_verbs"
  | "movement_verbs"
  | "communication_verbs"
  | "thinking_decision_verbs"
  | "modal_auxiliary_verbs"
  | "other_words";

export interface VocabularyWord {
  id: string;
  term: string;
  translation: string;
  type: VocabularyWordType;
  section?: VocabularySection;
  sections?: VocabularySection[];
  note?: string;
  example?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface VocabularyFilters {
  types: VocabularyWordType[];
  sections: VocabularySection[];
  progress: VocabularyProgressFilter;
}
