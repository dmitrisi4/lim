import type { SlideModule } from "~/slides/core/types";

export const viajesVocabularyModule: SlideModule = {
  meta: {
    id: "es.vocabulary.viajes",
    title: "Vocabulario de Viajes",
    description: "Palabras y frases utiles para viajar",
    level: "a1",
    category: "vocabulary",
    ruleTags: ["viajes", "aeropuerto", "hotel"]
  },
  cards: [
    {
      id: "viajes-frases-aeropuerto",
      type: "carousel",
      title: "Frases en el aeropuerto",
      description: "Набор фраз, которые реально нужны в поездке.",
      payload: {
        slides: [
          "Donde esta la puerta B12?||Где выход B12?",
          "Tengo un vuelo con conexion.||У меня стыковочный рейс",
          "Quiero asiento de ventana.||Хочу место у окна",
          "A que hora empieza el embarque?||Во сколько начинается посадка?",
          "Donde recojo mi equipaje?||Где получить багаж?"
        ]
      },
      reward: { xp: 11 }
    },
    {
      id: "quiz-tarjeta-embarque",
      type: "quiz",
      title: "Vocabulario basico",
      description: "Связь ключевого термина и перевода.",
      interaction: {
        prompt: "Que significa 'tarjeta de embarque'?||Что значит tarjeta de embarque?",
        options: [
          "boarding pass||Посадочный талон",
          "luggage belt||Багажная лента",
          "passport control||Паспортный контроль"
        ],
        correctAnswer: "boarding pass"
      },
      reward: { xp: 18 }
    },
    {
      id: "match-facturacion",
      type: "match",
      title: "Orientacion en aeropuerto",
      description: "Подбери правильную зону для задачи.",
      interaction: {
        prompt: "Quieres dejar la maleta antes del control.||Нужно сдать багаж до досмотра",
        options: [
          "facturacion de equipaje||Стойка сдачи багажа",
          "puerta de embarque||Выход на посадку",
          "zona de llegadas||Зона прилета"
        ],
        correctAnswer: "facturacion de equipaje"
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-hotel-reserva",
      type: "mini_game",
      title: "Check-in en hotel",
      description: "Выбери естественную фразу при заселении.",
      interaction: {
        prompt: "Llegas al hotel. Que dices primero?||Ты приехал в отель. Что скажешь первым?",
        options: [
          "Tengo una reserva a nombre de Maria Gomez.||У меня бронь на имя Мария Гомес",
          "Dame una habitacion ahora.||Слишком грубо для ресепшена",
          "Hotel y desayuno donde?||Грамматически неестественно"
        ],
        correctAnswer: "Tengo una reserva a nombre de Maria Gomez."
      },
      reward: { xp: 24 }
    },
    {
      id: "viajes-micro-dialog",
      type: "quiz",
      title: "Micro dialogo en aeropuerto",
      description: "Собери логичную реплику в коротком диалоге.",
      interaction: {
        prompt: "Agente: 'Pasaporte, por favor.' Tu respondes:||Сотрудник просит паспорт",
        options: [
          "Aqui tiene.||Вот, пожалуйста",
          "No me gusta el aeropuerto.||Не по ситуации",
          "Quiero taxi en la ciudad.||Не по теме момента"
        ],
        correctAnswer: "Aqui tiene."
      },
      reward: { xp: 23 }
    }
  ]
};
