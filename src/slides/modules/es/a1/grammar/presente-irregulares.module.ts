import type { SlideModule } from "~/slides/core/types";

export const presenteIrregularesModule: SlideModule = {
  meta: {
    id: "es.grammar.presente-irregulares",
    title: "Presente: Querer y Poder",
    description: "Частые отклоняющиеся глаголы в Presente de Indicativo",
    level: "a1",
    category: "grammar",
    ruleTags: ["presente", "querer", "poder", "irregular_verbs"]
  },
  cards: [
    {
      id: "querer-poder-overview",
      type: "carousel",
      title: "Cambio de raiz (e -> ie, o -> ue)",
      description:
        "Regla = спряжение в Presente по лицам (не по роду). Ejemplos = готовые фразы в реальном контексте.",
      payload: {
        focusMode: "rule_examples",
        ruleSlidesCount: 3,
        slides: [
          "Marco: Presente de indicativo. Cambia por persona gramatical (yo/tu/el/nosotros/ellos), no por genero.||Это изменение по лицам, а не по роду",
          "Querer: quiero, quieres, quiere, queremos, quieren.||e -> ie (кроме nosotros)",
          "Poder: puedo, puedes, puede, podemos, pueden.||o -> ue (кроме nosotros)",
          "Quiero aprender espanol.||Я хочу учить испанский",
          "No puedo venir hoy.||Я не могу прийти сегодня",
          "Nosotros queremos / podemos.||Форма nosotros без изменения корня",
          "Quieres tomar cafe?||Ты хочешь выпить кофе?",
          "Podemos hablar despues?||Мы можем поговорить позже?",
          "No quieren estudiar hoy.||Они не хотят учиться сегодня"
        ]
      },
      reward: { xp: 14 }
    },
    {
      id: "quiz-quiero",
      type: "quiz",
      title: "Uso de querer",
      description: "Выбери правильную форму для yo.",
      interaction: {
        prompt: "Yo ___ cafe.||Я хочу кофе",
        options: [
          "quiero||Верно: yo quiero",
          "queremos||Форма nosotros",
          "querie||Неверная форма"
        ],
        correctAnswer: "quiero"
      },
      reward: { xp: 20 }
    },
    {
      id: "quiz-pueden",
      type: "quiz",
      title: "Uso de poder",
      description: "Подбери форму для ellos.",
      interaction: {
        prompt: "Ellos ___ estudiar manana.||Они могут учиться завтра",
        options: [
          "pueden||Верно: ellos + pueden",
          "podemos||Форма nosotros",
          "puedo||Форма yo"
        ],
        correctAnswer: "pueden"
      },
      reward: { xp: 21 }
    },
    {
      id: "match-nosotros-sin-cambio",
      type: "match",
      title: "Forma nosotros",
      description: "Проверь главное исключение в этих глаголах.",
      interaction: {
        prompt: "Nosotros ___ venir hoy.||Мы можем прийти сегодня",
        options: [
          "podemos||Верно: без смены корня",
          "puedemos||Неверная форма",
          "pueden||Форма ellos"
        ],
        correctAnswer: "podemos"
      },
      reward: { xp: 22 }
    },
    {
      id: "mini-quiero-viajar",
      type: "mini_game",
      title: "Plan personal con querer",
      description: "Выбери естественную фразу для выражения желания.",
      interaction: {
        prompt: "Quieres hablar de un deseo personal.||Нужно сказать о своем желании",
        options: [
          "Quiero viajar a Madrid en verano.||Верно",
          "Querer viajo a Madrid.||Неверная структура",
          "Yo puedo a Madrid verano.||Неверный смысл и форма"
        ],
        correctAnswer: "Quiero viajar a Madrid en verano."
      },
      reward: { xp: 24 }
    },
    {
      id: "quiz-no-puedo",
      type: "quiz",
      title: "Negacion con poder",
      description: "Отработка отрицания в бытовом диалоге.",
      interaction: {
        prompt: "Hoy no ___ salir, estoy ocupado.||Сегодня не могу выйти, занят",
        options: [
          "puedo||Верно",
          "podemos||Форма nosotros",
          "pueden||Форма ellos"
        ],
        correctAnswer: "puedo"
      },
      reward: { xp: 25 }
    }
  ]
};
