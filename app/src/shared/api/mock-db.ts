import type { Card } from "~/entities/card/model/types";
import type { Streak } from "~/entities/streak/model/types";
import type { UserProgress } from "~/entities/user-progress/model/types";
import { buildLearnerProfileSnapshot } from "~/entities/user-progress/model/learner-profile";
import { calcRewardPreview } from "~/features/gamification/model/calc-reward-preview";
import type {
  InteractionSubmissionInput,
  InteractionSubmitResult,
  ProgressSnapshot
} from "~/features/interactions/model/types";
import type { LearningLanguage } from "~/shared/i18n/ui";
import { getUiCopy, resolveLearningLanguage } from "~/shared/i18n/ui";
import type { FeedFilters } from "~/shared/lib/feed-filters";
import { normalizeFeedFilters } from "~/shared/lib/feed-filters";
import { isoDate } from "~/shared/lib/date";
import { getSlideModulesForLanguage } from "~/slides/core/language-registry";
import type { EnglishLevel, SlideCategory, SlideLearnerProfile } from "~/slides/core/types";
import { buildAllSlideCards, selectSlideCards } from "~/slides/engine/select-slides";

export const DEMO_USER_ID = "demo-user";

interface RecentActivity {
  id: string;
  cardId: string;
  title: string;
  xpDelta: number;
  correct: boolean | null;
  category?: SlideCategory;
  level?: EnglishLevel;
  at: string;
}

interface ScoreStats {
  attempts: number;
  correct: number;
}

interface LanguagePerformance {
  categories: Partial<Record<SlideCategory, ScoreStats>>;
  levels: Partial<Record<EnglishLevel, ScoreStats>>;
}

interface UserState {
  progress: UserProgress;
  streak: Streak;
  recent: RecentActivity[];
  performanceByLanguage: Partial<Record<LearningLanguage, LanguagePerformance>>;
  isTestPassed: boolean;
}

interface FeedSlice {
  cards: Card[];
  nextCursor: number;
  hasMore: boolean;
  startIndex: number;
  totalAvailable: number;
}

export interface LevelOverviewItem {
  level: EnglishLevel;
  moduleCount: number;
  cardCount: number;
  attempts: number;
  quality: number | null;
}

export interface CategoryOverviewItem {
  category: SlideCategory;
  moduleCount: number;
  cardCount: number;
  attempts: number;
  quality: number | null;
}

export interface LearningOverviewSnapshot {
  levels: LevelOverviewItem[];
  categories: CategoryOverviewItem[];
}

const LEVEL_ORDER: EnglishLevel[] = ["a1", "a2", "b1", "b2", "c1"];
const CATEGORY_ORDER: SlideCategory[] = ["grammar", "vocabulary", "speaking", "listening", "reading"];

const SLIDE_MODULES_BY_LANGUAGE: Record<LearningLanguage, ReturnType<typeof getSlideModulesForLanguage>> = {
  en: getSlideModulesForLanguage("en"),
  es: getSlideModulesForLanguage("es")
};

const ALL_SLIDE_CARDS_BY_LANGUAGE: Record<LearningLanguage, Card[]> = {
  en: buildAllSlideCards(SLIDE_MODULES_BY_LANGUAGE.en),
  es: buildAllSlideCards(SLIDE_MODULES_BY_LANGUAGE.es)
};

const userStateStore = new Map<string, UserState>();

function yesterdayIso(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return isoDate(date);
}

function createInitialUserState(userId: string): UserState {
  return {
    progress: {
      userId,
      xp: 128,
      level: 2,
      dailyGoal: 120,
      dailyCompleted: 38,
      completedCards: 14
    },
    streak: {
      days: 4,
      lastActiveDate: yesterdayIso()
    },
    recent: [],
    performanceByLanguage: {},
    isTestPassed: false
  };
}

function ensureUserState(userId: string): UserState {
  const current = userStateStore.get(userId);
  if (current) {
    return current;
  }

  const created = createInitialUserState(userId);
  userStateStore.set(userId, created);
  return created;
}

function updateStreak(streak: Streak): number {
  const today = isoDate();

  if (streak.lastActiveDate === today) {
    return 0;
  }

  const previous = streak.days;
  const yesterday = yesterdayIso();

  streak.days = streak.lastActiveDate === yesterday ? streak.days + 1 : 1;
  streak.lastActiveDate = today;

  return streak.days - previous;
}

function toProgressSnapshot(state: UserState): ProgressSnapshot {
  return {
    xp: state.progress.xp,
    level: state.progress.level,
    dailyGoal: state.progress.dailyGoal,
    dailyCompleted: state.progress.dailyCompleted,
    streakDays: state.streak.days
  };
}

function ensureLanguagePerformance(state: UserState, language: LearningLanguage): LanguagePerformance {
  const existing = state.performanceByLanguage[language];
  if (existing) {
    return existing;
  }

  const created: LanguagePerformance = {
    categories: {},
    levels: {}
  };
  state.performanceByLanguage[language] = created;
  return created;
}

function updateScoreEntry<T extends string>(map: Partial<Record<T, ScoreStats>>, key: T, correct: boolean): void {
  const current = map[key] ?? { attempts: 0, correct: 0 };
  current.attempts += 1;
  if (correct) {
    current.correct += 1;
  }
  map[key] = current;
}

function toQualityPercent(entry?: ScoreStats): number | null {
  if (!entry || entry.attempts <= 0) {
    return null;
  }

  return Math.round((entry.correct / entry.attempts) * 100);
}

function buildLearnerProfile(
  state: UserState,
  filters: FeedFilters,
  language: LearningLanguage
): SlideLearnerProfile {
  const isEvenStep = state.progress.completedCards % 2 === 0;
  const hasCategoryFilters = filters.categories.length > 0;
  const isSpanish = language === "es";

  return {
    targetLevels: filters.levels,
    targetCategories: hasCategoryFilters ? filters.categories : undefined,
    preferredCategories: hasCategoryFilters
      ? filters.categories
      : isEvenStep
        ? ["grammar", "vocabulary", "listening", "reading"]
        : ["grammar", "vocabulary", "speaking", "reading"],
    focusRules: isSpanish
      ? isEvenStep
        ? [
            "ser_estar",
            "tener",
            "llamarse",
            "presente",
            "verbos_regulares",
            "querer",
            "poder",
            "articulos",
            "genero",
            "numero",
            "ir_a_infinitivo",
            "familia",
            "comida",
            "numeros",
            "0_100",
            "colores",
            "dias_semana",
            "tiempo",
            "lectura_basica",
            "presentaciones",
            "viajes",
            "csv_flashcards"
          ]
        : [
            "ser_estar",
            "presente",
            "irregular_verbs",
            "futuro_cercano",
            "vocabulario_basico",
            "familia",
            "comida",
            "numeros",
            "tiempo",
            "small_talk",
            "presentaciones",
            "listening",
            "reading_signs",
            "csv_flashcards"
          ]
      : isEvenStep
        ? [
            "present_simple",
            "to_be",
            "articles",
            "travel",
            "daily_routine",
            "numbers",
            "classroom",
            "flashcards_en_rules",
            "flashcards_en_words"
          ]
        : [
            "present_simple",
            "articles",
            "small_talk",
            "introductions",
            "daily_routine",
            "reading_signs",
            "flashcards_en_rules",
            "flashcards_en_words"
          ]
  };
}

function getLanguageModules(language: LearningLanguage) {
  return SLIDE_MODULES_BY_LANGUAGE[language] ?? SLIDE_MODULES_BY_LANGUAGE.en;
}

function getLanguageCards(language: LearningLanguage) {
  return ALL_SLIDE_CARDS_BY_LANGUAGE[language] ?? ALL_SLIDE_CARDS_BY_LANGUAGE.en;
}

function resolveCardForSubmission(cardId: string, languageCode: InteractionSubmissionInput["language"]): Card | null {
  const language = resolveLearningLanguage(languageCode);
  const existing = getLanguageCards(language).find((item) => item.id === cardId);

  if (existing) {
    return existing;
  }

  if (cardId.startsWith("recap-")) {
    const ui = getUiCopy(resolveLearningLanguage(languageCode));
    return {
      id: cardId,
      type: "recap",
      title: ui.recapTitle,
      description: ui.recapDescriptionPrefix,
      reward: { xp: 6 },
      tracking: {
        topic: "recap",
        difficulty: "easy",
        category: "reading",
        level: "a1",
        moduleId: "system.recap"
      }
    };
  }

  return null;
}

export function getMockFeedSlice(
  cursor: number,
  limit: number,
  userId = DEMO_USER_ID,
  filters?: FeedFilters,
  languageCode: LearningLanguage = "en"
): FeedSlice {
  const state = ensureUserState(userId);
  const language = resolveLearningLanguage(languageCode);
  const normalizedFilters = normalizeFeedFilters({
    levels: filters?.levels,
    categories: filters?.categories,
    answers: filters?.answers
  });
  const modules = getLanguageModules(language);
  const selection = selectSlideCards({
    modules,
    cursor,
    limit,
    profile: buildLearnerProfile(state, normalizedFilters, language)
  });

  return {
    cards: selection.cards,
    nextCursor: selection.nextCursor,
    hasMore: selection.hasMore,
    startIndex: selection.startIndex,
    totalAvailable: selection.totalAvailable
  };
}

export function getMockProgressSnapshot(userId: string): { progress: UserProgress; streak: Streak } {
  const state = ensureUserState(userId);

  return {
    progress: { ...state.progress },
    streak: { ...state.streak }
  };
}

export function getMockProfileSnapshot(userId: string, languageCode: LearningLanguage = "en"): {
  progress: UserProgress;
  streak: Streak;
  recent: RecentActivity[];
  overview: LearningOverviewSnapshot;
  learnedLevels: LevelOverviewItem[];
  learnedCategories: CategoryOverviewItem[];
  learnerProfile: ReturnType<typeof buildLearnerProfileSnapshot>;
} {
  const state = ensureUserState(userId);
  const overview = getMockLearningOverview(userId, languageCode);

  return {
    progress: { ...state.progress },
    streak: { ...state.streak },
    recent: [...state.recent],
    overview,
    learnedLevels: overview.levels.filter((item) => item.attempts > 0 || item.quality !== null),
    learnedCategories: overview.categories.filter((item) => item.attempts > 0 || item.quality !== null),
    learnerProfile: buildLearnerProfileSnapshot(overview)
  };
}

export function getMockLearningOverview(
  userId = DEMO_USER_ID,
  languageCode: LearningLanguage = "en"
): LearningOverviewSnapshot {
  const state = ensureUserState(userId);
  const language = resolveLearningLanguage(languageCode);
  const modules = getLanguageModules(language);
  const performance = ensureLanguagePerformance(state, language);

  const moduleCountByLevel: Record<EnglishLevel, number> = {
    a1: 0,
    a2: 0,
    b1: 0,
    b2: 0,
    c1: 0
  };
  const cardCountByLevel: Record<EnglishLevel, number> = {
    a1: 0,
    a2: 0,
    b1: 0,
    b2: 0,
    c1: 0
  };
  const moduleCountByCategory: Record<SlideCategory, number> = {
    grammar: 0,
    vocabulary: 0,
    speaking: 0,
    listening: 0,
    reading: 0
  };
  const cardCountByCategory: Record<SlideCategory, number> = {
    grammar: 0,
    vocabulary: 0,
    speaking: 0,
    listening: 0,
    reading: 0
  };

  for (const module of modules) {
    moduleCountByLevel[module.meta.level] += 1;
    cardCountByLevel[module.meta.level] += module.cards.length;
    moduleCountByCategory[module.meta.category] += 1;
    cardCountByCategory[module.meta.category] += module.cards.length;
  }

  const levels: LevelOverviewItem[] = LEVEL_ORDER.map((level) => {
    const stat = performance.levels[level];
    return {
      level,
      moduleCount: moduleCountByLevel[level],
      cardCount: cardCountByLevel[level],
      attempts: stat?.attempts ?? 0,
      quality: toQualityPercent(stat)
    };
  });

  const categories: CategoryOverviewItem[] = CATEGORY_ORDER.map((category) => {
    const stat = performance.categories[category];
    return {
      category,
      moduleCount: moduleCountByCategory[category],
      cardCount: cardCountByCategory[category],
      attempts: stat?.attempts ?? 0,
      quality: toQualityPercent(stat)
    };
  });

  return {
    levels,
    categories
  };
}

export function submitMockInteraction(input: InteractionSubmissionInput): InteractionSubmitResult {
  const state = ensureUserState(input.userId);
  const language = resolveLearningLanguage(input.language);
  const ui = getUiCopy(language);
  const card = resolveCardForSubmission(input.cardId, language);

  if (!card) {
    return {
      ok: false,
      cardId: input.cardId,
      message: ui.messageCardNotFound,
      xpDelta: 0,
      streakDelta: 0,
      correct: null,
      progress: toProgressSnapshot(state)
    };
  }

  const rewardPreview = calcRewardPreview(card, input.answer);
  const streakDelta = updateStreak(state.streak);
  const performance = ensureLanguagePerformance(state, language);
  const isScorable = rewardPreview.correct !== null;

  if (isScorable && card.tracking?.category) {
    updateScoreEntry(performance.categories, card.tracking.category, rewardPreview.correct === true);
  }
  if (isScorable && card.tracking?.level) {
    updateScoreEntry(performance.levels, card.tracking.level, rewardPreview.correct === true);
  }

  state.progress.xp += rewardPreview.xp;
  state.progress.completedCards += 1;
  state.progress.dailyCompleted = Math.min(state.progress.dailyGoal, state.progress.dailyCompleted + rewardPreview.xp);
  state.progress.level = Math.floor(state.progress.xp / 120) + 1;

  state.recent.unshift({
    id: `${card.id}-${Date.now()}`,
    cardId: card.id,
    title: card.title,
    xpDelta: rewardPreview.xp,
    correct: rewardPreview.correct,
    category: card.tracking?.category,
    level: card.tracking?.level,
    at: new Date().toISOString()
  });

  if (state.recent.length > 10) {
    state.recent.length = 10;
  }

  return {
    ok: true,
    cardId: card.id,
    message: rewardPreview.correct === false ? ui.messageAcceptedCouldBeBetter : ui.messageCardCompleted,
    xpDelta: rewardPreview.xp,
    streakDelta,
    correct: rewardPreview.correct,
    progress: toProgressSnapshot(state)
  };
}
