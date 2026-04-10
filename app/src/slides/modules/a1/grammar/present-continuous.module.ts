import type { SlideModule } from "~/slides/core/types";

export const presentContinuousModule: SlideModule = {
  meta: {
    id: "grammar.present-continuous",
    title: "Present Continuous",
    description: "Действия, происходящие прямо сейчас",
    level: "a1",
    category: "grammar",
    ruleTags: ["present_continuous", "am_is_are", "ing_form"]
  },
  cards: [
    {
      id: "present-continuous-overview",
      type: "carousel",
      title: "Present Continuous: быстрый обзор",
      description: "Формула для действий, происходящих прямо сейчас.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Formula: am/is/are + verb + -ing||Подлежащее + вспомогательный глагол + основной глагол",
          "I am reading a book right now.||Я сейчас читаю книгу",
          "She is cooking dinner.||Она готовит ужин (сейчас)",
          "They are watching a film.||Они смотрят фильм",
          "Signals: now, right now, at the moment, look! listen!||Маркеры настоящего длительного",
          "Negative: I am not sleeping. She is not working.||Отрицание: am/is/are + not",
          "Question: Are you listening? Is he coming?||Вопрос: am/is/are ставим перед подлежащим"
        ]
      },
      reward: { xp: 13 }
    },
    {
      id: "quiz-is-reading",
      type: "quiz",
      title: "Выбери правильную форму",
      description: "Проверь правило is + -ing для he/she/it.",
      interaction: {
        prompt: "Choose the correct sentence:",
        options: [
          "She is reading a book.",
          "She reading a book.",
          "She reads a book now."
        ],
        correctAnswer: "She is reading a book."
      },
      reward: { xp: 20 }
    },
    {
      id: "match-am-is-are",
      type: "match",
      title: "am / is / are",
      description: "Подбери правильный вспомогательный глагол.",
      interaction: {
        prompt: "They ___ playing football in the park.",
        options: [
          "are||Верно: they + are",
          "is||Это для he/she/it",
          "am||Это только для I"
        ],
        correctAnswer: "are"
      },
      reward: { xp: 22 }
    },
    {
      id: "quiz-negative-continuous",
      type: "quiz",
      title: "Отрицание в Present Continuous",
      description: "Построй правильное отрицание.",
      interaction: {
        prompt: "Make it negative: 'He is sleeping.'",
        options: [
          "He is not sleeping.",
          "He not sleeping.",
          "He does not sleeping."
        ],
        correctAnswer: "He is not sleeping."
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-present-vs-continuous",
      type: "mini_game",
      title: "Present Simple vs Continuous",
      description: "Определи нужное время по контексту.",
      interaction: {
        prompt: "Right now I ___ (listen) to music.",
        options: [
          "am listening||Верно: действие прямо сейчас",
          "listen||Present Simple — для привычки",
          "listening||Пропущен вспомогательный глагол"
        ],
        correctAnswer: "am listening"
      },
      reward: { xp: 25 }
    }
  ]
};
