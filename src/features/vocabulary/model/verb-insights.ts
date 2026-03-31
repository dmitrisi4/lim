import type { LearningLanguage } from "~/shared/i18n/ui";

export type VerbTense =
  | "present_simple"
  | "past_simple"
  | "future_simple"
  | "present_continuous"
  | "past_continuous"
  | "present_perfect"
  | "past_perfect";

export const VERB_TENSE_OPTIONS: readonly VerbTense[] = [
  "present_simple",
  "past_simple",
  "future_simple",
  "present_continuous",
  "past_continuous",
  "present_perfect",
  "past_perfect"
];

type VerbTuple = [string, string, string, string, string];

type PersonRow = {
  label: string;
  usage: string;
};

const PERSON_ROWS_ES: readonly PersonRow[] = [
  { label: "YO", usage: "Когда говоришь о себе." },
  { label: "TU", usage: "Когда обращаешься к одному человеку на ты." },
  { label: "EL/ELLA/USTED", usage: "О третьем лице или при вежливом обращении." },
  { label: "NOSOTROS", usage: "Когда речь о группе, куда входишь ты." },
  { label: "ELLOS/ELLAS/USTEDES", usage: "Когда речь о других людях или о группе собеседников." }
];

const PERSON_ROWS_EN: readonly PersonRow[] = [
  { label: "I", usage: "Когда говоришь о себе." },
  { label: "YOU", usage: "Когда обращаешься к одному человеку или группе." },
  { label: "HE/SHE/IT", usage: "Третье лицо единственного числа." },
  { label: "WE", usage: "Когда речь о группе, включая тебя." },
  { label: "THEY", usage: "Когда говоришь о других людях/объектах." }
];

const TENSE_USAGE_ES: Record<VerbTense, string> = {
  present_simple: "Presente simple: действие сейчас, привычка или общий факт.",
  past_simple: "Preterito simple: завершенное действие в прошлом.",
  future_simple: "Futuro simple: действие в будущем, прогноз или обещание.",
  present_continuous: "Presente continuo: estar + gerundio (действие прямо сейчас).",
  past_continuous: "Pasado continuo: estar в прошлом + gerundio (процесс в прошлом).",
  present_perfect: "Preterito perfecto: haber в настоящем + participio.",
  past_perfect: "Pluscuamperfecto: haber в прошедшем + participio."
};

const TENSE_USAGE_EN: Record<VerbTense, string> = {
  present_simple: "Present Simple: routine, fact, repeated action.",
  past_simple: "Past Simple: finished action in the past.",
  future_simple: "Future Simple: plan, prediction, promise.",
  present_continuous: "Present Continuous: action in progress now.",
  past_continuous: "Past Continuous: process in progress in the past.",
  present_perfect: "Present Perfect: result/experience connected to now.",
  past_perfect: "Past Perfect: action completed before another past moment."
};

const IRREGULAR_PRESENT_ES: Record<string, VerbTuple> = {
  ser: ["soy", "eres", "es", "somos", "son"],
  estar: ["estoy", "estas", "esta", "estamos", "estan"],
  tener: ["tengo", "tienes", "tiene", "tenemos", "tienen"],
  hacer: ["hago", "haces", "hace", "hacemos", "hacen"],
  ir: ["voy", "vas", "va", "vamos", "van"],
  venir: ["vengo", "vienes", "viene", "venimos", "vienen"],
  decir: ["digo", "dices", "dice", "decimos", "dicen"],
  ver: ["veo", "ves", "ve", "vemos", "ven"],
  dar: ["doy", "das", "da", "damos", "dan"],
  dormir: ["duermo", "duermes", "duerme", "dormimos", "duermen"],
  leer: ["leo", "lees", "lee", "leemos", "leen"],
  salir: ["salgo", "sales", "sale", "salimos", "salen"],
  traer: ["traigo", "traes", "trae", "traemos", "traen"],
  empezar: ["empiezo", "empiezas", "empieza", "empezamos", "empiezan"],
  cerrar: ["cierro", "cierras", "cierra", "cerramos", "cierran"],
  encontrar: ["encuentro", "encuentras", "encuentra", "encontramos", "encuentran"],
  pensar: ["pienso", "piensas", "piensa", "pensamos", "piensan"],
  creer: ["creo", "crees", "cree", "creemos", "creen"],
  saber: ["se", "sabes", "sabe", "sabemos", "saben"],
  conocer: ["conozco", "conoces", "conoce", "conocemos", "conocen"],
  querer: ["quiero", "quieres", "quiere", "queremos", "quieren"],
  gustar: ["gusto", "gustas", "gusta", "gustamos", "gustan"],
  sentir: ["siento", "sientes", "siente", "sentimos", "sienten"],
  poder: ["puedo", "puedes", "puede", "podemos", "pueden"],
  preferir: ["prefiero", "prefieres", "prefiere", "preferimos", "prefieren"],
  poner: ["pongo", "pones", "pone", "ponemos", "ponen"],
  volver: ["vuelvo", "vuelves", "vuelve", "volvemos", "vuelven"],
  recordar: ["recuerdo", "recuerdas", "recuerda", "recordamos", "recuerdan"],
  oir: ["oigo", "oyes", "oye", "oimos", "oyen"]
};

const IRREGULAR_PAST_ES: Record<string, VerbTuple> = {
  ser: ["fui", "fuiste", "fue", "fuimos", "fueron"],
  ir: ["fui", "fuiste", "fue", "fuimos", "fueron"],
  estar: ["estuve", "estuviste", "estuvo", "estuvimos", "estuvieron"],
  tener: ["tuve", "tuviste", "tuvo", "tuvimos", "tuvieron"],
  hacer: ["hice", "hiciste", "hizo", "hicimos", "hicieron"],
  venir: ["vine", "viniste", "vino", "vinimos", "vinieron"],
  decir: ["dije", "dijiste", "dijo", "dijimos", "dijeron"],
  dar: ["di", "diste", "dio", "dimos", "dieron"],
  ver: ["vi", "viste", "vio", "vimos", "vieron"],
  poder: ["pude", "pudiste", "pudo", "pudimos", "pudieron"],
  querer: ["quise", "quisiste", "quiso", "quisimos", "quisieron"],
  saber: ["supe", "supiste", "supo", "supimos", "supieron"],
  poner: ["puse", "pusiste", "puso", "pusimos", "pusieron"],
  traer: ["traje", "trajiste", "trajo", "trajimos", "trajeron"]
};

const IRREGULAR_FUTURE_STEM_ES: Record<string, string> = {
  tener: "tendr",
  hacer: "har",
  venir: "vendr",
  decir: "dir",
  poder: "podr",
  querer: "querr",
  saber: "sabr",
  poner: "pondr",
  salir: "saldr"
};

const IRREGULAR_GERUND_ES: Record<string, string> = {
  ir: "yendo",
  poder: "pudiendo",
  dormir: "durmiendo",
  leer: "leyendo",
  oir: "oyendo",
  venir: "viniendo",
  decir: "diciendo",
  sentir: "sintiendo",
  preferir: "prefiriendo"
};

const IRREGULAR_PARTICIPLE_ES: Record<string, string> = {
  abrir: "abierto",
  cubrir: "cubierto",
  decir: "dicho",
  escribir: "escrito",
  hacer: "hecho",
  morir: "muerto",
  poner: "puesto",
  resolver: "resuelto",
  romper: "roto",
  ver: "visto",
  volver: "vuelto"
};

const VERB_NOTE_ES: Record<string, string> = {
  ser: "Неправильный глагол: используем для постоянных характеристик и идентичности.",
  estar: "Неправильный глагол: используем для состояния и местоположения.",
  ir: "Полностью неправильный глагол движения.",
  tener: "Неправильный в форме yo (tengo).",
  decir: "Неправильный в форме yo (digo) и с изменением e -> i.",
  poder: "Корневое чередование o -> ue (кроме nosotros).",
  querer: "Корневое чередование e -> ie (кроме nosotros).",
  empezar: "Корневое чередование e -> ie (кроме nosotros).",
  preferir: "Корневое чередование e -> ie (кроме nosotros).",
  sentir: "Корневое чередование e -> ie (кроме nosotros).",
  volver: "Корневое чередование o -> ue (кроме nosotros).",
  recordar: "Корневое чередование o -> ue (кроме nosotros)."
};

const EN_BASE_ALIAS: Record<string, string> = {
  "do / does / did / done / doing": "do",
  "am, is, are": "be",
  "was, were": "be",
  "to be": "be",
  am: "be",
  is: "be",
  are: "be",
  was: "be",
  were: "be",
  does: "do",
  did: "do",
  done: "do",
  thought: "think",
  understood: "understand",
  has: "have",
  had: "have",
  could: "can",
  might: "may",
  "don't": "do",
  "doesn't": "do",
  "didn't": "do"
};

const EN_MODAL_SET = new Set(["can", "could", "may", "might", "must", "should", "will", "would", "shall"]);

const EN_IRREGULAR_PRESENT: Record<string, VerbTuple> = {
  be: ["am", "are", "is", "are", "are"],
  have: ["have", "have", "has", "have", "have"],
  do: ["do", "do", "does", "do", "do"],
  can: ["can", "can", "can", "can", "can"],
  may: ["may", "may", "may", "may", "may"],
  must: ["must", "must", "must", "must", "must"],
  should: ["should", "should", "should", "should", "should"],
  will: ["will", "will", "will", "will", "will"],
  would: ["would", "would", "would", "would", "would"],
  shall: ["shall", "shall", "shall", "shall", "shall"],
  could: ["could", "could", "could", "could", "could"],
  might: ["might", "might", "might", "might", "might"],
  "don't": ["don't", "don't", "doesn't", "don't", "don't"],
  "doesn't": ["don't", "don't", "doesn't", "don't", "don't"],
  "didn't": ["didn't", "didn't", "didn't", "didn't", "didn't"]
};

const EN_IRREGULAR_PAST: Record<string, VerbTuple> = {
  be: ["was", "were", "was", "were", "were"],
  have: ["had", "had", "had", "had", "had"],
  do: ["did", "did", "did", "did", "did"],
  know: ["knew", "knew", "knew", "knew", "knew"],
  think: ["thought", "thought", "thought", "thought", "thought"],
  understand: ["understood", "understood", "understood", "understood", "understood"],
  can: ["could", "could", "could", "could", "could"],
  may: ["might", "might", "might", "might", "might"],
  must: ["had to", "had to", "had to", "had to", "had to"],
  should: ["should", "should", "should", "should", "should"],
  will: ["would", "would", "would", "would", "would"],
  would: ["would", "would", "would", "would", "would"],
  shall: ["should", "should", "should", "should", "should"],
  could: ["could", "could", "could", "could", "could"],
  might: ["might", "might", "might", "might", "might"],
  "don't": ["didn't", "didn't", "didn't", "didn't", "didn't"],
  "doesn't": ["didn't", "didn't", "didn't", "didn't", "didn't"],
  "didn't": ["didn't", "didn't", "didn't", "didn't", "didn't"]
};

const EN_IRREGULAR_PARTICIPLE: Record<string, string> = {
  be: "been",
  do: "done",
  have: "had",
  know: "known",
  think: "thought",
  understand: "understood",
  go: "gone",
  see: "seen",
  write: "written",
  make: "made",
  take: "taken",
  come: "come",
  run: "run",
  eat: "eaten",
  drink: "drunk",
  speak: "spoken",
  find: "found",
  give: "given",
  get: "got"
};

const EN_MODAL_FUTURE_BASE: Record<string, string> = {
  can: "be able to",
  could: "be able to",
  may: "be allowed to",
  might: "be allowed to",
  must: "have to",
  should: "have to",
  will: "will"
};

const VERB_NOTE_EN: Record<string, string> = {
  be: "Irregular verb: forms change completely by person and tense.",
  do: "Irregular auxiliary/main verb: do/does, did, done, doing.",
  have: "Irregular verb: have/has, had, had.",
  think: "Irregular verb: think-thought-thought.",
  understand: "Irregular verb: understand-understood-understood.",
  can: "Modal verb: no -s in 3rd person, often uses paraphrase in some tenses.",
  may: "Modal verb of permission/possibility.",
  must: "Modal verb of obligation; in past/future often replaced by 'have to'.",
  should: "Modal verb for advice/expectation.",
  will: "Future auxiliary; usually does not take all synthetic forms.",
  would: "Modal verb for hypotheticals/politeness; often paired with conditionals.",
  shall: "Formal modal auxiliary, mostly in questions/suggestions."
};

type VerbExampleRow = {
  spanish: string;
  usage: string;
};

const CUSTOM_EXAMPLES_ES: Record<string, VerbExampleRow[]> = {
  ser: [
    { spanish: "Yo soy profesor.", usage: "О себе: профессия или роль." },
    { spanish: "Tu eres de Madrid.", usage: "О происхождении или характеристике человека." },
    { spanish: "Ellos son muy amables.", usage: "О постоянных качествах других людей." }
  ],
  estar: [
    { spanish: "Yo estoy cansado hoy.", usage: "Временное состояние сейчас." },
    { spanish: "Nosotros estamos en casa.", usage: "Местоположение группы, включая тебя." },
    { spanish: "Ella esta tranquila.", usage: "Эмоциональное состояние третьего лица." }
  ],
  tener: [
    { spanish: "Yo tengo tiempo ahora.", usage: "Когда говоришь, что у тебя что-то есть." },
    { spanish: "Tu tienes una pregunta?", usage: "Обращение к собеседнику на ты." },
    { spanish: "Ellos tienen trabajo hoy.", usage: "Когда речь о других людях." }
  ],
  ir: [
    { spanish: "Yo voy al trabajo.", usage: "Когда ты куда-то направляешься." },
    { spanish: "Nosotros vamos juntos.", usage: "Общее действие группы." },
    { spanish: "Ellos van a clase.", usage: "Когда говоришь о планах/перемещении других." }
  ],
  poder: [
    { spanish: "Yo puedo ayudarte.", usage: "Личная возможность или способность." },
    { spanish: "Tu puedes entrar ahora.", usage: "Разрешение или возможность собеседнику." },
    { spanish: "Nosotros podemos empezar.", usage: "Возможность для группы, включая тебя." }
  ]
};

const CUSTOM_EXAMPLES_EN: Record<string, VerbExampleRow[]> = {
  do: [
    { spanish: "I do my homework every day.", usage: "О регулярном действии (Present Simple)." },
    { spanish: "She does yoga on Mondays.", usage: "3-е лицо в настоящем: does." },
    { spanish: "We did it yesterday.", usage: "Завершенное действие в прошлом." }
  ],
  be: [
    { spanish: "I am ready now.", usage: "Состояние в настоящем." },
    { spanish: "They were at home yesterday.", usage: "Состояние/место в прошлом." },
    { spanish: "She has been busy all day.", usage: "Связь прошлого результата с настоящим." }
  ],
  have: [
    { spanish: "I have a question.", usage: "Наличие чего-то в настоящем." },
    { spanish: "He had no time yesterday.", usage: "Наличие/опыт в прошлом." },
    { spanish: "We have had this car for years.", usage: "Опыт/состояние до текущего момента." }
  ],
  want: [
    { spanish: "I want to learn English faster.", usage: "Базовая форма want в настоящем времени." },
    { spanish: "She wants a quiet place to study.", usage: "Форма wants для 3-го лица единственного числа." },
    { spanish: "We wanted to leave earlier.", usage: "Форма wanted для действия в прошлом." },
    { spanish: "They have wanted this chance for years.", usage: "Форма have wanted в Present Perfect." },
    { spanish: "Wanting more practice, he joined a speaking club.", usage: "Форма wanting в роли причастного оборота." }
  ],
  can: [
    { spanish: "I can help you now.", usage: "Текущая способность или возможность." },
    { spanish: "She could swim at five.", usage: "Способность в прошлом." },
    { spanish: "They will be able to join later.", usage: "Будущая возможность через paraphrase." }
  ]
};

export interface VerbFormRow {
  person: string;
  form: string;
  usage: string;
}

export interface VerbInsight {
  note: string;
  formsByTense: Record<VerbTense, VerbFormRow[]>;
  tenseUsage: Record<VerbTense, string>;
  examples: VerbExampleRow[];
}

function normalizeVerb(infinitive: string): string {
  return infinitive.toLowerCase().trim();
}

function splitVerbPhrase(infinitive: string): { base: string; suffix: string } {
  const [base, ...rest] = normalizeVerb(infinitive).split(" ");
  return {
    base,
    suffix: rest.length > 0 ? ` ${rest.join(" ")}` : ""
  };
}

function appendSuffix(forms: VerbTuple, suffix: string): VerbTuple {
  if (!suffix) {
    return forms;
  }

  return forms.map((value) => `${value}${suffix}`) as VerbTuple;
}

function composeWithAux(aux: VerbTuple, lexical: string): VerbTuple {
  return [
    `${aux[0]} ${lexical}`,
    `${aux[1]} ${lexical}`,
    `${aux[2]} ${lexical}`,
    `${aux[3]} ${lexical}`,
    `${aux[4]} ${lexical}`
  ];
}

function buildRegularPresentEs(baseVerb: string): VerbTuple | null {
  if (baseVerb.length < 3) {
    return null;
  }

  if (baseVerb.endsWith("ar")) {
    const stem = baseVerb.slice(0, -2);
    return [`${stem}o`, `${stem}as`, `${stem}a`, `${stem}amos`, `${stem}an`];
  }

  if (baseVerb.endsWith("er")) {
    const stem = baseVerb.slice(0, -2);
    return [`${stem}o`, `${stem}es`, `${stem}e`, `${stem}emos`, `${stem}en`];
  }

  if (baseVerb.endsWith("ir")) {
    const stem = baseVerb.slice(0, -2);
    return [`${stem}o`, `${stem}es`, `${stem}e`, `${stem}imos`, `${stem}en`];
  }

  return null;
}

function buildRegularPastEs(baseVerb: string): VerbTuple | null {
  if (baseVerb.length < 3) {
    return null;
  }

  if (baseVerb.endsWith("ar")) {
    const stem = baseVerb.slice(0, -2);
    let yo = `${stem}e`;
    if (baseVerb.endsWith("car")) {
      yo = `${baseVerb.slice(0, -3)}que`;
    } else if (baseVerb.endsWith("gar")) {
      yo = `${baseVerb.slice(0, -3)}gue`;
    } else if (baseVerb.endsWith("zar")) {
      yo = `${baseVerb.slice(0, -3)}ce`;
    }

    return [yo, `${stem}aste`, `${stem}o`, `${stem}amos`, `${stem}aron`];
  }

  if (baseVerb.endsWith("er") || baseVerb.endsWith("ir")) {
    const stem = baseVerb.slice(0, -2);
    return [`${stem}i`, `${stem}iste`, `${stem}io`, `${stem}imos`, `${stem}ieron`];
  }

  return null;
}

function buildRegularImperfectEs(baseVerb: string): VerbTuple | null {
  if (baseVerb.length < 3) {
    return null;
  }

  if (baseVerb.endsWith("ar")) {
    const stem = baseVerb.slice(0, -2);
    return [`${stem}aba`, `${stem}abas`, `${stem}aba`, `${stem}abamos`, `${stem}aban`];
  }

  if (baseVerb.endsWith("er") || baseVerb.endsWith("ir")) {
    const stem = baseVerb.slice(0, -2);
    return [`${stem}ia`, `${stem}ias`, `${stem}ia`, `${stem}iamos`, `${stem}ian`];
  }

  return null;
}

function buildFutureEs(baseVerb: string): VerbTuple | null {
  if (baseVerb.length < 2) {
    return null;
  }

  const stem = IRREGULAR_FUTURE_STEM_ES[baseVerb] ?? baseVerb;
  return [`${stem}e`, `${stem}as`, `${stem}a`, `${stem}emos`, `${stem}an`];
}

function buildGerundEs(baseVerb: string): string | null {
  if (IRREGULAR_GERUND_ES[baseVerb]) {
    return IRREGULAR_GERUND_ES[baseVerb];
  }

  if (baseVerb.endsWith("ar")) {
    return `${baseVerb.slice(0, -2)}ando`;
  }

  if (baseVerb.endsWith("er") || baseVerb.endsWith("ir")) {
    return `${baseVerb.slice(0, -2)}iendo`;
  }

  return null;
}

function buildParticipleEs(baseVerb: string): string | null {
  if (IRREGULAR_PARTICIPLE_ES[baseVerb]) {
    return IRREGULAR_PARTICIPLE_ES[baseVerb];
  }

  if (baseVerb.endsWith("ar")) {
    return `${baseVerb.slice(0, -2)}ado`;
  }

  if (baseVerb.endsWith("er") || baseVerb.endsWith("ir")) {
    return `${baseVerb.slice(0, -2)}ido`;
  }

  return null;
}

function buildSpanishSimpleForms(baseVerb: string, tense: VerbTense): VerbTuple | null {
  if (tense === "present_simple") {
    return IRREGULAR_PRESENT_ES[baseVerb] ?? buildRegularPresentEs(baseVerb);
  }

  if (tense === "past_simple") {
    return IRREGULAR_PAST_ES[baseVerb] ?? buildRegularPastEs(baseVerb);
  }

  if (tense === "future_simple") {
    return buildFutureEs(baseVerb);
  }

  return null;
}

function buildSpanishFormsByTense(baseVerb: string, tense: VerbTense): VerbTuple | null {
  const simple = buildSpanishSimpleForms(baseVerb, tense);
  if (simple) {
    return simple;
  }

  if (tense === "present_continuous") {
    const gerund = buildGerundEs(baseVerb);
    const estarPresent = IRREGULAR_PRESENT_ES.estar;
    if (!gerund || !estarPresent) {
      return null;
    }
    return composeWithAux(estarPresent, gerund);
  }

  if (tense === "past_continuous") {
    const gerund = buildGerundEs(baseVerb);
    const estarPast = buildRegularImperfectEs("estar");
    if (!gerund || !estarPast) {
      return null;
    }
    return composeWithAux(estarPast, gerund);
  }

  if (tense === "present_perfect") {
    const participle = buildParticipleEs(baseVerb);
    if (!participle) {
      return null;
    }

    return composeWithAux(["he", "has", "ha", "hemos", "han"], participle);
  }

  if (tense === "past_perfect") {
    const participle = buildParticipleEs(baseVerb);
    if (!participle) {
      return null;
    }

    return composeWithAux(["habia", "habias", "habia", "habiamos", "habian"], participle);
  }

  return null;
}

function buildSpanishVerbNote(baseVerb: string): string {
  const customNote = VERB_NOTE_ES[baseVerb];
  if (customNote) {
    return customNote;
  }

  if (baseVerb.endsWith("ar")) {
    return "Регулярный глагол на -ar: формы строятся по шаблону времен и окончаний.";
  }

  if (baseVerb.endsWith("er")) {
    return "Регулярный глагол на -er: формы строятся по шаблону времен и окончаний.";
  }

  if (baseVerb.endsWith("ir")) {
    return "Регулярный глагол на -ir: формы строятся по шаблону времен и окончаний.";
  }

  return "Спряжение по лицам в основных временах.";
}

function normalizeEnglishVerb(infinitive: string): string | null {
  const raw = infinitive.toLowerCase().trim().replace(/[?!.,]+$/g, "");
  const withoutTo = raw.startsWith("to ") ? raw.slice(3).trim() : raw;
  const aliased = EN_BASE_ALIAS[withoutTo] ?? withoutTo;

  if (!aliased || aliased.includes(" ")) {
    return null;
  }

  return aliased;
}

function isConsonant(char: string): boolean {
  return /[bcdfghjklmnpqrstvwxyz]/i.test(char);
}

function isCvc(word: string): boolean {
  if (word.length < 3) {
    return false;
  }

  const a = word[word.length - 3];
  const b = word[word.length - 2];
  const c = word[word.length - 1];
  const isVowel = (value: string) => /[aeiou]/i.test(value);

  return isConsonant(a) && isVowel(b) && isConsonant(c) && !/[wxy]/i.test(c);
}

function toThirdPerson(baseVerb: string): string {
  if (baseVerb.endsWith("y") && baseVerb.length > 1 && isConsonant(baseVerb[baseVerb.length - 2])) {
    return `${baseVerb.slice(0, -1)}ies`;
  }

  if (/(s|sh|ch|x|z|o)$/i.test(baseVerb)) {
    return `${baseVerb}es`;
  }

  return `${baseVerb}s`;
}

function toRegularPast(baseVerb: string): string {
  if (baseVerb.endsWith("e")) {
    return `${baseVerb}d`;
  }

  if (baseVerb.endsWith("y") && baseVerb.length > 1 && isConsonant(baseVerb[baseVerb.length - 2])) {
    return `${baseVerb.slice(0, -1)}ied`;
  }

  if (isCvc(baseVerb)) {
    const last = baseVerb[baseVerb.length - 1];
    return `${baseVerb}${last}ed`;
  }

  return `${baseVerb}ed`;
}

function toGerund(baseVerb: string): string {
  if (baseVerb === "be") {
    return "being";
  }

  if (baseVerb === "have") {
    return "having";
  }

  if (baseVerb.endsWith("ie")) {
    return `${baseVerb.slice(0, -2)}ying`;
  }

  if (baseVerb.endsWith("e") && !baseVerb.endsWith("ee")) {
    return `${baseVerb.slice(0, -1)}ing`;
  }

  if (isCvc(baseVerb)) {
    const last = baseVerb[baseVerb.length - 1];
    return `${baseVerb}${last}ing`;
  }

  return `${baseVerb}ing`;
}

function toParticiple(baseVerb: string): string {
  return EN_IRREGULAR_PARTICIPLE[baseVerb] ?? toRegularPast(baseVerb);
}

function fillSame(value: string): VerbTuple {
  return [value, value, value, value, value];
}

function buildEnglishSimpleForms(baseVerb: string, tense: VerbTense): VerbTuple | null {
  if (tense === "present_simple") {
    if (EN_IRREGULAR_PRESENT[baseVerb]) {
      return EN_IRREGULAR_PRESENT[baseVerb];
    }

    return [baseVerb, baseVerb, toThirdPerson(baseVerb), baseVerb, baseVerb];
  }

  if (tense === "past_simple") {
    if (EN_IRREGULAR_PAST[baseVerb]) {
      return EN_IRREGULAR_PAST[baseVerb];
    }

    return fillSame(toRegularPast(baseVerb));
  }

  if (tense === "future_simple") {
    if (baseVerb === "will") {
      return fillSame("will");
    }

    if (baseVerb === "would" || baseVerb === "shall" || baseVerb === "should") {
      return fillSame(baseVerb);
    }

    if (EN_MODAL_SET.has(baseVerb)) {
      const futureLexeme = EN_MODAL_FUTURE_BASE[baseVerb] ?? baseVerb;
      return fillSame(`will ${futureLexeme}`);
    }

    return fillSame(`will ${baseVerb}`);
  }

  return null;
}

function buildEnglishFormsByTense(baseVerb: string, tense: VerbTense): VerbTuple | null {
  const simple = buildEnglishSimpleForms(baseVerb, tense);
  if (simple) {
    return simple;
  }

  if (EN_MODAL_SET.has(baseVerb)) {
    return fillSame("-");
  }

  if (tense === "present_continuous") {
    const gerund = toGerund(baseVerb);
    return composeWithAux(EN_IRREGULAR_PRESENT.be, gerund);
  }

  if (tense === "past_continuous") {
    const gerund = toGerund(baseVerb);
    return composeWithAux(EN_IRREGULAR_PAST.be, gerund);
  }

  if (tense === "present_perfect") {
    const participle = toParticiple(baseVerb);
    return composeWithAux(EN_IRREGULAR_PRESENT.have, participle);
  }

  if (tense === "past_perfect") {
    const participle = toParticiple(baseVerb);
    return composeWithAux(fillSame("had"), participle);
  }

  return null;
}

function buildEnglishVerbNote(baseVerb: string): string {
  const custom = VERB_NOTE_EN[baseVerb];
  if (custom) {
    return custom;
  }

  if (baseVerb.endsWith("e") || baseVerb.endsWith("y")) {
    return "Regular verb: use -s in 3rd person, -ed in past, -ing for continuous forms.";
  }

  return "Regular verb: use standard patterns for Simple, Continuous and Perfect tenses.";
}

function buildDefaultExamplesSpanish(forms: VerbTuple): VerbExampleRow[] {
  return [
    { spanish: `Yo ${forms[0]} hoy.`, usage: "Когда говоришь о себе сейчас." },
    { spanish: `Tu ${forms[1]} cada dia.`, usage: "Когда обращаешься к собеседнику на ты." },
    { spanish: `El/Ella ${forms[2]} ahora.`, usage: "Когда говоришь о третьем лице." },
    { spanish: `Nosotros ${forms[3]} juntos.`, usage: "Когда действие делает группа, включая тебя." },
    { spanish: `Ellos ${forms[4]} en clase.`, usage: "Когда речь о других людях." }
  ];
}

function buildDefaultExamplesEnglish(forms: VerbTuple): VerbExampleRow[] {
  return [
    { spanish: `I ${forms[0]} this every day.`, usage: "Базовый пример для I в Present Simple." },
    { spanish: `You ${forms[1]} this very well.`, usage: "Базовый пример для you." },
    { spanish: `He/She ${forms[2]} this at work.`, usage: "Ключевая форма 3-го лица единственного числа." },
    { spanish: `We ${forms[3]} this together.`, usage: "Базовый пример для we." },
    { spanish: `They ${forms[4]} this at school.`, usage: "Базовый пример для they." }
  ];
}

function buildRows(forms: VerbTuple, rows: readonly PersonRow[]): VerbFormRow[] {
  return rows.map((row, index) => ({
    person: row.label,
    form: forms[index],
    usage: row.usage
  }));
}

function getSpanishVerbInsight(infinitive: string): VerbInsight | null {
  const { base, suffix } = splitVerbPhrase(infinitive);
  if (!base) {
    return null;
  }

  const formsByTense = {} as Record<VerbTense, VerbFormRow[]>;

  for (const tense of VERB_TENSE_OPTIONS) {
    const forms = buildSpanishFormsByTense(base, tense);
    if (!forms) {
      return null;
    }

    formsByTense[tense] = buildRows(appendSuffix(forms, suffix), PERSON_ROWS_ES);
  }

  const presentForms = buildSpanishFormsByTense(base, "present_simple");
  if (!presentForms) {
    return null;
  }

  const examples = CUSTOM_EXAMPLES_ES[base] ?? buildDefaultExamplesSpanish(appendSuffix(presentForms, suffix));

  return {
    note: buildSpanishVerbNote(base),
    formsByTense,
    tenseUsage: TENSE_USAGE_ES,
    examples
  };
}

function getEnglishVerbInsight(infinitive: string): VerbInsight | null {
  const base = normalizeEnglishVerb(infinitive);
  if (!base) {
    return null;
  }

  const formsByTense = {} as Record<VerbTense, VerbFormRow[]>;

  for (const tense of VERB_TENSE_OPTIONS) {
    const forms = buildEnglishFormsByTense(base, tense);
    if (!forms) {
      return null;
    }

    formsByTense[tense] = buildRows(forms, PERSON_ROWS_EN);
  }

  const presentForms = buildEnglishFormsByTense(base, "present_simple");
  if (!presentForms) {
    return null;
  }

  const examples = CUSTOM_EXAMPLES_EN[base] ?? buildDefaultExamplesEnglish(presentForms);

  return {
    note: buildEnglishVerbNote(base),
    formsByTense,
    tenseUsage: TENSE_USAGE_EN,
    examples
  };
}

export function getVerbInsight(infinitive: string, language: LearningLanguage = "es"): VerbInsight | null {
  if (language === "en") {
    return getEnglishVerbInsight(infinitive);
  }

  return getSpanishVerbInsight(infinitive);
}
