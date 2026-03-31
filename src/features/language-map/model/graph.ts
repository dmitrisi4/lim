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
