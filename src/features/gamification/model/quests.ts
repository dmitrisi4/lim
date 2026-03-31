import type { CompletedCardProgress } from "~/entities/card/model/completed-progress";
import type { QuestAchievementProgress } from "~/features/gamification/model/quest-achievements";
import type { LearningLanguage } from "~/shared/i18n/ui";
import { getSlideModulesForLanguage } from "~/slides/core/language-registry";
import type { EnglishLevel, SlideCategory } from "~/slides/core/types";
import { buildAllSlideCards } from "~/slides/engine/select-slides";

const QUEST_LEVEL_ORDER: readonly EnglishLevel[] = ["a1", "a2", "b1", "b2", "c1"];
const QUEST_CATEGORY_ORDER: readonly SlideCategory[] = ["grammar", "vocabulary", "speaking", "listening", "reading"];
const SUPPORTED_LANGUAGES: readonly LearningLanguage[] = ["en", "es"];

type QuestLocalizedCopy = Record<LearningLanguage, string>;

export interface QuestRequirements {
  totalCompleted?: number;
  byLevel?: Partial<Record<EnglishLevel, number>>;
  byCategory?: Partial<Record<SlideCategory, number>>;
}

export interface QuestDefinition {
  id: string;
  title: QuestLocalizedCopy;
  description: QuestLocalizedCopy;
  reward: QuestLocalizedCopy;
  requirements: QuestRequirements;
}

interface CardProgressMeta {
  level?: EnglishLevel;
  category?: SlideCategory;
}

export interface QuestProgressSnapshot {
  totalCompleted: number;
  byLevel: Record<EnglishLevel, number>;
  byCategory: Record<SlideCategory, number>;
}

export type QuestRequirementKind = "total" | "level" | "category";

export interface QuestRequirementProgress {
  id: string;
  kind: QuestRequirementKind;
  current: number;
  target: number;
  done: boolean;
  level?: EnglishLevel;
  category?: SlideCategory;
}

export type QuestStatus = "locked" | "ready" | "claimed";

function createEmptyLevelCounts(): Record<EnglishLevel, number> {
  return {
    a1: 0,
    a2: 0,
    b1: 0,
    b2: 0,
    c1: 0
  };
}

function createEmptyCategoryCounts(): Record<SlideCategory, number> {
  return {
    grammar: 0,
    vocabulary: 0,
    speaking: 0,
    listening: 0,
    reading: 0
  };
}

function buildCardProgressMetaIndex(): ReadonlyMap<string, CardProgressMeta> {
  const index = new Map<string, CardProgressMeta>();

  for (const language of SUPPORTED_LANGUAGES) {
    const cards = buildAllSlideCards(getSlideModulesForLanguage(language));

    for (const card of cards) {
      if (!card.id) {
        continue;
      }

      index.set(card.id, {
        level: card.tracking?.level,
        category: card.tracking?.category
      });
    }
  }

  return index;
}

const CARD_PROGRESS_META_BY_ID = buildCardProgressMetaIndex();

function resolveCardProgressMeta(cardId: string): CardProgressMeta | null {
  if (cardId.startsWith("recap-")) {
    return {
      level: "a1",
      category: "reading"
    };
  }

  return CARD_PROGRESS_META_BY_ID.get(cardId) ?? null;
}

function normalizePositiveTarget(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  if (value <= 0) {
    return null;
  }

  return Math.floor(value);
}

export const QUEST_DEFINITIONS: readonly QuestDefinition[] = [
  {
    id: "ashen-initiation",
    title: {
      en: "Ashen Initiation",
      es: "Iniciacion de cenizas"
    },
    description: {
      en: "Pass your first trials to unlock the novice sigil.",
      es: "Supera tus primeras pruebas para desbloquear el sigilo de novato."
    },
    reward: {
      en: "Novice Ember Sigil",
      es: "Sigilo de brasa novato"
    },
    requirements: {
      totalCompleted: 3,
      byLevel: {
        a1: 2
      }
    }
  },
  {
    id: "scribe-of-rules",
    title: {
      en: "Scribe of Rules",
      es: "Escriba de reglas"
    },
    description: {
      en: "Train grammar cards until your form is stable.",
      es: "Entrena tarjetas de gramatica hasta estabilizar tu base."
    },
    reward: {
      en: "Grammar Seal",
      es: "Sello de gramatica"
    },
    requirements: {
      byCategory: {
        grammar: 4
      }
    }
  },
  {
    id: "word-hoarder",
    title: {
      en: "Word Hoarder",
      es: "Acumulador de palabras"
    },
    description: {
      en: "Build vocabulary depth through repeated tests.",
      es: "Construye vocabulario con pruebas repetidas."
    },
    reward: {
      en: "Lexicon Crest",
      es: "Emblema de lexico"
    },
    requirements: {
      byCategory: {
        vocabulary: 4
      }
    }
  },
  {
    id: "wanderer-of-trials",
    title: {
      en: "Wanderer of Trials",
      es: "Errante de pruebas"
    },
    description: {
      en: "Cover multiple domains instead of farming one type of card.",
      es: "Cubre varios dominios en vez de repetir un solo tipo de tarjeta."
    },
    reward: {
      en: "Balanced Mind Token",
      es: "Token de mente equilibrada"
    },
    requirements: {
      byCategory: {
        speaking: 2,
        listening: 2,
        reading: 2
      }
    }
  },
  {
    id: "iron-discipline",
    title: {
      en: "Iron Discipline",
      es: "Disciplina de hierro"
    },
    description: {
      en: "Sustain a longer grind and complete a full A1 cycle.",
      es: "Mantiene un ritmo largo y completa un ciclo A1."
    },
    reward: {
      en: "Veteran Crest",
      es: "Emblema veterano"
    },
    requirements: {
      totalCompleted: 12,
      byLevel: {
        a1: 8
      }
    }
  }
];

export function getQuestCopy(copy: QuestLocalizedCopy, language: LearningLanguage): string {
  return copy[language] ?? copy.en;
}

export function buildQuestProgressSnapshot(progress: CompletedCardProgress): QuestProgressSnapshot {
  const completedCardIds = [
    ...new Set(
      Object.entries(progress)
        .filter(([cardId, completed]) => cardId.length > 0 && completed === true)
        .map(([cardId]) => cardId)
    )
  ];

  const byLevel = createEmptyLevelCounts();
  const byCategory = createEmptyCategoryCounts();

  for (const cardId of completedCardIds) {
    const cardMeta = resolveCardProgressMeta(cardId);
    if (!cardMeta) {
      continue;
    }

    if (cardMeta.level) {
      byLevel[cardMeta.level] += 1;
    }

    if (cardMeta.category) {
      byCategory[cardMeta.category] += 1;
    }
  }

  return {
    totalCompleted: completedCardIds.length,
    byLevel,
    byCategory
  };
}

export function getQuestRequirementProgress(
  requirements: QuestRequirements,
  snapshot: QuestProgressSnapshot
): QuestRequirementProgress[] {
  const progressItems: QuestRequirementProgress[] = [];

  const totalTarget = normalizePositiveTarget(requirements.totalCompleted);
  if (totalTarget !== null) {
    progressItems.push({
      id: "total-completed",
      kind: "total",
      current: snapshot.totalCompleted,
      target: totalTarget,
      done: snapshot.totalCompleted >= totalTarget
    });
  }

  for (const level of QUEST_LEVEL_ORDER) {
    const target = normalizePositiveTarget(requirements.byLevel?.[level]);
    if (target === null) {
      continue;
    }

    const current = snapshot.byLevel[level];
    progressItems.push({
      id: `level-${level}`,
      kind: "level",
      level,
      current,
      target,
      done: current >= target
    });
  }

  for (const category of QUEST_CATEGORY_ORDER) {
    const target = normalizePositiveTarget(requirements.byCategory?.[category]);
    if (target === null) {
      continue;
    }

    const current = snapshot.byCategory[category];
    progressItems.push({
      id: `category-${category}`,
      kind: "category",
      category,
      current,
      target,
      done: current >= target
    });
  }

  return progressItems;
}

export function isQuestReady(requirements: QuestRequirements, snapshot: QuestProgressSnapshot): boolean {
  const requirementProgress = getQuestRequirementProgress(requirements, snapshot);
  return requirementProgress.length > 0 && requirementProgress.every((requirement) => requirement.done);
}

export function getQuestStatus(
  quest: QuestDefinition,
  snapshot: QuestProgressSnapshot,
  achievements: QuestAchievementProgress
): QuestStatus {
  if (achievements[quest.id] === true) {
    return "claimed";
  }

  return isQuestReady(quest.requirements, snapshot) ? "ready" : "locked";
}
