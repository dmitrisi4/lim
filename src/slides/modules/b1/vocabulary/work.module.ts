import type { SlideModule } from "~/slides/core/types";

export const workVocabularyModule: SlideModule = {
  meta: {
    id: "vocabulary.workplace",
    title: "Workplace English",
    description: "Лексика для рабочих ситуаций",
    level: "b1",
    category: "vocabulary",
    ruleTags: ["work", "meeting", "email"]
  },
  cards: [
    {
      id: "meeting-words",
      type: "carousel",
      title: "Meeting vocabulary",
      description: "Ключевые слова для рабочих встреч.",
      payload: {
        slides: ["agenda", "deadline", "follow-up", "action items"]
      },
      reward: { xp: 14 }
    },
    {
      id: "match-email-tone",
      type: "match",
      title: "Email tone",
      description: "Выбери наиболее вежливый вариант.",
      interaction: {
        prompt: "Which sentence sounds most professional?",
        options: ["Send it ASAP.", "Could you please send it by Friday?", "You must send it now."],
        correctAnswer: "Could you please send it by Friday?"
      },
      reward: { xp: 24 }
    }
  ]
};
