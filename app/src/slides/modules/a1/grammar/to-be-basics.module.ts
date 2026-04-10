import type { SlideModule } from "~/slides/core/types";

export const toBeBasicsModule: SlideModule = {
  meta: {
    id: "grammar.to-be-basics",
    title: "Verb To Be Basics",
    description: "Базовое использование am/is/are для A1",
    level: "a1",
    category: "grammar",
    ruleTags: ["to_be", "pronouns", "negatives", "questions"]
  },
  cards: [
    {
      id: "to-be-overview",
      type: "carousel",
      title: "am/is/are: короткая схема",
      description: "Связка местоимений и формы to be.",
      payload: {
        slides: [
          "I am, you are, he/she/it is",
          "we are, you are, they are",
          "Negative: am not / is not / are not"
        ]
      },
      reward: { xp: 11 }
    },
    {
      id: "quiz-am-is-are",
      type: "quiz",
      title: "Выбери правильную форму",
      description: "Потренируй базовые формы to be.",
      interaction: {
        prompt: "My brother ___ a student.",
        options: ["am", "is", "are"],
        correctAnswer: "is"
      },
      reward: { xp: 18 }
    },
    {
      id: "question-order",
      type: "match",
      title: "Порядок слов в вопросе",
      description: "Собери корректный вопрос.",
      interaction: {
        prompt: "Choose the correct question:",
        options: ["You are from Spain?", "Are you from Spain?", "Do you are from Spain?"],
        correctAnswer: "Are you from Spain?"
      },
      reward: { xp: 22 }
    },
    {
      id: "short-answers",
      type: "mini_game",
      title: "Short answers",
      description: "Выбери корректный краткий ответ.",
      interaction: {
        prompt: "Question: 'Is she your teacher?'",
        options: ["Yes, she is.", "Yes, she does.", "Yes, she be."],
        correctAnswer: "Yes, she is."
      },
      reward: { xp: 23 }
    }
  ]
};
