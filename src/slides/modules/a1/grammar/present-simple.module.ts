import type { SlideModule } from "~/slides/core/types";

export const presentSimpleModule: SlideModule = {
  meta: {
    id: "grammar.present-simple",
    title: "Present Simple",
    description: "Базовые правила настоящего времени",
    level: "a1",
    category: "grammar",
    ruleTags: ["present_simple", "affirmative", "questions"]
  },
  cards: [
    {
      id: "rules-overview",
      type: "carousel",
      title: "Present Simple: быстрый обзор",
      description: "Формула и сигналы времени для A1.",
      payload: {
        slides: ["I/You/We/They + verb", "He/She/It + verb + s", "Do/Does для вопросов"]
      },
      reward: { xp: 12 }
    },
    {
      id: "quiz-he-s",
      type: "quiz",
      title: "Выбери верное предложение",
      description: "Проверь правило -s для he/she/it.",
      interaction: {
        prompt: "Choose the correct sentence:",
        options: ["She go to school every day.", "She goes to school every day.", "She going to school every day."],
        correctAnswer: "She goes to school every day."
      },
      reward: { xp: 20 }
    },
    {
      id: "match-does",
      type: "match",
      title: "Do или Does?",
      description: "Подбери правильный вспомогательный глагол.",
      interaction: {
        prompt: "Complete the question:",
        options: ["Does he like coffee?", "Do he like coffee?", "Is he like coffee?"],
        correctAnswer: "Does he like coffee?"
      },
      reward: { xp: 22 }
    },
    {
      id: "negative-form",
      type: "mini_game",
      title: "Сделай отрицание",
      description: "Построй отрицательное предложение в Present Simple.",
      interaction: {
        prompt: "Convert to negative: 'They play tennis on Sundays.'",
        options: [
          "They not play tennis on Sundays.",
          "They do not play tennis on Sundays.",
          "They does not play tennis on Sundays."
        ],
        correctAnswer: "They do not play tennis on Sundays."
      },
      reward: { xp: 24 }
    },
    {
      id: "frequency-adverbs",
      type: "quiz",
      title: "Adverbs of frequency",
      description: "Выбери естественный порядок слов.",
      interaction: {
        prompt: "Choose the best sentence:",
        options: ["I always am late.", "I am always late.", "Always I am late."],
        correctAnswer: "I am always late."
      },
      reward: { xp: 21 }
    }
  ]
};
