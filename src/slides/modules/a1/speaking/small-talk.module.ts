import type { SlideModule } from "~/slides/core/types";

export const smallTalkModule: SlideModule = {
  meta: {
    id: "speaking.small-talk",
    title: "Small Talk",
    description: "Короткие разговорные сценарии",
    level: "a1",
    category: "speaking",
    ruleTags: ["small_talk", "conversation", "fluency"]
  },
  cards: [
    {
      id: "small-talk-openers",
      type: "carousel",
      title: "Small talk starters",
      description: "Фразы, с которых легко начать разговор.",
      payload: {
        slides: [
          "How's your day going?",
          "Did you do anything fun this week?",
          "That cafe is great, have you been there?"
        ]
      },
      reward: { xp: 12 }
    },
    {
      id: "mini-dialog",
      type: "mini_game",
      title: "Ответь естественно",
      description: "Выбери реплику, которая звучит как small talk.",
      interaction: {
        prompt: "Colleague: 'How was your weekend?'",
        options: [
          "I was completing mandatory household operations.",
          "It was great, I finally watched that movie everyone talks about.",
          "Weekend is a social construct."
        ],
        correctAnswer: "It was great, I finally watched that movie everyone talks about."
      },
      reward: { xp: 26 }
    },
    {
      id: "quiz-follow-up",
      type: "quiz",
      title: "Best follow-up question",
      description: "Поддержи разговор корректно.",
      interaction: {
        prompt: "Friend: 'I started learning guitar.' What is the best response?",
        options: [
          "Why would you do that?",
          "Nice! What songs are you practicing now?",
          "Okay."
        ],
        correctAnswer: "Nice! What songs are you practicing now?"
      },
      reward: { xp: 21 }
    },
    {
      id: "keep-conversation-going",
      type: "match",
      title: "Продолжи диалог",
      description: "Выбери реплику, которая поддерживает беседу.",
      interaction: {
        prompt: "Neighbor: 'I adopted a dog last week.'",
        options: [
          "Interesting.",
          "Nice! What breed is it?",
          "I don't really like dogs."
        ],
        correctAnswer: "Nice! What breed is it?"
      },
      reward: { xp: 23 }
    }
  ]
};
