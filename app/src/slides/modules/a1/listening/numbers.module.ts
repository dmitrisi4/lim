import type { SlideModule } from "~/slides/core/types";

export const listeningNumbersModule: SlideModule = {
  meta: {
    id: "listening.numbers-time",
    title: "Listening: Numbers & Time",
    description: "Понимание чисел и времени на слух",
    level: "a1",
    category: "listening",
    ruleTags: ["listening", "numbers", "time"]
  },
  cards: [
    {
      id: "video-time-phrases",
      type: "video",
      title: "How to say time in English",
      description: "Слушай и повторяй: quarter past, half past, quarter to.",
      payload: {
        mediaUrl: "mock://audio/time-phrases-a1"
      },
      reward: { xp: 10 }
    },
    {
      id: "quiz-time-choice",
      type: "quiz",
      title: "Понимание времени",
      description: "Проверь понимание фразы на слух.",
      interaction: {
        prompt: "'It's quarter to seven' means:",
        options: ["6:45", "7:15", "7:45"],
        correctAnswer: "6:45"
      },
      reward: { xp: 17 }
    },
    {
      id: "phone-number-listening",
      type: "quiz",
      title: "Понимание чисел на слух",
      description: "Выбери номер, который диктует спикер.",
      interaction: {
        prompt: "You hear: 'double three, nine oh five'. Choose the number:",
        options: ["33905", "33095", "33950"],
        correctAnswer: "33905"
      },
      reward: { xp: 20 }
    },
    {
      id: "time-routine-audio",
      type: "match",
      title: "Когда это происходит?",
      description: "Сопоставь фразу и время.",
      interaction: {
        prompt: "You hear: 'The class starts at half past eight.'",
        options: ["8:15", "8:30", "9:30"],
        correctAnswer: "8:30"
      },
      reward: { xp: 22 }
    }
  ]
};
