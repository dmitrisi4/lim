import type { SlideModule } from "~/slides/core/types";

export const travelVocabularyModule: SlideModule = {
  meta: {
    id: "vocabulary.travel",
    title: "Travel Vocabulary",
    description: "Слова и фразы для путешествий",
    level: "a1",
    category: "vocabulary",
    ruleTags: ["travel", "airport", "booking"]
  },
  cards: [
    {
      id: "travel-phrases",
      type: "carousel",
      title: "Полезные фразы в аэропорту",
      description: "Запомни основные выражения.",
      payload: {
        slides: ["Where is gate B12?", "I have a connecting flight.", "Could I have a window seat?"]
      },
      reward: { xp: 12 }
    },
    {
      id: "quiz-boarding-pass",
      type: "quiz",
      title: "Понимание travel-лексики",
      description: "Выбери правильный перевод.",
      interaction: {
        prompt: "What does 'boarding pass' mean?",
        options: ["багажная лента", "посадочный талон", "стойка регистрации"],
        correctAnswer: "посадочный талон"
      },
      reward: { xp: 18 }
    },
    {
      id: "airport-signs",
      type: "match",
      title: "Навигация в аэропорту",
      description: "Соотнеси фразу и нужную зону.",
      interaction: {
        prompt: "You need to drop your suitcase. Where do you go?",
        options: ["Security check", "Baggage drop", "Boarding gate"],
        correctAnswer: "Baggage drop"
      },
      reward: { xp: 20 }
    },
    {
      id: "hotel-check-in",
      type: "mini_game",
      title: "Фраза на ресепшене",
      description: "Выбери лучший вариант для check-in.",
      interaction: {
        prompt: "You arrive at the hotel. What do you say first?",
        options: [
          "I need my room immediately.",
          "I have a reservation under Ivan Petrov.",
          "Where is breakfast and why late?"
        ],
        correctAnswer: "I have a reservation under Ivan Petrov."
      },
      reward: { xp: 24 }
    }
  ]
};
