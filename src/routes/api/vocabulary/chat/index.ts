import type { RequestHandler } from "@builder.io/qwik-city";
import type { VocabularyChatRequest, VocabularyChatResponse } from "~/features/vocabulary/model/chat";
import { generateVocabularyGeminiReply } from "~/features/vocabulary/model/gemini-chat";
import type { LearningLanguage } from "~/shared/i18n/ui";

function isLearningLanguage(value: unknown): value is LearningLanguage {
  return value === "en" || value === "es";
}

function parseChatPayload(raw: unknown): VocabularyChatRequest | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const data = raw as Record<string, unknown>;
  if (!isLearningLanguage(data.language)) {
    return null;
  }

  if (data.mode !== "explain" && data.mode !== "follow_up") {
    return null;
  }

  if (typeof data.message !== "string" || data.message.trim().length === 0) {
    return null;
  }

  if (!data.word || typeof data.word !== "object") {
    return null;
  }

  const word = data.word as Record<string, unknown>;
  const rawSections = Array.isArray(word.sections) ? word.sections : typeof word.section === "string" ? [word.section] : [];
  const sections = rawSections.filter((item): item is string => typeof item === "string" && item.length > 0);
  if (
    typeof word.id !== "string" ||
    typeof word.term !== "string" ||
    typeof word.translation !== "string" ||
    (word.type !== "verb" && word.type !== "other") ||
    sections.length === 0
  ) {
    return null;
  }

  const rawHistory = Array.isArray(data.history) ? data.history : [];
  const history = rawHistory
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const message = item as Record<string, unknown>;
      if ((message.role !== "assistant" && message.role !== "user") || typeof message.text !== "string") {
        return null;
      }

      return {
        role: message.role as import("~/features/vocabulary/model/chat").VocabularyChatRole,
        text: message.text
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return {
    language: data.language,
    mode: data.mode,
    message: data.message,
    word: {
      id: word.id as string,
      term: word.term as string,
      translation: word.translation as string,
      type: word.type as "verb" | "other",
      sections: sections as import("~/features/vocabulary/model/word-bank").VocabularySection[],
      note: typeof word.note === "string" ? word.note : undefined,
      example: typeof word.example === "string" ? word.example : undefined
    },
    history
  };
}

export const onPost: RequestHandler = async ({ json, request }) => {
  const body = await request.json().catch(() => null);
  const payload = parseChatPayload(body);

  if (!payload) {
    const response: VocabularyChatResponse = {
      ok: false,
      provider: "gemini",
      error: "Invalid request payload"
    };
    json(400, response);
    return;
  }

  try {
    const answer = await generateVocabularyGeminiReply(payload);
    const response: VocabularyChatResponse = {
      ok: true,
      provider: "gemini",
      answer
    };
    json(200, response);
  } catch (error) {
    const response: VocabularyChatResponse = {
      ok: false,
      provider: "gemini",
      error: error instanceof Error ? error.message : "Unexpected Gemini error"
    };
    json(502, response);
  }
};
