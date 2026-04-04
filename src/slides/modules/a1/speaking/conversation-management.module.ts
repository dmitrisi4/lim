import type { SlideModule } from "~/slides/core/types";

export const conversationManagementModule: SlideModule = {
  meta: {
    id: "speaking.conversation-management",
    title: "Conversation Management",
    description: "Фразы для выживания в реальном диалоге на английском",
    level: "a1",
    category: "speaking",
    ruleTags: ["conversation_management", "clarification", "backchannels", "fluency"]
  },
  cards: [
    {
      id: "conv-mgmt-clarification",
      type: "carousel",
      title: "Asking for clarification",
      description: "Фразы, чтобы получить понятный ввод от собеседника.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Could you repeat that, please?||Повтори, пожалуйста",
          "Sorry, I didn't catch that.||Я не расслышал/а",
          "What does ___ mean?||Что значит ___?",
          "Could you speak more slowly, please?||Говори медленнее, пожалуйста",
          "How do you spell that?||Как это пишется?",
          "Sorry, could you say that again?||Прости, повтори ещё раз"
        ]
      },
      reward: { xp: 12 }
    },
    {
      id: "conv-mgmt-backchannels",
      type: "carousel",
      title: "Backchannels — поддержка разговора",
      description: "Короткие сигналы, что ты слушаешь и понимаешь.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "I see. / Right. / Got it.||Понятно / Верно / Понял",
          "Uh-huh. / Mm-hmm.||Угу (неформально, но часто)",
          "That makes sense.||Это понятно",
          "Really? / Oh, interesting!||Правда? / О, интересно!",
          "OK, and then what?||Ладно, и что дальше?"
        ]
      },
      reward: { xp: 11 }
    },
    {
      id: "quiz-conv-repeat",
      type: "quiz",
      title: "Как попросить повторить?",
      description: "Выбери самую вежливую и естественную фразу.",
      interaction: {
        prompt: "You didn't understand. What do you say?",
        options: [
          "Could you repeat that, please?||Верно — вежливо и понятно",
          "Say again!||Слишком резко для незнакомца",
          "I don't understand you at all."
        ],
        correctAnswer: "Could you repeat that, please?"
      },
      reward: { xp: 20 }
    },
    {
      id: "quiz-conv-meaning",
      type: "quiz",
      title: "Спроси значение слова",
      description: "Ты услышал незнакомое слово. Что спросить?",
      interaction: {
        prompt: "You hear the word 'commute'. You don't know it. What do you ask?",
        options: [
          "What does 'commute' mean?||Верно",
          "How do you spell commute?||Это про написание, не про смысл",
          "Could you speak more slowly?"
        ],
        correctAnswer: "What does 'commute' mean?"
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-conv-steer",
      type: "mini_game",
      title: "Переключи тему",
      description: "Собеседник говорит о чём-то непонятном. Как сменить тему на знакомую?",
      interaction: {
        prompt: "The topic is getting too complex. What do you say to redirect?",
        options: [
          "That's interesting! By the way, where are you from?||Верно — мягкий переход на знакомую тему",
          "Stop, I don't understand.||Слишком резко",
          "Uh-huh. Yes. OK."
        ],
        correctAnswer: "That's interesting! By the way, where are you from?"
      },
      reward: { xp: 24 }
    },
    {
      id: "match-conv-slow",
      type: "match",
      title: "Попроси говорить медленнее",
      description: "Выбери фразу для просьбы замедлиться.",
      interaction: {
        prompt: "Native speaker is talking very fast. What do you say?",
        options: [
          "Could you speak more slowly, please?||Верно",
          "You talk too fast.||Звучит как жалоба, не просьба",
          "I don't catch your words."
        ],
        correctAnswer: "Could you speak more slowly, please?"
      },
      reward: { xp: 22 }
    }
  ]
};
