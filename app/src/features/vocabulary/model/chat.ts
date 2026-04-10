import type { VocabularyWord } from "~/features/vocabulary/model/word-bank";
import type { LearningLanguage } from "~/shared/i18n/ui";

export type VocabularyChatRole = "assistant" | "user";

export type VocabularyChatMode = "explain" | "follow_up";

export interface VocabularyChatMessage {
  role: VocabularyChatRole;
  text: string;
}

export interface VocabularyChatRequest {
  language: LearningLanguage;
  mode: VocabularyChatMode;
  message: string;
  word: Pick<VocabularyWord, "id" | "term" | "translation" | "type" | "sections" | "note" | "example">;
  history: VocabularyChatMessage[];
}

export interface VocabularyChatResponse {
  ok: boolean;
  provider: "gemini";
  answer?: string;
  error?: string;
}
