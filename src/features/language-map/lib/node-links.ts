import type { LanguageMapNode } from "~/features/language-map/model/graph";
import type { LearningLanguage, UiCopy } from "~/shared/i18n/ui";
import type { RelatedCardsLink } from "~/features/language-map/ui/types";

function buildFeedCardsHref(language: LearningLanguage, category: "grammar" | "vocabulary"): string {
	const params = new URLSearchParams();
	params.set("cursor", "0");
	params.append("level", "a1");
	params.append("category", category);
	params.set("lang", language);
	return `/feed?${params.toString()}`;
}

function buildVocabularyCardsHref(
	language: LearningLanguage,
	sections: string[] = [],
	progress?: "all" | "unlearned",
): string {
	const params = new URLSearchParams();
	params.append("type", "verb");
	sections.forEach((section) => params.append("section", section));
	if (progress === "unlearned") {
		params.set("progress", "unlearned");
	}
	params.set("lang", language);
	return `/vocabulary/?${params.toString()}`;
}

export function buildNodeRelatedCardLinks(
	node: LanguageMapNode,
	language: LearningLanguage,
	ui: UiCopy,
): RelatedCardsLink[] {
	const grammarHref = buildFeedCardsHref(language, "grammar");
	const vocabularyFeedHref = buildFeedCardsHref(language, "vocabulary");
	const verbDeckHref = buildVocabularyCardsHref(language);

	if (node.id === "irregular-verbs") {
		const irregularSections =
			language === "es" ? ["additional_verbs", "base_verbs"] : ["action_verbs", "movement_verbs", "communication_verbs"];
		return [
			{
				id: "cards-irregular",
				href: buildVocabularyCardsHref(language, irregularSections, "unlearned"),
				label: ui.mapRelatedCardsOpenIrregular,
				primary: true,
			},
			{
				id: "cards-vocabulary-feed",
				href: vocabularyFeedHref,
				label: ui.mapRelatedCardsOpenVocabulary,
			},
		];
	}

	if (node.id === "auxiliary-verbs") {
		const auxiliarySections = language === "es" ? ["modals_constructions"] : ["modal_auxiliary_verbs"];
		return [
			{
				id: "cards-auxiliary",
				href: buildVocabularyCardsHref(language, auxiliarySections, "unlearned"),
				label: ui.mapRelatedCardsOpenAuxiliary,
				primary: true,
			},
			{
				id: "cards-grammar-feed",
				href: grammarHref,
				label: ui.mapRelatedCardsOpenGrammar,
			},
		];
	}

	if (node.id === "core-verbs") {
		const coreSections =
			language === "es"
				? ["base_verbs", "communication_thoughts"]
				: ["action_verbs", "state_verbs", "communication_verbs", "thinking_decision_verbs"];
		return [
			{
				id: "cards-core-verbs",
				href: buildVocabularyCardsHref(language, coreSections),
				label: ui.mapRelatedCardsOpenVerbDeck,
				primary: true,
			},
			{
				id: "cards-vocabulary-feed",
				href: vocabularyFeedHref,
				label: ui.mapRelatedCardsOpenVocabulary,
			},
		];
	}

	if (node.category === "tense" || node.category === "timeline" || node.id === "language-core") {
		return [
			{
				id: "cards-grammar-feed",
				href: grammarHref,
				label: ui.mapRelatedCardsOpenGrammar,
				primary: true,
			},
			{
				id: "cards-verb-deck",
				href: verbDeckHref,
				label: ui.mapRelatedCardsOpenVerbDeck,
			},
		];
	}

	return [
		{
			id: "cards-vocabulary-feed",
			href: vocabularyFeedHref,
			label: ui.mapRelatedCardsOpenVocabulary,
			primary: true,
		},
		{
			id: "cards-grammar-feed",
			href: grammarHref,
			label: ui.mapRelatedCardsOpenGrammar,
		},
	];
}
