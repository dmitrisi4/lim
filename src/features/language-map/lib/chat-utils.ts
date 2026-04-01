import type { LanguageMapNode } from "~/features/language-map/model/graph";
import type { LanguageMapChatNodeContext } from "~/features/language-map/model/chat";

export function toChatNodeContext(node: LanguageMapNode): LanguageMapChatNodeContext {
	return {
		id: node.id,
		label: node.label,
		category: node.category,
		summary: node.summary,
		details: node.details,
		formula: node.formula,
		keyVerbs: node.keyVerbs,
		irregularSamples: node.irregularSamples,
	};
}

export function buildNodeOverviewPrompt(node: LanguageMapNode, language: "en" | "es"): string {
	return language === "es"
		? `Explora la seccion "${node.label}" del mapa y explicamela con pasos claros.`
		: `Walk me through the "${node.label}" node from the language map with clear steps.`;
}

export function buildSelectNodeMessage(language: "en" | "es"): string {
	return language === "es"
		? "Primero abre una seccion del grafo y pulsa Discuss in chat."
		: "Open a graph node first, then press Discuss in chat.";
}

export function buildProviderErrorMessage(language: "en" | "es"): string {
	return language === "es"
		? "No pude obtener respuesta del AI provider. Revisa la configuracion y vuelve a intentar."
		: "Could not get a response from the AI provider. Check configuration and try again.";
}
