export type LanguageMapNodeCategory = "core" | "timeline" | "tense" | "verb_system" | "irregular";

export interface LanguageMapNodePosition {
  x: number;
  y: number;
}

export interface IrregularVerbSample {
  base: string;
  past: string;
  participle: string;
}

export interface LanguageMapNode {
  id: string;
  label: string;
  graphLabel: string;
  category: LanguageMapNodeCategory;
  position: LanguageMapNodePosition;
  summary: string;
  details: string;
  formula?: string;
  keyVerbs: string[];
  irregularSamples?: IrregularVerbSample[];
}

export interface LanguageMapEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  kind?: "primary" | "cross";
}

export const LANGUAGE_MAP_VIEWBOX = {
  width: 1200,
  height: 760
} as const;

export const LANGUAGE_MAP_NODES: readonly LanguageMapNode[] = [
  {
    id: "language-core",
    label: "Language Core",
    graphLabel: "Language\nCore",
    category: "core",
    position: { x: 620, y: 110 },
    summary: "The center: time logic, tense formulas, and verb forms work together.",
    details:
      "Read the map from center to outer nodes: first time zones, then tense formulas, then verb systems and irregular forms.",
    keyVerbs: ["be", "have", "do", "go"]
  },
  {
    id: "time-axis",
    label: "Time Axis",
    graphLabel: "Time\nAxis",
    category: "timeline",
    position: { x: 620, y: 245 },
    summary: "Every tense points to one time zone: past, present, or future.",
    details:
      "Choose the time zone first. Then choose aspect: simple, continuous, or perfect. This prevents random tense guesses.",
    keyVerbs: ["happen", "start", "continue", "finish"]
  },
  {
    id: "past-zone",
    label: "Past Zone",
    graphLabel: "Past",
    category: "timeline",
    position: { x: 300, y: 320 },
    summary: "Finished actions, background processes in the past, and earlier-past relations.",
    details: "Past tenses answer: what happened, what was in progress, and what had happened before another past event.",
    keyVerbs: ["went", "saw", "worked", "thought"]
  },
  {
    id: "present-zone",
    label: "Present Zone",
    graphLabel: "Present",
    category: "timeline",
    position: { x: 620, y: 360 },
    summary: "Habits, current actions, and actions connected to now.",
    details: "Present tenses answer: what is generally true, what is happening now, and what has happened up to now.",
    keyVerbs: ["do", "am", "have", "know"]
  },
  {
    id: "future-zone",
    label: "Future Zone",
    graphLabel: "Future",
    category: "timeline",
    position: { x: 900, y: 320 },
    summary: "Plans, predictions, and events after now.",
    details: "Future tenses answer: what will happen, what will be in progress, and what will be completed before a future point.",
    keyVerbs: ["will", "plan", "expect", "arrive"]
  },
  {
    id: "present-simple",
    label: "Present Simple",
    graphLabel: "Present\nSimple",
    category: "tense",
    position: { x: 500, y: 520 },
    summary: "Habits, facts, routines.",
    details: "Use it for repeated actions and general truths. Third person singular adds -s in positive statements.",
    formula: "I/You/We/They + V1, He/She/It + V1-s",
    keyVerbs: ["do", "have", "like", "need"]
  },
  {
    id: "present-continuous",
    label: "Present Continuous",
    graphLabel: "Present\nContinuous",
    category: "tense",
    position: { x: 740, y: 520 },
    summary: "Actions in progress right now or temporary situations.",
    details: "Use be + verb-ing for ongoing actions. Often used with now, currently, at the moment.",
    formula: "am/is/are + V-ing",
    keyVerbs: ["am doing", "is going", "are reading", "is working"]
  },
  {
    id: "present-perfect",
    label: "Present Perfect",
    graphLabel: "Present\nPerfect",
    category: "tense",
    position: { x: 620, y: 650 },
    summary: "Past action with a result or connection in the present.",
    details: "Use have/has + V3. Typical markers: already, yet, just, ever, never, since, for.",
    formula: "have/has + V3",
    keyVerbs: ["have seen", "has done", "have known", "has gone"]
  },
  {
    id: "past-simple",
    label: "Past Simple",
    graphLabel: "Past\nSimple",
    category: "tense",
    position: { x: 290, y: 560 },
    summary: "Completed action in the past at a known or implied time.",
    details: "Use V2 for regular and irregular verbs. Main tense for stories and completed events.",
    formula: "V2 (or did + V1 in negatives/questions)",
    keyVerbs: ["went", "made", "talked", "studied"]
  },
  {
    id: "past-continuous",
    label: "Past Continuous",
    graphLabel: "Past\nContinuous",
    category: "tense",
    position: { x: 170, y: 690 },
    summary: "Background process at a specific time in the past.",
    details: "Use was/were + verb-ing, often with while/when to combine with Past Simple actions.",
    formula: "was/were + V-ing",
    keyVerbs: ["was reading", "were waiting", "was driving", "were talking"]
  },
  {
    id: "past-perfect",
    label: "Past Perfect",
    graphLabel: "Past\nPerfect",
    category: "tense",
    position: { x: 430, y: 700 },
    summary: "Action completed before another past action.",
    details: "Use had + V3 to set event order clearly in narratives and explanations.",
    formula: "had + V3",
    keyVerbs: ["had seen", "had done", "had left", "had prepared"]
  },
  {
    id: "future-simple",
    label: "Future Simple",
    graphLabel: "Future\nSimple",
    category: "tense",
    position: { x: 900, y: 560 },
    summary: "Predictions, decisions at the moment, and future facts.",
    details: "Use will + V1 for neutral future statements and spontaneous decisions.",
    formula: "will + V1",
    keyVerbs: ["will go", "will start", "will call", "will finish"]
  },
  {
    id: "core-verbs",
    label: "Core Verbs",
    graphLabel: "Core\nVerbs",
    category: "verb_system",
    position: { x: 1010, y: 150 },
    summary: "High-frequency verbs power most beginner and intermediate sentences.",
    details:
      "Prioritize be, have, do, go, get, make, know, think. They combine with many patterns and help fluency quickly.",
    keyVerbs: ["be", "have", "do", "go", "get", "make", "know", "think"]
  },
  {
    id: "auxiliary-verbs",
    label: "Auxiliary Verbs",
    graphLabel: "Auxiliary\nVerbs",
    category: "verb_system",
    position: { x: 1020, y: 300 },
    summary: "Helpers that build tense, negation, and questions.",
    details: "Main helpers: be, have, do, and will. They are structural verbs, not optional words.",
    formula: "do/does/did, am/is/are, was/were, have/has/had, will",
    keyVerbs: ["be", "have", "do", "will"]
  },
  {
    id: "irregular-verbs",
    label: "Irregular Verbs",
    graphLabel: "Irregular\nVerbs",
    category: "irregular",
    position: { x: 1040, y: 500 },
    summary: "High-impact list: memorize V1, V2, V3 as connected sets.",
    details: "Irregular verbs are mandatory for Past Simple and Perfect tenses. Learn by frequency and mini-groups.",
    keyVerbs: ["go", "see", "do", "have", "make", "take", "come", "know"],
    irregularSamples: [
      { base: "go", past: "went", participle: "gone" },
      { base: "see", past: "saw", participle: "seen" },
      { base: "do", past: "did", participle: "done" },
      { base: "know", past: "knew", participle: "known" },
      { base: "take", past: "took", participle: "taken" }
    ]
  }
];

export const LANGUAGE_MAP_EDGES: readonly LanguageMapEdge[] = [
  { id: "e-core-time", from: "language-core", to: "time-axis", label: "starts with", kind: "primary" },
  { id: "e-core-verbs", from: "language-core", to: "core-verbs", label: "powered by", kind: "primary" },
  { id: "e-time-past", from: "time-axis", to: "past-zone", kind: "primary" },
  { id: "e-time-present", from: "time-axis", to: "present-zone", kind: "primary" },
  { id: "e-time-future", from: "time-axis", to: "future-zone", kind: "primary" },
  { id: "e-present-simple", from: "present-zone", to: "present-simple", kind: "primary" },
  { id: "e-present-cont", from: "present-zone", to: "present-continuous", kind: "primary" },
  { id: "e-present-perfect", from: "present-zone", to: "present-perfect", kind: "primary" },
  { id: "e-past-simple", from: "past-zone", to: "past-simple", kind: "primary" },
  { id: "e-past-cont", from: "past-zone", to: "past-continuous", kind: "primary" },
  { id: "e-past-perfect", from: "past-zone", to: "past-perfect", kind: "primary" },
  { id: "e-future-simple", from: "future-zone", to: "future-simple", kind: "primary" },
  { id: "e-core-aux", from: "core-verbs", to: "auxiliary-verbs", label: "include", kind: "primary" },
  { id: "e-core-irregular", from: "core-verbs", to: "irregular-verbs", label: "memorize", kind: "primary" },
  { id: "e-irregular-past", from: "irregular-verbs", to: "past-simple", label: "drives V2", kind: "cross" },
  { id: "e-irregular-perfect", from: "irregular-verbs", to: "present-perfect", label: "drives V3", kind: "cross" },
  { id: "e-aux-cont", from: "auxiliary-verbs", to: "present-continuous", label: "be + ing", kind: "cross" },
  { id: "e-aux-perfect", from: "auxiliary-verbs", to: "present-perfect", label: "have + V3", kind: "cross" },
  { id: "e-aux-future", from: "auxiliary-verbs", to: "future-simple", label: "will + V1", kind: "cross" }
];

export const LANGUAGE_MAP_NODE_BY_ID = Object.fromEntries(
  LANGUAGE_MAP_NODES.map((node) => [node.id, node])
) as Record<string, LanguageMapNode>;

export function getLanguageMapNodeById(nodeId: string): LanguageMapNode | null {
  return LANGUAGE_MAP_NODE_BY_ID[nodeId] ?? null;
}

// ─── Spanish language map ────────────────────────────────────────────────────

export const LANGUAGE_MAP_NODES_ES: readonly LanguageMapNode[] = [
  {
    id: "nucleo-idioma",
    label: "Núcleo del Idioma",
    graphLabel: "Núcleo del\nIdioma",
    category: "core",
    position: { x: 620, y: 110 },
    summary: "El centro: la lógica temporal, las fórmulas verbales y las formas verbales trabajan juntas.",
    details:
      "Lee el mapa desde el centro hacia afuera: primero las zonas temporales, luego los tiempos verbales, después los sistemas de verbos y las formas irregulares.",
    keyVerbs: ["ser", "estar", "tener", "ir"]
  },
  {
    id: "eje-temporal",
    label: "Eje Temporal",
    graphLabel: "Eje\nTemporal",
    category: "timeline",
    position: { x: 620, y: 245 },
    summary: "Cada tiempo verbal apunta a una zona: pasado, presente o futuro.",
    details:
      "Elige primero la zona temporal. Luego elige el aspecto: simple, continuo o perfecto. Esto evita adivinar el tiempo al azar.",
    keyVerbs: ["ocurrir", "empezar", "continuar", "terminar"]
  },
  {
    id: "zona-pasado",
    label: "Zona de Pasado",
    graphLabel: "Pasado",
    category: "timeline",
    position: { x: 300, y: 320 },
    summary: "Acciones terminadas, procesos de fondo en el pasado y relaciones con el pasado anterior.",
    details:
      "Los tiempos del pasado responden: qué ocurrió, qué estaba en progreso y qué había ocurrido antes de otro evento pasado.",
    keyVerbs: ["fui", "vi", "trabajé", "pensé"]
  },
  {
    id: "zona-presente",
    label: "Zona de Presente",
    graphLabel: "Presente",
    category: "timeline",
    position: { x: 620, y: 360 },
    summary: "Hábitos, acciones actuales y acciones conectadas al ahora.",
    details:
      "Los tiempos del presente responden: qué es verdad en general, qué ocurre ahora y qué ha ocurrido hasta ahora.",
    keyVerbs: ["hago", "soy", "tengo", "sé"]
  },
  {
    id: "zona-futuro",
    label: "Zona de Futuro",
    graphLabel: "Futuro",
    category: "timeline",
    position: { x: 900, y: 320 },
    summary: "Planes, predicciones y eventos después del ahora.",
    details:
      "Los tiempos del futuro responden: qué pasará, qué estará en progreso y qué se completará antes de un punto futuro.",
    keyVerbs: ["iré", "haré", "llegaré", "esperaré"]
  },
  {
    id: "presente-indicativo",
    label: "Presente de Indicativo",
    graphLabel: "Presente\nIndicativo",
    category: "tense",
    position: { x: 500, y: 520 },
    summary: "Hábitos, hechos y rutinas del día a día.",
    details:
      "Úsalo para acciones repetidas y verdades generales. Las terminaciones varían según la persona: -o, -as/-es, -a/-e, -amos/-emos, -áis/-éis, -an/-en.",
    formula: "yo habl-o / tú habl-as / él habl-a / nosotros habl-amos",
    keyVerbs: ["hablar", "comer", "vivir", "tener"]
  },
  {
    id: "presente-continuo",
    label: "Presente Continuo",
    graphLabel: "Presente\nContinuo",
    category: "tense",
    position: { x: 740, y: 520 },
    summary: "Acciones en progreso en este momento o situaciones temporales.",
    details:
      "Usa estar + gerundio para acciones en curso. Frecuente con ahora mismo, en este momento.",
    formula: "estar (presente) + gerundio (-ando / -iendo)",
    keyVerbs: ["estoy hablando", "está comiendo", "estamos viendo", "están trabajando"]
  },
  {
    id: "preterito-perfecto",
    label: "Pretérito Perfecto",
    graphLabel: "Pretérito\nPerfecto",
    category: "tense",
    position: { x: 620, y: 650 },
    summary: "Acción pasada con resultado o conexión en el presente.",
    details:
      "Usa haber (presente) + participio. Típico con ya, todavía no, alguna vez, nunca, hoy, esta semana.",
    formula: "haber (pres.) + participio (-ado / -ido)",
    keyVerbs: ["he hablado", "ha comido", "hemos visto", "han llegado"]
  },
  {
    id: "preterito-indefinido",
    label: "Pretérito Indefinido",
    graphLabel: "Pretérito\nIndefinido",
    category: "tense",
    position: { x: 290, y: 560 },
    summary: "Acción completada en el pasado en un momento concreto.",
    details:
      "Tiempo principal para narrar eventos y acciones terminadas. Las formas irregulares son muy frecuentes.",
    formula: "yo habl-é / tú habl-aste / él habl-ó",
    keyVerbs: ["fui", "hice", "hablé", "llegué"]
  },
  {
    id: "preterito-imperfecto",
    label: "Pretérito Imperfecto",
    graphLabel: "Pretérito\nImperfecto",
    category: "tense",
    position: { x: 170, y: 690 },
    summary: "Proceso de fondo o acción habitual en el pasado.",
    details:
      "Úsalo para describir situaciones pasadas, hábitos de antes o acciones en progreso cuando ocurrió otra cosa. Frecuente con mientras, cuando, siempre.",
    formula: "yo habl-aba / tú habl-abas / él habl-aba",
    keyVerbs: ["hablaba", "comía", "vivía", "tenía"]
  },
  {
    id: "pluscuamperfecto",
    label: "Pluscuamperfecto",
    graphLabel: "Pluscuam-\nperfecto",
    category: "tense",
    position: { x: 430, y: 700 },
    summary: "Acción completada antes de otro evento pasado.",
    details:
      "Usa haber (imperfecto) + participio para ordenar eventos en narraciones y explicaciones.",
    formula: "haber (imperf.) + participio (-ado / -ido)",
    keyVerbs: ["había hablado", "había comido", "había llegado", "había hecho"]
  },
  {
    id: "futuro-simple",
    label: "Futuro Simple",
    graphLabel: "Futuro\nSimple",
    category: "tense",
    position: { x: 900, y: 560 },
    summary: "Predicciones, promesas y hechos futuros.",
    details:
      "Añade las terminaciones de futuro directamente al infinitivo. También expresa probabilidad en el presente.",
    formula: "infinitivo + -é / -ás / -á / -emos / -éis / -án",
    keyVerbs: ["hablaré", "comeré", "iré", "haré"]
  },
  {
    id: "verbos-clave",
    label: "Verbos Clave",
    graphLabel: "Verbos\nClave",
    category: "verb_system",
    position: { x: 1010, y: 150 },
    summary: "Los verbos más frecuentes del español: imprescindibles para principiantes e intermedios.",
    details:
      "Prioriza ser, estar, tener, ir, hacer, poder, querer, saber. Se combinan con muchos patrones y aceleran la fluidez.",
    keyVerbs: ["ser", "estar", "tener", "ir", "hacer", "poder", "querer", "saber"]
  },
  {
    id: "ser-estar",
    label: "Ser y Estar",
    graphLabel: "Ser y\nEstar",
    category: "verb_system",
    position: { x: 1020, y: 300 },
    summary: "Dos verbos para «to be»: el mayor reto del español.",
    details:
      "Ser: identidad, origen, profesión, características permanentes. Estar: estados, emociones, ubicación, resultados temporales. Apréndalos juntos siempre.",
    formula: "SER: soy / eres / es / somos  |  ESTAR: estoy / estás / está / estamos",
    keyVerbs: ["ser", "estar"]
  },
  {
    id: "verbos-irregulares",
    label: "Verbos Irregulares",
    graphLabel: "Verbos\nIrregulares",
    category: "irregular",
    position: { x: 1040, y: 500 },
    summary: "Lista de alto impacto: memoriza las formas en grupos por patrón.",
    details:
      "Los irregulares son obligatorios en Indefinido y en Presente. Apréndalos por frecuencia y mini-grupos de raíz similar.",
    keyVerbs: ["ir", "ser", "estar", "tener", "hacer", "decir", "poder", "venir"],
    irregularSamples: [
      { base: "ir / ser", past: "fui", participle: "ido / sido" },
      { base: "tener", past: "tuve", participle: "tenido" },
      { base: "hacer", past: "hice", participle: "hecho" },
      { base: "poder", past: "pude", participle: "podido" },
      { base: "decir", past: "dije", participle: "dicho" }
    ]
  }
];

export const LANGUAGE_MAP_EDGES_ES: readonly LanguageMapEdge[] = [
  { id: "es-e-core-time",     from: "nucleo-idioma",        to: "eje-temporal",          label: "empieza con",  kind: "primary" },
  { id: "es-e-core-verbs",    from: "nucleo-idioma",        to: "verbos-clave",           label: "impulsado por", kind: "primary" },
  { id: "es-e-time-past",     from: "eje-temporal",         to: "zona-pasado",            kind: "primary" },
  { id: "es-e-time-present",  from: "eje-temporal",         to: "zona-presente",          kind: "primary" },
  { id: "es-e-time-future",   from: "eje-temporal",         to: "zona-futuro",            kind: "primary" },
  { id: "es-e-pres-ind",      from: "zona-presente",        to: "presente-indicativo",    kind: "primary" },
  { id: "es-e-pres-cont",     from: "zona-presente",        to: "presente-continuo",      kind: "primary" },
  { id: "es-e-pres-perf",     from: "zona-presente",        to: "preterito-perfecto",     kind: "primary" },
  { id: "es-e-past-indef",    from: "zona-pasado",          to: "preterito-indefinido",   kind: "primary" },
  { id: "es-e-past-imperf",   from: "zona-pasado",          to: "preterito-imperfecto",   kind: "primary" },
  { id: "es-e-past-pluscuam", from: "zona-pasado",          to: "pluscuamperfecto",       kind: "primary" },
  { id: "es-e-fut-simple",    from: "zona-futuro",          to: "futuro-simple",          kind: "primary" },
  { id: "es-e-core-serestar", from: "verbos-clave",         to: "ser-estar",              label: "incluye",    kind: "primary" },
  { id: "es-e-core-irreg",    from: "verbos-clave",         to: "verbos-irregulares",     label: "memoriza",   kind: "primary" },
  { id: "es-e-irreg-indef",   from: "verbos-irregulares",  to: "preterito-indefinido",   label: "raíz V2",    kind: "cross" },
  { id: "es-e-irreg-perf",    from: "verbos-irregulares",  to: "preterito-perfecto",     label: "participio", kind: "cross" },
  { id: "es-e-se-cont",       from: "ser-estar",            to: "presente-continuo",      label: "estar + ger", kind: "cross" },
  { id: "es-e-se-perf",       from: "ser-estar",            to: "preterito-perfecto",     label: "haber + part", kind: "cross" },
  { id: "es-e-se-fut",        from: "ser-estar",            to: "futuro-simple",          label: "será",       kind: "cross" }
];

const LANGUAGE_MAP_NODES_ES_BY_ID = Object.fromEntries(
  LANGUAGE_MAP_NODES_ES.map((node) => [node.id, node])
) as Record<string, LanguageMapNode>;

// ─── Language-aware getters ──────────────────────────────────────────────────

export function getLanguageMapNodesForLang(language: string): readonly LanguageMapNode[] {
  return language === "es" ? LANGUAGE_MAP_NODES_ES : LANGUAGE_MAP_NODES;
}

export function getLanguageMapEdgesForLang(language: string): readonly LanguageMapEdge[] {
  return language === "es" ? LANGUAGE_MAP_EDGES_ES : LANGUAGE_MAP_EDGES;
}

export function getLanguageMapNodeByIdForLang(nodeId: string, language: string): LanguageMapNode | null {
  const map = language === "es" ? LANGUAGE_MAP_NODES_ES_BY_ID : LANGUAGE_MAP_NODE_BY_ID;
  return map[nodeId] ?? null;
}
