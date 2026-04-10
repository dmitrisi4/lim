import type { SlideModule } from "~/slides/core/types";

export const dailyRoutineVocabularyModule: SlideModule = {
  meta: {
    id: "vocabulary.daily-routine",
    title: "Daily Routine Vocabulary",
    description: "Базовые слова и фразы про ежедневные действия",
    level: "a1",
    category: "vocabulary",
    ruleTags: ["daily_routine", "time_markers", "everyday_verbs"]
  },
  cards: [
    {
      id: "routine-verbs",
      type: "carousel",
      title: "Everyday verbs",
      description: "Лексика для описания рутины.",
      payload: {
        slides: ["wake up", "have breakfast", "go to work", "do homework", "go to bed"]
      },
      reward: { xp: 12 }
    },
    {
      id: "quiz-time-marker",
      type: "quiz",
      title: "Время дня",
      description: "Подбери подходящий маркер времени.",
      interaction: {
        prompt: "I drink coffee ___ the morning.",
        options: ["on", "in", "at"],
        correctAnswer: "in"
      },
      reward: { xp: 19 }
    },
    {
      id: "routine-sequence",
      type: "match",
      title: "Логика распорядка",
      description: "Выбери действие, которое обычно идет первым.",
      interaction: {
        prompt: "What do people usually do first?",
        options: ["go to bed", "wake up", "eat dinner"],
        correctAnswer: "wake up"
      },
      reward: { xp: 20 }
    },
    {
      id: "busy-day-mini",
      type: "mini_game",
      title: "Собери фразу о дне",
      description: "Выбери наиболее естественный вариант.",
      interaction: {
        prompt: "Choose the best sentence:",
        options: [
          "I have lunch usually at one.",
          "I usually have lunch at one.",
          "Usually at one have I lunch."
        ],
        correctAnswer: "I usually have lunch at one."
      },
      reward: { xp: 24 }
    }
  ]
};
