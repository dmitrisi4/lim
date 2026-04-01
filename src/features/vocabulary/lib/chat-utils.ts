import type { VocabularyWord } from "~/features/vocabulary/model/word-bank";

export function buildExplainPrompt(word: VocabularyWord, language: "en" | "es"): string {
	return language === "es"
		? `Explica la palabra "${word.term}" y como usarla mientras estudio tarjetas.`
		: `Explain the word "${word.term}" and how to use it while I study flashcards.`;
}

export function buildSelectCardMessage(language: "en" | "es"): string {
	return language === "es" ? "Primero abre una tarjeta y pulsa Explicar." : "Open a card and press Explain first.";
}

export function buildProviderErrorMessage(language: "en" | "es"): string {
	return language === "es"
		? "No pude obtener respuesta de Gemini. Revisa clave/API y vuelve a intentar."
		: "Could not get a Gemini response. Check key/API settings and try again.";
}
