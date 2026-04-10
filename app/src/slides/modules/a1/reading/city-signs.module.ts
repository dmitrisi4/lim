import type { SlideModule } from "~/slides/core/types";

export const citySignsReadingModule: SlideModule = {
  meta: {
    id: "reading.city-signs",
    title: "Reading: City Signs",
    description: "Понимание коротких табличек и уведомлений",
    level: "a1",
    category: "reading",
    ruleTags: ["reading_signs", "public_notices", "basic_comprehension"]
  },
  cards: [
    {
      id: "signs-overview",
      type: "carousel",
      title: "Частые таблички",
      description: "Слова, которые часто встречаются в городе.",
      payload: {
        slides: ["Entrance", "Exit", "Closed", "No smoking", "Staff only"]
      },
      reward: { xp: 10 }
    },
    {
      id: "quiz-no-smoking",
      type: "quiz",
      title: "Понимание предупреждения",
      description: "Определи значение знака.",
      interaction: {
        prompt: "What does 'No smoking' mean?",
        options: ["You can smoke here", "Smoking is not allowed", "Only staff can smoke"],
        correctAnswer: "Smoking is not allowed"
      },
      reward: { xp: 17 }
    },
    {
      id: "match-direction",
      type: "match",
      title: "Ориентация по табличкам",
      description: "Выбери табличку, которая ведет наружу.",
      interaction: {
        prompt: "You want to leave the building. Which sign helps?",
        options: ["Exit", "Entrance", "Staff only"],
        correctAnswer: "Exit"
      },
      reward: { xp: 20 }
    },
    {
      id: "mini-notice",
      type: "mini_game",
      title: "Короткое объявление",
      description: "Понять смысл объявления в 1 строку.",
      interaction: {
        prompt: "Notice: 'Library closes at 6 p.m.'",
        options: ["The library opens at 6 p.m.", "The library is open all night.", "The library stops working at 6 p.m."],
        correctAnswer: "The library stops working at 6 p.m."
      },
      reward: { xp: 23 }
    }
  ]
};
