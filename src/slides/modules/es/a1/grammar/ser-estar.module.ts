import type { SlideModule } from "~/slides/core/types";

export const serEstarModule: SlideModule = {
  meta: {
    id: "es.grammar.ser-estar",
    title: "Ser y Estar",
    description: "Uso basico de ser y estar para nivel A1",
    level: "a1",
    category: "grammar",
    ruleTags: ["ser_estar", "pronouns", "questions"]
  },
  cards: [
    {
      id: "ser-estar-overview",
      type: "carousel",
      title: "Ser y Estar: resumen rapido",
      description: "Regla principal con ejemplos reales para A1.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Identidad permanente: Yo soy estudiante.||Я студент (постоянная характеристика)",
          "Lugar/estado temporal: Yo estoy en casa.||Я дома (текущее состояние/место)",
          "Origen: Nosotros somos de Mexico.||Мы из Мексики",
          "Estado emocional: Ella esta cansada hoy.||Сегодня она устала",
          "Pregunta: Eres nuevo aqui? / Estas bien?||Сравни: кто ты? и как ты сейчас?"
        ]
      },
      reward: { xp: 12 }
    },
    {
      id: "quiz-yo-estoy",
      type: "quiz",
      title: "Completa la frase con contexto",
      description: "Hay dos opciones similares, busca la regla correcta.",
      interaction: {
        prompt: "Yo ___ en casa ahora.||Сейчас я дома",
        options: [
          "soy||Неверно: 'ser' не используем для места сейчас",
          "estoy||Верно: местоположение сейчас",
          "es||Неверно: форма для el/ella/usted"
        ],
        correctAnswer: "estoy"
      },
      reward: { xp: 19 }
    },
    {
      id: "match-nosotros-somos",
      type: "match",
      title: "Ser para origen e identidad",
      description: "Подбери правильную связку для происхождения.",
      interaction: {
        prompt: "Nosotros ___ de Mexico.||Мы из Мексики",
        options: [
          "somos||Верно: происхождение",
          "estamos||Неверно: это временное состояние",
          "son||Неверно: форма для ellos/ellas"
        ],
        correctAnswer: "somos"
      },
      reward: { xp: 22 }
    },
    {
      id: "mini-ella-esta",
      type: "mini_game",
      title: "Estado temporal del dia",
      description: "Если состояние меняется, обычно берем 'estar'.",
      interaction: {
        prompt: "Ella ___ cansada hoy.||Сегодня она устала",
        options: [
          "es||Неверно: 'ser' про постоянные характеристики",
          "esta||Верно: временное состояние",
          "son||Неверно: множественное число"
        ],
        correctAnswer: "esta"
      },
      reward: { xp: 24 }
    },
    {
      id: "ser-estar-double-choice",
      type: "quiz",
      title: "Ser o Estar en una mini historia",
      description: "Выбери правильный вариант для каждого контекста.",
      interaction: {
        prompt: "Mi hermana ___ medico, pero hoy ___ enferma.||Сестра врач, но сегодня болеет",
        options: [
          "es / esta||Верно: профессия + временное состояние",
          "esta / es||Порядок наоборот",
          "es / es||Второе слово должно быть 'esta'"
        ],
        correctAnswer: "es / esta"
      },
      reward: { xp: 26 }
    }
  ]
};
