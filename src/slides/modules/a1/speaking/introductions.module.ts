import type { SlideModule } from "~/slides/core/types";

export const introductionsSpeakingModule: SlideModule = {
  meta: {
    id: "speaking.introductions",
    title: "Introductions",
    description: "Базовые сценарии знакомства и самопрезентации",
    level: "a1",
    category: "speaking",
    ruleTags: ["introductions", "personal_info", "greetings"]
  },
  cards: [
    {
      id: "intro-lines",
      type: "carousel",
      title: "Фразы для знакомства",
      description: "Короткие формулы вежливого старта диалога.",
      payload: {
        slides: [
          "Hi, my name is Anna.",
          "Nice to meet you.",
          "I'm from Ukraine.",
          "I work as a designer."
        ]
      },
      reward: { xp: 11 }
    },
    {
      id: "ask-name",
      type: "quiz",
      title: "Как спросить имя",
      description: "Выбери корректный вежливый вопрос.",
      interaction: {
        prompt: "Choose the best question:",
        options: ["How are called you?", "What's your name?", "Who name you?"],
        correctAnswer: "What's your name?"
      },
      reward: { xp: 18 }
    },
    {
      id: "introduce-yourself",
      type: "mini_game",
      title: "Ответь естественно",
      description: "Выбери лучшую самопрезентацию для A1.",
      interaction: {
        prompt: "New colleague: 'Tell me a bit about yourself.'",
        options: [
          "I am Katya. I live in Lviv and I like photography.",
          "Identity details are unavailable.",
          "Myself person from city."
        ],
        correctAnswer: "I am Katya. I live in Lviv and I like photography."
      },
      reward: { xp: 24 }
    }
  ]
};
