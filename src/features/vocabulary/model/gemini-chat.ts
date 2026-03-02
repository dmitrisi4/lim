import type { VocabularyChatRequest } from "~/features/vocabulary/model/chat";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

function buildSystemInstruction(language: VocabularyChatRequest["language"]): string {
  if (language === "es") {
    return [
      "You are a language tutor helping a student while reviewing flashcards.",
      "Answer in clear Spanish. Keep it concise and practical.",
      "Use examples when useful and explain mistakes politely.",
      "Stay focused on the current card topic."
    ].join(" ");
  }

  return [
    "You are a language tutor helping a student while reviewing flashcards.",
    "Answer in clear English. Keep it concise and practical.",
    "Use examples when useful and explain mistakes politely.",
    "Stay focused on the current card topic."
  ].join(" ");
}

function buildUserPrompt(input: VocabularyChatRequest): string {
  const contextLines = [
    `Card term: ${input.word.term}`,
    `Card translation: ${input.word.translation}`,
    `Card type: ${input.word.type}`,
    `Card sections: ${(input.word.sections ?? []).join(", ")}`,
    input.word.note ? `Card note: ${input.word.note}` : "",
    input.word.example ? `Card example: ${input.word.example}` : "",
    `Mode: ${input.mode}`
  ].filter((line) => line.length > 0);

  const historyLines = input.history
    .slice(-10)
    .map((item, index) => `${index + 1}. ${item.role.toUpperCase()}: ${item.text}`);

  return [
    "Use this card context and dialogue to answer the latest student message.",
    ...contextLines,
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

export async function generateVocabularyGeminiReply(input: VocabularyChatRequest): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const apiBaseUrl = process.env.GEMINI_API_BASE_URL ?? "https://generativelanguage.googleapis.com/v1beta";
  const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
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
        temperature: 0.45,
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
