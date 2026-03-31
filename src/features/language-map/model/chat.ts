import type { LanguageMapNode } from "~/features/language-map/model/graph";
import type { LearningLanguage } from "~/shared/i18n/ui";

export type LanguageMapChatRole = "assistant" | "user";

export type LanguageMapChatMode = "node_overview" | "follow_up";

export interface LanguageMapChatMessage {
  role: LanguageMapChatRole;
  text: string;
}

export interface LanguageMapChatNodeContext
  extends Pick<LanguageMapNode, "id" | "label" | "category" | "summary" | "details" | "formula" | "keyVerbs" | "irregularSamples"> {}

export interface LanguageMapChatRequest {
  language: LearningLanguage;
  mode: LanguageMapChatMode;
  message: string;
  node: LanguageMapChatNodeContext;
  history: LanguageMapChatMessage[];
}

export interface LanguageMapChatResponse {
  ok: boolean;
  provider: "gemini";
  answer?: string;
  error?: string;
}
