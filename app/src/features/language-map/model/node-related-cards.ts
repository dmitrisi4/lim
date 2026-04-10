import type { LearningLanguage } from "~/shared/i18n/ui";
import { getSlideModulesForLanguage } from "~/slides/core/language-registry";
import { buildSlideCardId } from "~/slides/core/tracking";
import {
  getVocabularyWordBank,
  resolveWordSections,
  type VocabularySection,
  type VocabularyWord
} from "~/features/vocabulary/model/word-bank";

const NODE_RULE_TAGS: Record<string, string[]> = {
  "language-core": ["present_simple", "to_be", "auxiliaries", "modals", "past_simple", "future_simple", "negation"],
  "time-axis": ["present_simple", "past_simple", "future_simple"],
  "past-zone": ["past_simple"],
  "present-zone": ["present_simple", "to_be", "auxiliaries"],
  "future-zone": ["future_simple", "modals"],
  "present-simple": ["present_simple", "negation"],
  "present-continuous": ["to_be", "auxiliaries"],
  "present-perfect": ["auxiliaries", "past_simple"],
  "past-simple": ["past_simple"],
  "past-continuous": ["past_simple", "to_be"],
  "past-perfect": ["past_simple", "auxiliaries"],
  "future-simple": ["future_simple", "modals"],
  "core-verbs": ["present_simple", "to_be", "auxiliaries", "modals"],
  "auxiliary-verbs": ["auxiliaries", "to_be", "modals", "negation"],
  "irregular-verbs": ["past_simple"]
};

const NODE_VOCAB_SECTIONS_BY_LANGUAGE: Record<LearningLanguage, Record<string, VocabularySection[]>> = {
  en: {
    "language-core": ["state_verbs", "action_verbs", "modal_auxiliary_verbs"],
    "time-axis": ["action_verbs", "state_verbs", "modal_auxiliary_verbs"],
    "past-zone": ["action_verbs", "movement_verbs"],
    "present-zone": ["state_verbs", "action_verbs", "modal_auxiliary_verbs"],
    "future-zone": ["movement_verbs", "action_verbs", "modal_auxiliary_verbs"],
    "present-simple": ["state_verbs", "action_verbs"],
    "present-continuous": ["action_verbs", "movement_verbs", "modal_auxiliary_verbs"],
    "present-perfect": ["action_verbs", "movement_verbs", "modal_auxiliary_verbs"],
    "past-simple": ["action_verbs", "movement_verbs"],
    "past-continuous": ["action_verbs", "movement_verbs"],
    "past-perfect": ["action_verbs", "movement_verbs"],
    "future-simple": ["action_verbs", "movement_verbs", "modal_auxiliary_verbs"],
    "core-verbs": ["state_verbs", "action_verbs", "communication_verbs", "thinking_decision_verbs", "modal_auxiliary_verbs"],
    "auxiliary-verbs": ["modal_auxiliary_verbs"],
    "irregular-verbs": ["action_verbs", "movement_verbs", "communication_verbs"]
  },
  es: {
    // Spanish map node IDs
    "nucleo-idioma":          ["base_verbs", "daily_actions", "modals_constructions"],
    "eje-temporal":           ["base_verbs", "daily_actions", "modals_constructions"],
    "zona-pasado":            ["daily_actions", "movement_life"],
    "zona-presente":          ["base_verbs", "daily_actions", "communication_thoughts"],
    "zona-futuro":            ["movement_life", "modals_constructions"],
    "presente-indicativo":    ["base_verbs", "daily_actions"],
    "presente-continuo":      ["daily_actions", "movement_life"],
    "preterito-perfecto":     ["daily_actions", "movement_life"],
    "preterito-indefinido":   ["daily_actions", "movement_life"],
    "preterito-imperfecto":   ["daily_actions", "movement_life"],
    "pluscuamperfecto":       ["daily_actions", "movement_life"],
    "futuro-simple":          ["movement_life", "modals_constructions"],
    "verbos-clave":           ["base_verbs", "communication_thoughts", "modals_constructions", "additional_verbs"],
    "ser-estar":              ["base_verbs", "modals_constructions"],
    "verbos-irregulares":     ["base_verbs", "additional_verbs", "movement_life"]
  }
};

const EN_IRREGULAR_TERM_HINTS = [
  "go",
  "see",
  "do",
  "have",
  "make",
  "take",
  "come",
  "know",
  "think",
  "understand",
  "get",
  "give",
  "leave",
  "run"
];

function normalizeTermTokens(term: string): string[] {
  return term
    .toLowerCase()
    .split(/[^a-z]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

function collectGrammarCardIds(nodeId: string, language: LearningLanguage): string[] {
  const ruleTags = NODE_RULE_TAGS[nodeId] ?? [];
  if (ruleTags.length === 0) {
    return [];
  }

  const modules = getSlideModulesForLanguage(language).filter((module) => module.meta.category === "grammar");

  return modules
    .filter((module) => module.meta.ruleTags.some((tag) => ruleTags.includes(tag)))
    .flatMap((module) => module.cards.map((card) => buildSlideCardId(module.meta.id, card.id)));
}

function isIrregularVocabularyWord(word: VocabularyWord, language: LearningLanguage): boolean {
  if (word.type !== "verb") {
    return false;
  }

  if (language !== "en") {
    const sections = resolveWordSections(word);
    return sections.includes("additional_verbs") || sections.includes("base_verbs");
  }

  const tokens = normalizeTermTokens(word.term);
  return EN_IRREGULAR_TERM_HINTS.some((hint) => tokens.includes(hint));
}

function collectVocabularyCardIds(nodeId: string, language: LearningLanguage): string[] {
  const sections = NODE_VOCAB_SECTIONS_BY_LANGUAGE[language][nodeId] ?? [];
  if (sections.length === 0) {
    return [];
  }

  const words = getVocabularyWordBank(language).filter((word) => {
    if (word.type !== "verb") {
      return false;
    }

    if (nodeId === "irregular-verbs") {
      return isIrregularVocabularyWord(word, language);
    }

    const wordSections = resolveWordSections(word);
    return wordSections.some((section) => sections.includes(section));
  });

  return words.map((word) => word.id);
}

export function getNodeRelatedCardIds(nodeId: string, language: LearningLanguage): string[] {
  const grammarCardIds = collectGrammarCardIds(nodeId, language);
  const vocabularyCardIds = collectVocabularyCardIds(nodeId, language);

  return [...new Set([...grammarCardIds, ...vocabularyCardIds])];
}
