export type LearningLanguage = "en" | "es";

export interface UiCopy {
  appName: string;
  appTagline: string;
  navHome: string;
  navFeed: string;
  navVocabulary: string;
  navMap: string;
  navQuests: string;
  navProfile: string;
  mobileMenuOpen: string;
  mobileMenuClose: string;
  mobileMenuLabel: string;
  languageControlTitle: string;
  languageControlShort: string;
  languageControlHint: string;
  homeTitle: string;
  homeSubtitle: string;
  homeOpenFeed: string;
  homeOpenVocabulary: string;
  homeOpenLanguageMap: string;
  homeOpenQuests: string;
  homeOpenProfile: string;
  homeActionPlacementTitle: string;
  homeActionPlacementBody: string;
  homeActionContinueTitle: string;
  homeActionContinueBody: string;
  homeActionQuestTitle: string;
  homeActionQuestBody: string;
  homeActionReviewTitle: string;
  homeActionReviewBody: string;
  homeOverviewTitle: string;
  homeOverviewSubtitle: string;
  homeOverviewLevels: string;
  homeOverviewCategories: string;
  homeOverviewModules: string;
  homeOverviewCards: string;
  homeOverviewQuality: string;
  homeOverviewNoQuality: string;
  homeMetaDescription: string;
  feedMetricLevel: string;
  feedMetricStreak: string;
  feedNewPack: string;
  feedFiltersPanel: string;
  feedLevels: string;
  feedCategories: string;
  feedAnswers: string;
  feedAnswerCorrect: string;
  feedAnswerIncorrect: string;
  feedAnswerUnanswered: string;
  feedNoCards: string;
  feedNoAnswerMatches: string;
  feedApplyFilters: string;
  feedResetFilters: string;
  vocabTitle: string;
  vocabSubtitle: string;
  vocabTotalLabel: string;
  vocabFiltersPanel: string;
  vocabTypes: string;
  vocabSections: string;
  vocabTypeVerb: string;
  vocabTypeOther: string;
  vocabSectionBaseVerbs: string;
  vocabSectionDailyActions: string;
  vocabSectionMovementLife: string;
  vocabSectionCommunicationThoughts: string;
  vocabSectionModalsConstructions: string;
  vocabSectionAdditionalVerbs: string;
  vocabSectionStateVerbs: string;
  vocabSectionActionVerbs: string;
  vocabSectionMovementVerbs: string;
  vocabSectionCommunicationVerbs: string;
  vocabSectionThinkingDecisionVerbs: string;
  vocabSectionModalAuxiliaryVerbs: string;
  vocabSectionOtherWords: string;
  vocabProgressTitle: string;
  vocabProgressAll: string;
  vocabProgressLearned: string;
  vocabProgressUnlearned: string;
  vocabPhotoPlaceholder: string;
  vocabPhotoHint: string;
  vocabExampleLabel: string;
  vocabMarkLearned: string;
  vocabLearned: string;
  vocabVerbFormsButton: string;
  vocabVerbExamplesButton: string;
  vocabVerbFormsTitle: string;
  vocabVerbTensePresentSimple: string;
  vocabVerbTensePastSimple: string;
  vocabVerbTenseFutureSimple: string;
  vocabVerbTensePresentContinuous: string;
  vocabVerbTensePastContinuous: string;
  vocabVerbTensePresentPerfect: string;
  vocabVerbTensePastPerfect: string;
  vocabVerbExamplesTitle: string;
  vocabVerbClose: string;
  vocabVerbPerson: string;
  vocabVerbForm: string;
  vocabVerbUsage: string;
  vocabNoCards: string;
  vocabApplyFilters: string;
  vocabResetFilters: string;
  vocabExplainButton: string;
  vocabAiTitle: string;
  vocabAiSubtitle: string;
  vocabAiEmptyState: string;
  vocabAiInputPlaceholder: string;
  vocabAiSend: string;
  vocabAiYou: string;
  vocabAiAssistant: string;
  vocabAiThinking: string;
  vocabAiCollapse: string;
  vocabAiExpand: string;
  mapTitle: string;
  mapSubtitle: string;
  mapProgressTitle: string;
  mapProgressLearnedSuffix: string;
  mapFilterUnlearnedOnly: string;
  mapLegendTitle: string;
  mapGraphAriaLabel: string;
  mapNoVisibleNodes: string;
  mapShowAllNodes: string;
  mapCategoryCore: string;
  mapCategoryTimeline: string;
  mapCategoryTense: string;
  mapCategoryVerbSystem: string;
  mapCategoryIrregular: string;
  mapFormulaTitle: string;
  mapKeyVerbsTitle: string;
  mapIrregularTableTitle: string;
  mapRelatedNodesTitle: string;
  mapRelatedCardsTitle: string;
  mapRelatedCardsOpenGrammar: string;
  mapRelatedCardsOpenVocabulary: string;
  mapRelatedCardsOpenVerbDeck: string;
  mapRelatedCardsOpenIrregular: string;
  mapRelatedCardsOpenAuxiliary: string;
  mapNodeCardsProgressTitle: string;
  mapNodeCardsProgressSuffix: string;
  mapNodeCardsProgressEmpty: string;
  mapStatusTitle: string;
  mapStatusNew: string;
  mapStatusLearning: string;
  mapStatusLearned: string;
  mapDiscussButton: string;
  mapChatTitle: string;
  mapChatSubtitle: string;
  mapChatContext: string;
  mapChatNoContext: string;
  mapChatEmptyState: string;
  mapChatInputPlaceholder: string;
  mapChatSend: string;
  mapChatYou: string;
  mapChatAssistant: string;
  mapChatThinking: string;
  categoryGrammar: string;
  categoryVocabulary: string;
  categorySpeaking: string;
  categoryListening: string;
  categoryReading: string;
  profileTitle: string;
  profileSubtitle: string;
  profileRecentActivity: string;
  profileLearnedMaterial: string;
  profileLevelOverview: string;
  profileCategoryOverview: string;
  profileEstimatedLevel: string;
  profileKnownTopics: string;
  profileWeakAreas: string;
  profileUnlockedQuests: string;
  profileEmptyActivity: string;
  profileEmptyLearned: string;
  profileDays: string;
  cardCheck: string;
  cardSubmitMatch: string;
  cardFinishMiniGame: string;
  cardMarkDone: string;
  cardMiniChallenge: string;
  cardShowRule: string;
  cardShowExamples: string;
  cardHintsShow: string;
  cardHintsHide: string;
  cardOpenDetails: string;
  cardCloseDetails: string;
  cardRecapNote: string;
  cardRewardPrefix: string;
  messageCardNotFound: string;
  messageAcceptedCouldBeBetter: string;
  messageCardCompleted: string;
  recapTitle: string;
  recapDescriptionPrefix: string;
}

export interface LearningLanguageOption {
  code: LearningLanguage;
  nativeName: string;
}

export const LEARNING_LANGUAGE_COOKIE = "lim_learning_lang";

export const LEARNING_LANGUAGE_OPTIONS: readonly LearningLanguageOption[] = [
  { code: "en", nativeName: "English" },
  { code: "es", nativeName: "Espanol" }
];

const uiByLanguage: Record<LearningLanguage, UiCopy> = {
  en: {
    appName: "Lim MVP",
    appTagline: "Scroll. Learn. Level up.",
    navHome: "Home",
    navFeed: "Feed",
    navVocabulary: "Vocab",
    navMap: "Map",
    navQuests: "Quests",
    navProfile: "Profile",
    mobileMenuOpen: "Open menu",
    mobileMenuClose: "Close menu",
    mobileMenuLabel: "Main menu",
    languageControlTitle: "Study + Interface Language",
    languageControlShort: "Study + UI",
    languageControlHint: "This changes both learning and UI language.",
    homeTitle: "Instagram x Duolingo",
    homeSubtitle: "Web MVP on Qwik City: short learning cards, interactive tasks and progress in one loop.",
    homeOpenFeed: "Open feed",
    homeOpenVocabulary: "Open vocabulary",
    homeOpenLanguageMap: "Open language map",
    homeOpenQuests: "Open quests",
    homeOpenProfile: "Open profile",
    homeActionPlacementTitle: "Start test",
    homeActionPlacementBody: "Take a quick placement test so Lim can estimate your level and unlock relevant progress paths.",
    homeActionContinueTitle: "Continue learning",
    homeActionContinueBody: "Jump back into your feed with the next batch of cards and interactions.",
    homeActionQuestTitle: "Resume quest",
    homeActionQuestBody: "Open quests that match your current progress and the topics you already know.",
    homeActionReviewTitle: "Review weak areas",
    homeActionReviewBody: "Revisit vocabulary and language-map topics that need reinforcement.",
    homeOverviewTitle: "Learning map",
    homeOverviewSubtitle: "Levels and categories use the same data source as your feed, including answer quality.",
    homeOverviewLevels: "Levels",
    homeOverviewCategories: "Categories",
    homeOverviewModules: "modules",
    homeOverviewCards: "cards",
    homeOverviewQuality: "quality",
    homeOverviewNoQuality: "no data yet",
    homeMetaDescription: "Useful scroll with interactive cards",
    feedMetricLevel: "Level",
    feedMetricStreak: "Streak",
    feedNewPack: "Next pack",
    feedFiltersPanel: "Feed filters",
    feedLevels: "Levels",
    feedCategories: "Categories",
    feedAnswers: "Answer result",
    feedAnswerCorrect: "Correct",
    feedAnswerIncorrect: "Incorrect",
    feedAnswerUnanswered: "Unanswered",
    feedNoCards: "No cards in this pack.",
    feedNoAnswerMatches: "No cards with this answer status yet.",
    feedApplyFilters: "Apply filters",
    feedResetFilters: "Reset",
    vocabTitle: "Vocabulary deck",
    vocabSubtitle: "Swipe word cards, filter by sections and word type, then add your own photos.",
    vocabTotalLabel: "Words",
    vocabFiltersPanel: "Vocabulary filters",
    vocabTypes: "Word type",
    vocabSections: "Sections",
    vocabTypeVerb: "Verbs",
    vocabTypeOther: "Other words",
    vocabSectionBaseVerbs: "Base verbs",
    vocabSectionDailyActions: "Daily actions",
    vocabSectionMovementLife: "Movement and life",
    vocabSectionCommunicationThoughts: "Communication and thoughts",
    vocabSectionModalsConstructions: "Modals and constructions",
    vocabSectionAdditionalVerbs: "Additional verbs",
    vocabSectionStateVerbs: "State verbs",
    vocabSectionActionVerbs: "Basic action verbs",
    vocabSectionMovementVerbs: "Movement verbs",
    vocabSectionCommunicationVerbs: "Communication verbs",
    vocabSectionThinkingDecisionVerbs: "Thinking and decisions",
    vocabSectionModalAuxiliaryVerbs: "Modal and auxiliary verbs",
    vocabSectionOtherWords: "Other words",
    vocabProgressTitle: "Learning status",
    vocabProgressAll: "All words",
    vocabProgressLearned: "Learned",
    vocabProgressUnlearned: "Not learned",
    vocabPhotoPlaceholder: "Photo placeholder",
    vocabPhotoHint: "Add imageUrl in vocabulary data (folder: /images/vocabulary).",
    vocabExampleLabel: "Example",
    vocabMarkLearned: "Mark learned",
    vocabLearned: "Learned",
    vocabVerbFormsButton: "Forms",
    vocabVerbExamplesButton: "Usage",
    vocabVerbFormsTitle: "Verb forms",
    vocabVerbTensePresentSimple: "Present Simple",
    vocabVerbTensePastSimple: "Past Simple",
    vocabVerbTenseFutureSimple: "Future Simple",
    vocabVerbTensePresentContinuous: "Present Continuous",
    vocabVerbTensePastContinuous: "Past Continuous",
    vocabVerbTensePresentPerfect: "Present Perfect",
    vocabVerbTensePastPerfect: "Past Perfect",
    vocabVerbExamplesTitle: "Usage examples",
    vocabVerbClose: "Close",
    vocabVerbPerson: "Person",
    vocabVerbForm: "Form",
    vocabVerbUsage: "When to use",
    vocabNoCards: "No words for current filters.",
    vocabApplyFilters: "Apply filters",
    vocabResetFilters: "Reset",
    vocabExplainButton: "Explain",
    vocabAiTitle: "AI chat",
    vocabAiSubtitle: "Click Explain on a card, then ask follow-up questions here.",
    vocabAiEmptyState: "Pick any word card and click Explain to start.",
    vocabAiInputPlaceholder: "Ask a follow-up question...",
    vocabAiSend: "Send",
    vocabAiYou: "You",
    vocabAiAssistant: "AI",
    vocabAiThinking: "Thinking",
    vocabAiCollapse: "Collapse chat",
    vocabAiExpand: "Expand chat",
    mapTitle: "Language map",
    mapSubtitle: "A graph view of tense structure, key verbs, and irregular verb patterns.",
    mapProgressTitle: "Node progress",
    mapProgressLearnedSuffix: "learned",
    mapFilterUnlearnedOnly: "Show unlearned only",
    mapLegendTitle: "Node categories",
    mapGraphAriaLabel: "Interactive language map graph",
    mapNoVisibleNodes: "No nodes match current filter.",
    mapShowAllNodes: "Show all nodes",
    mapCategoryCore: "Core",
    mapCategoryTimeline: "Timeline",
    mapCategoryTense: "Tenses",
    mapCategoryVerbSystem: "Verb system",
    mapCategoryIrregular: "Irregular verbs",
    mapFormulaTitle: "Formula",
    mapKeyVerbsTitle: "Key verbs",
    mapIrregularTableTitle: "Irregular forms",
    mapRelatedNodesTitle: "Connected nodes",
    mapRelatedCardsTitle: "Related cards",
    mapRelatedCardsOpenGrammar: "Open grammar cards",
    mapRelatedCardsOpenVocabulary: "Open vocabulary feed",
    mapRelatedCardsOpenVerbDeck: "Open verb deck",
    mapRelatedCardsOpenIrregular: "Open irregular cards",
    mapRelatedCardsOpenAuxiliary: "Open auxiliary cards",
    mapNodeCardsProgressTitle: "Cards learned in this node",
    mapNodeCardsProgressSuffix: "cards learned",
    mapNodeCardsProgressEmpty: "No related cards found for this node yet.",
    mapStatusTitle: "Learning status",
    mapStatusNew: "New",
    mapStatusLearning: "Learning",
    mapStatusLearned: "Learned",
    mapDiscussButton: "Discuss in chat",
    mapChatTitle: "Node chat",
    mapChatSubtitle: "Open a node and ask questions with node context.",
    mapChatContext: "Current topic",
    mapChatNoContext: "Select a node and press Discuss in chat.",
    mapChatEmptyState: "No messages yet. Start from a node card.",
    mapChatInputPlaceholder: "Ask about this node...",
    mapChatSend: "Send",
    mapChatYou: "You",
    mapChatAssistant: "AI",
    mapChatThinking: "Thinking...",
    categoryGrammar: "Grammar",
    categoryVocabulary: "Vocabulary",
    categorySpeaking: "Speaking",
    categoryListening: "Listening",
    categoryReading: "Reading",
    profileTitle: "Profile and progress",
    profileSubtitle: "Current learner state from mocked backend.",
    profileRecentActivity: "Recent activity",
    profileLearnedMaterial: "Learned material",
    profileLevelOverview: "Current level spread",
    profileCategoryOverview: "Category mastery",
    profileEstimatedLevel: "Estimated level",
    profileKnownTopics: "Known topics",
    profileWeakAreas: "Weak areas",
    profileUnlockedQuests: "Unlocked quests",
    profileEmptyActivity: "No activity yet.",
    profileEmptyLearned: "No learned material recorded yet.",
    profileDays: "days",
    cardCheck: "Check",
    cardSubmitMatch: "Submit match",
    cardFinishMiniGame: "Finish mini game",
    cardMarkDone: "Mark as completed",
    cardMiniChallenge: "Micro challenge",
    cardShowRule: "Rule",
    cardShowExamples: "Examples",
    cardHintsShow: "RU hints",
    cardHintsHide: "Hide RU",
    cardOpenDetails: "Expand",
    cardCloseDetails: "Close",
    cardRecapNote: "Recap cards reinforce recent topics.",
    cardRewardPrefix: "Reward",
    messageCardNotFound: "Card not found",
    messageAcceptedCouldBeBetter: "Answer accepted, but it can be improved",
    messageCardCompleted: "Card completed",
    recapTitle: "Recap",
    recapDescriptionPrefix: "Quick revision"
  },
  es: {
    appName: "Lim MVP",
    appTagline: "Desliza. Aprende. Sube de nivel.",
    navHome: "Inicio",
    navFeed: "Feed",
    navVocabulary: "Vocab",
    navMap: "Mapa",
    navQuests: "Misiones",
    navProfile: "Perfil",
    mobileMenuOpen: "Abrir menu",
    mobileMenuClose: "Cerrar menu",
    mobileMenuLabel: "Menu principal",
    languageControlTitle: "Idioma de estudio + interfaz",
    languageControlShort: "Estudio + UI",
    languageControlHint: "Esto cambia tanto el idioma de estudio como el de la UI.",
    homeTitle: "Instagram x Duolingo",
    homeSubtitle: "MVP web en Qwik City: tarjetas cortas, interacciones y progreso en un solo ciclo.",
    homeOpenFeed: "Abrir feed",
    homeOpenVocabulary: "Abrir vocabulario",
    homeOpenLanguageMap: "Abrir mapa",
    homeOpenQuests: "Abrir misiones",
    homeOpenProfile: "Abrir perfil",
    homeActionPlacementTitle: "Empezar test",
    homeActionPlacementBody: "Haz una prueba corta para que Lim estime tu nivel y desbloquee rutas de progreso relevantes.",
    homeActionContinueTitle: "Seguir aprendiendo",
    homeActionContinueBody: "Vuelve al feed y continúa con la siguiente tanda de tarjetas e interacciones.",
    homeActionQuestTitle: "Reanudar mision",
    homeActionQuestBody: "Abre misiones alineadas con tu progreso actual y con lo que ya sabes.",
    homeActionReviewTitle: "Repasar puntos debiles",
    homeActionReviewBody: "Vuelve a vocabulario y mapa de idioma para reforzar temas flojos.",
    homeOverviewTitle: "Mapa de aprendizaje",
    homeOverviewSubtitle: "Niveles y categorias con la misma fuente de datos del feed y calidad de respuestas.",
    homeOverviewLevels: "Niveles",
    homeOverviewCategories: "Categorias",
    homeOverviewModules: "modulos",
    homeOverviewCards: "tarjetas",
    homeOverviewQuality: "calidad",
    homeOverviewNoQuality: "sin datos aun",
    homeMetaDescription: "Scroll util con tarjetas interactivas",
    feedMetricLevel: "Nivel",
    feedMetricStreak: "Racha",
    feedNewPack: "Nuevo bloque",
    feedFiltersPanel: "Filtros del feed",
    feedLevels: "Niveles",
    feedCategories: "Categorias",
    feedAnswers: "Resultado de respuesta",
    feedAnswerCorrect: "Correctas",
    feedAnswerIncorrect: "Incorrectas",
    feedAnswerUnanswered: "Sin responder",
    feedNoCards: "No hay tarjetas en este bloque.",
    feedNoAnswerMatches: "Aun no hay tarjetas con ese resultado.",
    feedApplyFilters: "Aplicar filtros",
    feedResetFilters: "Restablecer",
    vocabTitle: "Mazo de vocabulario",
    vocabSubtitle: "Desliza tarjetas de palabras, filtra por secciones y tipo, y luego agrega tus fotos.",
    vocabTotalLabel: "Palabras",
    vocabFiltersPanel: "Filtros de vocabulario",
    vocabTypes: "Tipo de palabra",
    vocabSections: "Secciones",
    vocabTypeVerb: "Verbos",
    vocabTypeOther: "Otras palabras",
    vocabSectionBaseVerbs: "Verbos base",
    vocabSectionDailyActions: "Acciones diarias",
    vocabSectionMovementLife: "Movimiento y vida diaria",
    vocabSectionCommunicationThoughts: "Comunicacion y pensamientos",
    vocabSectionModalsConstructions: "Modales y construcciones",
    vocabSectionAdditionalVerbs: "Verbos adicionales",
    vocabSectionStateVerbs: "Verbos de estado",
    vocabSectionActionVerbs: "Verbos basicos de accion",
    vocabSectionMovementVerbs: "Verbos de movimiento",
    vocabSectionCommunicationVerbs: "Verbos de comunicacion",
    vocabSectionThinkingDecisionVerbs: "Pensamiento y decisiones",
    vocabSectionModalAuxiliaryVerbs: "Verbos modales y auxiliares",
    vocabSectionOtherWords: "Otras palabras",
    vocabProgressTitle: "Estado de aprendizaje",
    vocabProgressAll: "Todas",
    vocabProgressLearned: "Aprendidas",
    vocabProgressUnlearned: "No aprendidas",
    vocabPhotoPlaceholder: "Espacio para foto",
    vocabPhotoHint: "Agrega imageUrl en los datos (carpeta: /images/vocabulary).",
    vocabExampleLabel: "Ejemplo",
    vocabMarkLearned: "Marcar aprendida",
    vocabLearned: "Aprendida",
    vocabVerbFormsButton: "Formas",
    vocabVerbExamplesButton: "Uso",
    vocabVerbFormsTitle: "Formas del verbo",
    vocabVerbTensePresentSimple: "Presente simple",
    vocabVerbTensePastSimple: "Pasado simple",
    vocabVerbTenseFutureSimple: "Futuro simple",
    vocabVerbTensePresentContinuous: "Presente continuo",
    vocabVerbTensePastContinuous: "Pasado continuo",
    vocabVerbTensePresentPerfect: "Preterito perfecto",
    vocabVerbTensePastPerfect: "Pluscuamperfecto",
    vocabVerbExamplesTitle: "Ejemplos de uso",
    vocabVerbClose: "Cerrar",
    vocabVerbPerson: "Persona",
    vocabVerbForm: "Forma",
    vocabVerbUsage: "Cuando usar",
    vocabNoCards: "No hay palabras para estos filtros.",
    vocabApplyFilters: "Aplicar filtros",
    vocabResetFilters: "Restablecer",
    vocabExplainButton: "Explicar",
    vocabAiTitle: "Chat AI",
    vocabAiSubtitle: "Haz clic en Explicar en una tarjeta y pregunta aqui.",
    vocabAiEmptyState: "Elige una tarjeta y pulsa Explicar para empezar.",
    vocabAiInputPlaceholder: "Haz una pregunta de seguimiento...",
    vocabAiSend: "Enviar",
    vocabAiYou: "Tu",
    vocabAiAssistant: "AI",
    vocabAiThinking: "Pensando",
    vocabAiCollapse: "Contraer chat",
    vocabAiExpand: "Expandir chat",
    mapTitle: "Mapa del idioma",
    mapSubtitle: "Vista en grafo de tiempos verbales, verbos clave y patrones irregulares.",
    mapProgressTitle: "Progreso de nodos",
    mapProgressLearnedSuffix: "aprendidos",
    mapFilterUnlearnedOnly: "Mostrar solo no aprendidos",
    mapLegendTitle: "Categorias de nodos",
    mapGraphAriaLabel: "Grafo interactivo del idioma",
    mapNoVisibleNodes: "No hay nodos para el filtro actual.",
    mapShowAllNodes: "Mostrar todos",
    mapCategoryCore: "Nucleo",
    mapCategoryTimeline: "Linea temporal",
    mapCategoryTense: "Tiempos",
    mapCategoryVerbSystem: "Sistema verbal",
    mapCategoryIrregular: "Verbos irregulares",
    mapFormulaTitle: "Formula",
    mapKeyVerbsTitle: "Verbos clave",
    mapIrregularTableTitle: "Formas irregulares",
    mapRelatedNodesTitle: "Nodos conectados",
    mapRelatedCardsTitle: "Tarjetas relacionadas",
    mapRelatedCardsOpenGrammar: "Abrir tarjetas de gramatica",
    mapRelatedCardsOpenVocabulary: "Abrir feed de vocabulario",
    mapRelatedCardsOpenVerbDeck: "Abrir mazo de verbos",
    mapRelatedCardsOpenIrregular: "Abrir irregulares",
    mapRelatedCardsOpenAuxiliary: "Abrir auxiliares",
    mapNodeCardsProgressTitle: "Tarjetas aprendidas en este nodo",
    mapNodeCardsProgressSuffix: "tarjetas aprendidas",
    mapNodeCardsProgressEmpty: "Aun no hay tarjetas relacionadas para este nodo.",
    mapStatusTitle: "Estado de aprendizaje",
    mapStatusNew: "Nuevo",
    mapStatusLearning: "En progreso",
    mapStatusLearned: "Aprendido",
    mapDiscussButton: "Hablar en chat",
    mapChatTitle: "Chat del nodo",
    mapChatSubtitle: "Abre un nodo y pregunta con ese contexto.",
    mapChatContext: "Tema actual",
    mapChatNoContext: "Elige un nodo y pulsa Hablar en chat.",
    mapChatEmptyState: "Aun no hay mensajes. Empieza desde una tarjeta de nodo.",
    mapChatInputPlaceholder: "Pregunta sobre este nodo...",
    mapChatSend: "Enviar",
    mapChatYou: "Tu",
    mapChatAssistant: "AI",
    mapChatThinking: "Pensando...",
    categoryGrammar: "Gramatica",
    categoryVocabulary: "Vocabulario",
    categorySpeaking: "Habla",
    categoryListening: "Escucha",
    categoryReading: "Lectura",
    profileTitle: "Perfil y progreso",
    profileSubtitle: "Estado actual del usuario desde backend simulado.",
    profileRecentActivity: "Actividad reciente",
    profileLearnedMaterial: "Material aprendido",
    profileLevelOverview: "Distribucion por nivel",
    profileCategoryOverview: "Dominio por categoria",
    profileEstimatedLevel: "Nivel estimado",
    profileKnownTopics: "Temas conocidos",
    profileWeakAreas: "Areas debiles",
    profileUnlockedQuests: "Misiones desbloqueadas",
    profileEmptyActivity: "Sin actividad por ahora.",
    profileEmptyLearned: "Todavia no hay material aprendido registrado.",
    profileDays: "dias",
    cardCheck: "Comprobar",
    cardSubmitMatch: "Enviar respuesta",
    cardFinishMiniGame: "Terminar mini juego",
    cardMarkDone: "Marcar como completado",
    cardMiniChallenge: "Micro reto",
    cardShowRule: "Regla",
    cardShowExamples: "Ejemplos",
    cardHintsShow: "Ayuda RU",
    cardHintsHide: "Ocultar RU",
    cardOpenDetails: "Expandir",
    cardCloseDetails: "Cerrar",
    cardRecapNote: "Las tarjetas de repaso consolidan los temas recientes.",
    cardRewardPrefix: "Recompensa",
    messageCardNotFound: "Tarjeta no encontrada",
    messageAcceptedCouldBeBetter: "Respuesta aceptada, pero se puede mejorar",
    messageCardCompleted: "Tarjeta completada",
    recapTitle: "Repaso",
    recapDescriptionPrefix: "Revision rapida"
  }
};

export function isLearningLanguage(value: string | null | undefined): value is LearningLanguage {
  return value === "en" || value === "es";
}

export function resolveLearningLanguage(value: string | null | undefined): LearningLanguage {
  return isLearningLanguage(value) ? value : "en";
}

export function detectLearningLanguage(url: URL, cookieLanguage?: string | null): LearningLanguage {
  const queryLanguage = url.searchParams.get("lang");
  if (isLearningLanguage(queryLanguage)) {
    return queryLanguage;
  }

  return resolveLearningLanguage(cookieLanguage);
}

export function getUiCopy(language: LearningLanguage): UiCopy {
  return uiByLanguage[language];
}

export function buildLanguageHref(url: URL, language: LearningLanguage): string {
  const params = new URLSearchParams(url.search);
  params.set("lang", language);
  const query = params.toString();
  return query.length > 0 ? `${url.pathname}?${query}` : url.pathname;
}
