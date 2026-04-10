import type { LearningLanguage } from "~/shared/i18n/ui";
import { EN_WORD_BANK } from "~/features/vocabulary/model/word-bank-en";
import type {
  VocabularyFilters,
  VocabularyProgressFilter,
  VocabularySection,
  VocabularyWord,
  VocabularyWordType
} from "~/features/vocabulary/model/types";

export type {
  VocabularyFilters,
  VocabularyProgressFilter,
  VocabularySection,
  VocabularyWord,
  VocabularyWordType
} from "~/features/vocabulary/model/types";

export const VOCABULARY_TYPE_OPTIONS: readonly VocabularyWordType[] = ["verb", "other"];
export const VOCABULARY_SECTION_OPTIONS: readonly VocabularySection[] = [
  "base_verbs",
  "daily_actions",
  "movement_life",
  "communication_thoughts",
  "modals_constructions",
  "additional_verbs",
  "state_verbs",
  "action_verbs",
  "movement_verbs",
  "communication_verbs",
  "thinking_decision_verbs",
  "modal_auxiliary_verbs",
  "other_words"
];
const VOCABULARY_SECTION_OPTIONS_EN: readonly VocabularySection[] = [
  "state_verbs",
  "action_verbs",
  "movement_verbs",
  "communication_verbs",
  "thinking_decision_verbs",
  "modal_auxiliary_verbs",
  "other_words"
];
const VOCABULARY_SECTION_OPTIONS_ES: readonly VocabularySection[] = [
  "base_verbs",
  "daily_actions",
  "movement_life",
  "communication_thoughts",
  "modals_constructions",
  "additional_verbs",
  "other_words"
];
export const VOCABULARY_PROGRESS_OPTIONS: readonly VocabularyProgressFilter[] = ["all", "learned", "unlearned"];

const VOCABULARY_IMAGE_BASE_PATH = "/images/vocabulary";

const SPANISH_WORD_BANK: VocabularyWord[] = [
  {
    id: "verb-ser",
    term: "ser",
    translation: "быть (постоянная характеристика)",
    type: "verb",
    section: "base_verbs",
    imageUrl: `${VOCABULARY_IMAGE_BASE_PATH}/ser.jpg`,
    imageAlt: ""
  },
  {
    id: "verb-estar", term: "estar", translation: "быть (состояние / местоположение)", type: "verb", section: "base_verbs", 
    imageUrl: `${VOCABULARY_IMAGE_BASE_PATH}/estar.jpg`,
    imageAlt: "",
  },
  { id: "verb-tener", term: "tener", translation: "иметь", type: "verb", section: "base_verbs", imageUrl: "", imageAlt: "" },
  { id: "verb-hacer", term: "hacer", translation: "делать", type: "verb", section: "base_verbs", imageUrl: "", imageAlt: "" },
  { id: "verb-ir", term: "ir", translation: "идти / ехать", type: "verb", section: "base_verbs", imageUrl: "", imageAlt: "" },
  { id: "verb-venir", term: "venir", translation: "приходить", type: "verb", section: "base_verbs", imageUrl: "", imageAlt: "" },
  { id: "verb-decir", term: "decir", translation: "говорить", type: "verb", section: "base_verbs", imageUrl: "", imageAlt: "" },
  { id: "verb-hablar", term: "hablar", translation: "разговаривать", type: "verb", section: "base_verbs", imageUrl: "", imageAlt: "" },
  { id: "verb-ver", term: "ver", translation: "видеть", type: "verb", section: "base_verbs", imageUrl: "", imageAlt: "" },
  { id: "verb-dar", term: "dar", translation: "давать", type: "verb", section: "base_verbs", imageUrl: "", imageAlt: "" },

  { id: "verb-comer", term: "comer", translation: "есть", type: "verb", section: "daily_actions", imageUrl: "", imageAlt: "" },
  { id: "verb-beber", term: "beber", translation: "пить", type: "verb", section: "daily_actions", imageUrl: "", imageAlt: "" },
  { id: "verb-vivir", term: "vivir", translation: "жить", type: "verb", section: "daily_actions", imageUrl: "", imageAlt: "" },
  { id: "verb-trabajar", term: "trabajar", translation: "работать", type: "verb", section: "daily_actions", imageUrl: "", imageAlt: "" },
  { id: "verb-estudiar", term: "estudiar", translation: "учиться", type: "verb", section: "daily_actions", imageUrl: "", imageAlt: "" },
  { id: "verb-dormir", term: "dormir", translation: "спать", type: "verb", section: "daily_actions", imageUrl: "", imageAlt: "" },
  { id: "verb-leer", term: "leer", translation: "читать", type: "verb", section: "daily_actions", imageUrl: "", imageAlt: "" },
  { id: "verb-escribir", term: "escribir", translation: "писать", type: "verb", section: "daily_actions", imageUrl: "", imageAlt: "" },
  { id: "verb-comprar", term: "comprar", translation: "покупать", type: "verb", section: "daily_actions", imageUrl: "", imageAlt: "" },
  { id: "verb-pagar", term: "pagar", translation: "платить", type: "verb", section: "daily_actions", imageUrl: "", imageAlt: "" },

  { id: "verb-salir", term: "salir", translation: "выходить", type: "verb", section: "movement_life", imageUrl: "", imageAlt: "" },
  { id: "verb-entrar", term: "entrar", translation: "входить", type: "verb", section: "movement_life", imageUrl: "", imageAlt: "" },
  { id: "verb-llevar", term: "llevar", translation: "носить / брать с собой", type: "verb", section: "movement_life", imageUrl: "", imageAlt: "" },
  { id: "verb-traer", term: "traer", translation: "приносить", type: "verb", section: "movement_life", imageUrl: "", imageAlt: "" },
  { id: "verb-empezar", term: "empezar", translation: "начинать", type: "verb", section: "movement_life", imageUrl: "", imageAlt: "" },
  { id: "verb-terminar", term: "terminar", translation: "заканчивать", type: "verb", section: "movement_life", imageUrl: "", imageAlt: "" },
  { id: "verb-abrir", term: "abrir", translation: "открывать", type: "verb", section: "movement_life", imageUrl: "", imageAlt: "" },
  { id: "verb-cerrar", term: "cerrar", translation: "закрывать", type: "verb", section: "movement_life", imageUrl: "", imageAlt: "" },
  { id: "verb-buscar", term: "buscar", translation: "искать", type: "verb", section: "movement_life", imageUrl: "", imageAlt: "" },
  { id: "verb-encontrar", term: "encontrar", translation: "находить", type: "verb", section: "movement_life", imageUrl: "", imageAlt: "" },

  { id: "verb-pensar", term: "pensar", translation: "думать", type: "verb", section: "communication_thoughts", imageUrl: "", imageAlt: "" },
  { id: "verb-creer", term: "creer", translation: "верить / считать", type: "verb", section: "communication_thoughts", imageUrl: "", imageAlt: "" },
  { id: "verb-saber", term: "saber", translation: "знать (информацию)", type: "verb", section: "communication_thoughts", imageUrl: "", imageAlt: "" },
  { id: "verb-conocer", term: "conocer", translation: "знать (человека / место)", type: "verb", section: "communication_thoughts", imageUrl: "", imageAlt: "" },
  { id: "verb-querer", term: "querer", translation: "хотеть / любить", type: "verb", section: "communication_thoughts", imageUrl: "", imageAlt: "" },
  { id: "verb-gustar", term: "gustar", translation: "нравиться", type: "verb", section: "communication_thoughts", imageUrl: "", imageAlt: "" },
  { id: "verb-necesitar", term: "necesitar", translation: "нуждаться", type: "verb", section: "communication_thoughts", imageUrl: "", imageAlt: "" },
  { id: "verb-sentir", term: "sentir", translation: "чувствовать", type: "verb", section: "communication_thoughts", imageUrl: "", imageAlt: "" },
  { id: "verb-preguntar", term: "preguntar", translation: "спрашивать", type: "verb", section: "communication_thoughts", imageUrl: "", imageAlt: "" },
  { id: "verb-responder", term: "responder", translation: "отвечать", type: "verb", section: "communication_thoughts", imageUrl: "", imageAlt: "" },

  { id: "verb-poder", term: "poder", translation: "мочь", type: "verb", section: "modals_constructions", imageUrl: "", imageAlt: "" },
  { id: "verb-deber", term: "deber", translation: "быть должным", type: "verb", section: "modals_constructions", imageUrl: "", imageAlt: "" },
  { id: "verb-tener-que", term: "tener que", translation: "должен (обязан)", type: "verb", section: "modals_constructions", imageUrl: "", imageAlt: "" },
  { id: "verb-preferir", term: "preferir", translation: "предпочитать", type: "verb", section: "modals_constructions", imageUrl: "", imageAlt: "" },
  { id: "verb-intentar", term: "intentar", translation: "пытаться", type: "verb", section: "modals_constructions", imageUrl: "", imageAlt: "" },
  { id: "verb-usar", term: "usar", translation: "использовать", type: "verb", section: "modals_constructions", imageUrl: "", imageAlt: "" },
  { id: "verb-llamar", term: "llamar", translation: "звонить / называть", type: "verb", section: "modals_constructions", imageUrl: "", imageAlt: "" },
  { id: "verb-esperar", term: "esperar", translation: "ждать / надеяться", type: "verb", section: "modals_constructions", imageUrl: "", imageAlt: "" },
  { id: "verb-poner", term: "poner", translation: "ставить / класть", type: "verb", section: "modals_constructions", imageUrl: "", imageAlt: "" },
  { id: "verb-quedar", term: "quedar", translation: "оставаться / договариваться", type: "verb", section: "modals_constructions", imageUrl: "", imageAlt: "" },

  { id: "verb-volver", term: "volver", translation: "возвращаться", type: "verb", section: "additional_verbs", imageUrl: "", imageAlt: "" },
  { id: "verb-dejar", term: "dejar", translation: "оставлять", type: "verb", section: "additional_verbs", imageUrl: "", imageAlt: "" },
  { id: "verb-mirar", term: "mirar", translation: "смотреть", type: "verb", section: "additional_verbs", imageUrl: "", imageAlt: "" },
  { id: "verb-oir", term: "oir", translation: "слышать", type: "verb", section: "additional_verbs", imageUrl: "", imageAlt: "" },
  { id: "verb-ayudar", term: "ayudar", translation: "помогать", type: "verb", section: "additional_verbs", imageUrl: "", imageAlt: "" },
  { id: "verb-cambiar", term: "cambiar", translation: "менять", type: "verb", section: "additional_verbs", imageUrl: "", imageAlt: "" },
  { id: "verb-pasar", term: "pasar", translation: "происходить / проводить время", type: "verb", section: "additional_verbs", imageUrl: "", imageAlt: "" },
  { id: "verb-recordar", term: "recordar", translation: "помнить", type: "verb", section: "additional_verbs", imageUrl: "", imageAlt: "" },

  {
    id: "word-casa",
    term: "casa",
    translation: "дом",
    type: "other",
    section: "other_words",
    imageUrl: `${VOCABULARY_IMAGE_BASE_PATH}/casa-example.svg`,
    imageAlt: "Casa example image"
  },
  { id: "word-familia", term: "familia", translation: "семья", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-amigo", term: "amigo", translation: "друг", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-libro", term: "libro", translation: "книга", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-comida", term: "comida", translation: "еда", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-agua", term: "agua", translation: "вода", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-cafe", term: "cafe", translation: "кофе", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-ciudad", term: "ciudad", translation: "город", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-tiempo", term: "tiempo", translation: "время / погода", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-dia", term: "dia", translation: "день", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-noche", term: "noche", translation: "ночь", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-dinero", term: "dinero", translation: "деньги", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-pregunta", term: "pregunta", translation: "вопрос", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-respuesta", term: "respuesta", translation: "ответ", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-grande", term: "grande", translation: "большой", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-pequeno", term: "pequeno", translation: "маленький", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-hoy", term: "hoy", translation: "сегодня", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-manana", term: "manana", translation: "завтра", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-ayer", term: "ayer", translation: "вчера", type: "other", section: "other_words", imageUrl: "", imageAlt: "" },
  { id: "word-feliz", term: "feliz", translation: "счастливый", type: "other", section: "other_words", imageUrl: "", imageAlt: "" }
];

const WORD_BANK_BY_LANGUAGE: Record<LearningLanguage, VocabularyWord[]> = {
  en: EN_WORD_BANK,
  es: SPANISH_WORD_BANK
};

interface VocabularyFilterInput {
  types?: string[];
  sections?: string[];
  progress?: string | null;
}

function unique<T extends string>(values: T[]): T[] {
  return [...new Set(values)];
}

function isVocabularyWordType(value: string): value is VocabularyWordType {
  return VOCABULARY_TYPE_OPTIONS.includes(value as VocabularyWordType);
}

function isVocabularySection(value: string): value is VocabularySection {
  return VOCABULARY_SECTION_OPTIONS.includes(value as VocabularySection);
}

function isVocabularyProgressFilter(value: string): value is VocabularyProgressFilter {
  return VOCABULARY_PROGRESS_OPTIONS.includes(value as VocabularyProgressFilter);
}

export function resolveWordSections(word: VocabularyWord): VocabularySection[] {
  if (Array.isArray(word.sections) && word.sections.length > 0) {
    return unique(word.sections.filter((section) => isVocabularySection(section)));
  }

  if (word.section && isVocabularySection(word.section)) {
    return [word.section];
  }

  return ["other_words"];
}

export function getPrimaryWordSection(word: VocabularyWord): VocabularySection {
  return resolveWordSections(word)[0] ?? "other_words";
}

export function getVocabularySectionOptions(language: LearningLanguage = "en"): readonly VocabularySection[] {
  return language === "es" ? VOCABULARY_SECTION_OPTIONS_ES : VOCABULARY_SECTION_OPTIONS_EN;
}

export function normalizeVocabularyFilters(input: VocabularyFilterInput): VocabularyFilters {
  const progress = isVocabularyProgressFilter(input.progress ?? "") ? (input.progress as VocabularyProgressFilter) : "all";

  return {
    types: unique((input.types ?? []).filter(isVocabularyWordType)),
    sections: unique((input.sections ?? []).filter(isVocabularySection)),
    progress
  };
}

export function parseVocabularyFiltersFromSearchParams(searchParams: URLSearchParams): VocabularyFilters {
  return normalizeVocabularyFilters({
    types: searchParams.getAll("type"),
    sections: searchParams.getAll("section"),
    progress: searchParams.get("progress")
  });
}

export function filterVocabularyWords(filters: VocabularyFilters, language: LearningLanguage = "en"): VocabularyWord[] {
  const languageWordBank = WORD_BANK_BY_LANGUAGE[language] ?? WORD_BANK_BY_LANGUAGE.en;

  return languageWordBank.filter((word) => {
    const typeMatches = filters.types.length === 0 || filters.types.includes(word.type);
    const wordSections = resolveWordSections(word);
    const sectionMatches = filters.sections.length === 0 || wordSections.some((section) => filters.sections.includes(section));
    return typeMatches && sectionMatches;
  });
}

export function getVocabularyWordBank(language: LearningLanguage = "en"): VocabularyWord[] {
  return WORD_BANK_BY_LANGUAGE[language] ?? WORD_BANK_BY_LANGUAGE.en;
}

export function buildVocabularyHref(filters: VocabularyFilters, language?: LearningLanguage): string {
  const params = new URLSearchParams();
  filters.types.forEach((type) => params.append("type", type));
  filters.sections.forEach((section) => params.append("section", section));
  if (filters.progress !== "all") {
    params.set("progress", filters.progress);
  }
  if (language) {
    params.set("lang", language);
  }

  const query = params.toString();
  return query ? `/vocabulary/?${query}` : "/vocabulary/";
}
