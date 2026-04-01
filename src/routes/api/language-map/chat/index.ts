import type { RequestHandler } from "@builder.io/qwik-city";
import type { LanguageMapChatRequest, LanguageMapChatResponse } from "~/features/language-map/model/chat";
import { generateLanguageMapGeminiReply } from "~/features/language-map/model/gemini-chat";
import type { LanguageMapNodeCategory } from "~/features/language-map/model/graph";
import type { LearningLanguage } from "~/shared/i18n/ui";

function isLearningLanguage(value: unknown): value is LearningLanguage {
  return value === "en" || value === "es";
}

function isLanguageMapNodeCategory(value: unknown): value is LanguageMapNodeCategory {
  return value === "core" || value === "timeline" || value === "tense" || value === "verb_system" || value === "irregular";
}

function parseChatPayload(raw: unknown): LanguageMapChatRequest | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const data = raw as Record<string, unknown>;
  if (!isLearningLanguage(data.language)) {
    return null;
  }

  if (data.mode !== "node_overview" && data.mode !== "follow_up") {
    return null;
  }

  if (typeof data.message !== "string" || data.message.trim().length === 0) {
    return null;
  }

  if (!data.node || typeof data.node !== "object") {
    return null;
  }

  const node = data.node as Record<string, unknown>;
  if (
    typeof node.id !== "string" ||
    typeof node.label !== "string" ||
    typeof node.summary !== "string" ||
    typeof node.details !== "string" ||
    !isLanguageMapNodeCategory(node.category)
  ) {
    return null;
  }

  const keyVerbs = Array.isArray(node.keyVerbs)
    ? node.keyVerbs.filter((item): item is string => typeof item === "string" && item.length > 0)
    : [];

  if (keyVerbs.length === 0) {
    return null;
  }

  const irregularSamples = Array.isArray(node.irregularSamples)
    ? node.irregularSamples
        .map((sample) => {
          if (!sample || typeof sample !== "object") {
            return null;
          }

          const item = sample as Record<string, unknown>;
          if (
            typeof item.base !== "string" ||
            typeof item.past !== "string" ||
            typeof item.participle !== "string"
          ) {
            return null;
          }

          return {
            base: item.base,
            past: item.past,
            participle: item.participle
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
    : undefined;

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
        role: message.role as import("~/features/language-map/model/chat").LanguageMapChatRole,
        text: message.text
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return {
    language: data.language,
    mode: data.mode,
    message: data.message,
    node: {
      id: node.id,
      label: node.label,
      category: node.category,
      summary: node.summary,
      details: node.details,
      formula: typeof node.formula === "string" ? node.formula : undefined,
      keyVerbs,
      irregularSamples
    },
    history
  };
}

export const onPost: RequestHandler = async ({ json, request }) => {
  const body = await request.json().catch(() => null);
  const payload = parseChatPayload(body);

  if (!payload) {
    const response: LanguageMapChatResponse = {
      ok: false,
      provider: "gemini",
      error: "Invalid request payload"
    };
    json(400, response);
    return;
  }

  try {
    const answer = await generateLanguageMapGeminiReply(payload);
    const response: LanguageMapChatResponse = {
      ok: true,
      provider: "gemini",
      answer
    };
    json(200, response);
  } catch (error) {
    const response: LanguageMapChatResponse = {
      ok: false,
      provider: "gemini",
      error: error instanceof Error ? error.message : "Unexpected Gemini error"
    };
    json(502, response);
  }
};
