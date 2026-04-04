import type { SlideModule } from "~/slides/core/types";

export const canModalModule: SlideModule = {
  meta: {
    id: "grammar.can-modal",
    title: "Can: Ability & Permission",
    description: "Модальный глагол can для выражения умений и разрешения",
    level: "a1",
    category: "grammar",
    ruleTags: ["can", "modal_verbs", "ability", "permission"]
  },
  cards: [
    {
      id: "can-overview",
      type: "carousel",
      title: "Can — умение и разрешение",
      description: "Формула и ключевые применения can на уровне A1.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Formula: subject + can + base verb (no -s, no -ing).||После can всегда инфинитив без to",
          "Ability: I can swim. She can speak French.||Я умею плавать. Она говорит по-французски",
          "Permission: Can I open the window?||Можно я открою окно?",
          "Negative: I can't drive. He cannot come today.||Отрицание: can't / cannot",
          "Question: Can you help me?||Вопрос: Can + подлежащее + инфинитив",
          "Short answers: Yes, I can. / No, I can't.||Короткие ответы",
          "Can stays the same for all persons: I/you/he/she/we/they can.||Can не изменяется по лицам"
        ]
      },
      reward: { xp: 13 }
    },
    {
      id: "quiz-can-form",
      type: "quiz",
      title: "Правильная форма с can",
      description: "Выбери грамматически верное предложение.",
      interaction: {
        prompt: "Choose the correct sentence:",
        options: [
          "She can speaks Spanish.",
          "She can speak Spanish.",
          "She cans speak Spanish."
        ],
        correctAnswer: "She can speak Spanish."
      },
      reward: { xp: 20 }
    },
    {
      id: "match-cant",
      type: "match",
      title: "Отрицание с can",
      description: "Составь отрицание с правильной формой.",
      interaction: {
        prompt: "I ___ ride a bike.",
        options: [
          "can't||Верно: отрицание can",
          "don't can||Нельзя использовать do с can",
          "am not||Am not — для to be, не для can"
        ],
        correctAnswer: "can't"
      },
      reward: { xp: 22 }
    },
    {
      id: "quiz-can-question",
      type: "quiz",
      title: "Вопрос с can",
      description: "Как спросить разрешение правильно?",
      interaction: {
        prompt: "You want to ask: 'Is it okay to use your pen?'",
        options: [
          "Can I use your pen?||Верно",
          "Do I can use your pen?||Нельзя do + can",
          "I can use your pen?"
        ],
        correctAnswer: "Can I use your pen?"
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-can-context",
      type: "mini_game",
      title: "Расскажи об умениях",
      description: "Выбери естественную фразу об умениях.",
      interaction: {
        prompt: "Your friend asks what you do for fun. You want to mention a skill.",
        options: [
          "I can play the guitar a little.",
          "I am can play the guitar.",
          "I can to play guitar."
        ],
        correctAnswer: "I can play the guitar a little."
      },
      reward: { xp: 24 }
    }
  ]
};
