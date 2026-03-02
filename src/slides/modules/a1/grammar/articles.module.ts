import type { SlideModule } from "~/slides/core/types";

export const articlesModule: SlideModule = {
  meta: {
    id: "grammar.articles",
    title: "Articles a/an/the",
    description: "Артикли для существительных",
    level: "a1",
    category: "grammar",
    ruleTags: ["articles", "a_an", "the"]
  },
  cards: [
    {
      id: "articles-rules",
      type: "carousel",
      title: "Когда использовать a/an/the",
      description: "Мини-шпаргалка по артиклям.",
      payload: {
        slides: ["a/an: first mention", "the: specific noun", "an: before vowel sound"]
      },
      reward: { xp: 11 }
    },
    {
      id: "quiz-article-choice",
      type: "quiz",
      title: "Выбери артикль",
      description: "Заполни пропуск в предложении.",
      interaction: {
        prompt: "I saw ___ interesting movie yesterday.",
        options: ["a", "an", "the"],
        correctAnswer: "an"
      },
      reward: { xp: 19 }
    },
    {
      id: "match-specific-noun",
      type: "match",
      title: "Определи: a/an или the",
      description: "Выбери вариант, когда говорим о конкретном объекте.",
      interaction: {
        prompt: "Which sentence is correct?",
        options: [
          "Can you open window, please?",
          "Can you open a window, please?",
          "Can you open the window, please?"
        ],
        correctAnswer: "Can you open the window, please?"
      },
      reward: { xp: 23 }
    },
    {
      id: "zero-article-basics",
      type: "quiz",
      title: "Нужен ли артикль?",
      description: "Проверь базовый случай с обобщениями.",
      interaction: {
        prompt: "I like ___ music.",
        options: ["a", "the", "— (no article)"],
        correctAnswer: "— (no article)"
      },
      reward: { xp: 20 }
    }
  ]
};
