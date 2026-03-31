import type { LanguageMapChatRequest } from "~/features/language-map/model/chat";
import { env } from "~/shared/config/env";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

function buildSystemInstruction(language: LanguageMapChatRequest["language"]): string {
  if (language === "es") {
    return [
      "You are an English tutor helping with a language graph node.",
      "Answer in clear Spanish unless the student asks for English output.",
      "Keep responses practical, structured, and concise.",
      "Use examples and short drills when useful."
    ].join(" ");
  }

  return [
    "You are an English tutor helping with a language graph node.",
    "Answer in clear English.",
    "Keep responses practical, structured, and concise.",
    "Use examples and short drills when useful."
  ].join(" ");
}

function buildNodeContextLines(input: LanguageMapChatRequest): string[] {
  const irregularLines = input.node.irregularSamples?.map(
    (sample) => `${sample.base} -> ${sample.past} -> ${sample.participle}`
  );

  return [
    `Node id: ${input.node.id}`,
    `Node title: ${input.node.label}`,
    `Node category: ${input.node.category}`,
    `Node summary: ${input.node.summary}`,
    `Node details: ${input.node.details}`,
    input.node.formula ? `Node formula: ${input.node.formula}` : "",
    `Key verbs: ${(input.node.keyVerbs ?? []).join(", ")}`,
    irregularLines && irregularLines.length > 0 ? `Irregular samples: ${irregularLines.join("; ")}` : "",
    `Mode: ${input.mode}`
  ].filter((line) => line.length > 0);
}

function buildUserPrompt(input: LanguageMapChatRequest): string {
  const historyLines = input.history
    .slice(-10)
    .map((item, index) => `${index + 1}. ${item.role.toUpperCase()}: ${item.text}`);

  return [
    "Use this language-map node context and dialogue to answer the latest student message.",
    ...buildNodeContextLines(input),
    "",
    "Recent dialogue:",
    ...(historyLines.length > 0 ? historyLines : ["No previous messages."]),
    "",
    `Latest student message: ${input.message}`
  ].join("\n");
}

function extractGeminiText(payload: GeminiResponse): string {
  const parts = payload.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim();

  return text;
}

export async function generateLanguageMapGeminiReply(input: LanguageMapChatRequest): Promise<string> {
	const apiKey = env.geminiApiKey;
	if (!apiKey) {
		throw new Error("GEMINI_API_KEY is not configured");
	}

	const apiBaseUrl = env.geminiApiBaseUrl;
	const model = env.geminiModel;
  const endpoint = `${apiBaseUrl.replace(/\/+$/, "")}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: buildSystemInstruction(input.language) }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: buildUserPrompt(input) }]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
        maxOutputTokens: 700
      }
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${details}`);
  }

  const payload = (await response.json()) as GeminiResponse;
  const answer = extractGeminiText(payload);

  if (answer.length === 0) {
    throw new Error("Gemini returned an empty response");
  }

  return answer;
}
