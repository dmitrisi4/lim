import type { SlideModule } from "~/slides/core/types";

export const gestionConversacionModule: SlideModule = {
  meta: {
    id: "es.speaking.gestion-conversacion",
    title: "Gestión de la conversación",
    description: "Фразы для выживания в реальном диалоге на испанском",
    level: "a1",
    category: "speaking",
    ruleTags: ["gestion_conversacion", "aclaracion", "backchannels", "fluency"]
  },
  cards: [
    {
      id: "gestion-aclaracion",
      type: "carousel",
      title: "Pedir aclaración",
      description: "Фразы, чтобы получить понятный ввод от собеседника.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "¿Puedes repetir, por favor?||Можешь повторить, пожалуйста?",
          "No entendí. ¿Puedes decirlo otra vez?||Я не понял/а. Можешь сказать ещё раз?",
          "¿Qué significa ___?||Что значит ___?",
          "¿Puedes hablar más despacio, por favor?||Говори медленнее, пожалуйста",
          "¿Cómo se escribe eso?||Как это пишется?",
          "Perdona, no te escuché bien.||Прости, я тебя плохо услышал/а"
        ]
      },
      reward: { xp: 12 }
    },
    {
      id: "gestion-backchannels",
      type: "carousel",
      title: "Señales de escucha activa",
      description: "Короткие сигналы, что ты слушаешь и понимаешь.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Claro. / Entiendo. / Ya veo.||Понятно / Понимаю / Вижу",
          "Ajá. / Sí, sí.||Угу / Да-да (неформально)",
          "¡Qué interesante!||Как интересно!",
          "¿En serio? / ¿De verdad?||Правда? / В самом деле?",
          "Vale, ¿y luego qué?||Ладно, и что дальше? (España)"
        ]
      },
      reward: { xp: 11 }
    },
    {
      id: "quiz-gestion-repetir",
      type: "quiz",
      title: "¿Cómo pedir que repitan?",
      description: "Выбери самую вежливую и естественную фразу.",
      interaction: {
        prompt: "No entendiste lo que dijo tu amigo. ¿Qué dices?",
        options: [
          "¿Puedes repetir, por favor?||Верно — вежливо и естественно",
          "¡Repite!||Слишком резко",
          "No te entiendo para nada."
        ],
        correctAnswer: "¿Puedes repetir, por favor?"
      },
      reward: { xp: 20 }
    },
    {
      id: "quiz-gestion-significado",
      type: "quiz",
      title: "Pregunta el significado",
      description: "Ты услышал незнакомое слово. Что спросить?",
      interaction: {
        prompt: "Escuchas la palabra 'madrugada'. No la conoces. ¿Qué preguntas?",
        options: [
          "¿Qué significa 'madrugada'?||Верно",
          "¿Cómo se escribe 'madrugada'?||Это про написание, не про смысл",
          "¿Puedes hablar más despacio?"
        ],
        correctAnswer: "¿Qué significa 'madrugada'?"
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-gestion-cambiar-tema",
      type: "mini_game",
      title: "Cambia el tema",
      description: "Собеседник говорит о чём-то слишком сложном. Как сменить тему?",
      interaction: {
        prompt: "La conversación se complica demasiado. ¿Qué dices para cambiar el tema?",
        options: [
          "¡Qué interesante! Por cierto, ¿de dónde eres?||Верно — мягкий переход",
          "Para. No entiendo.||Слишком резко",
          "Ajá. Sí. Claro."
        ],
        correctAnswer: "¡Qué interesante! Por cierto, ¿de dónde eres?"
      },
      reward: { xp: 24 }
    },
    {
      id: "match-gestion-despacio",
      type: "match",
      title: "Pide que hablen más despacio",
      description: "Выбери правильную фразу.",
      interaction: {
        prompt: "El hablante nativo habla muy rápido. ¿Qué le dices?",
        options: [
          "¿Puedes hablar más despacio, por favor?||Верно",
          "Hablas demasiado rápido.||Звучит как упрёк",
          "No entiendo tus palabras."
        ],
        correctAnswer: "¿Puedes hablar más despacio, por favor?"
      },
      reward: { xp: 22 }
    }
  ]
};
