import type { SlideModule } from "~/slides/core/types";

export const senalesReadingModule: SlideModule = {
  meta: {
    id: "es.reading.senales",
    title: "Lectura: Senales",
    description: "Comprension de carteles y avisos cortos",
    level: "a1",
    category: "reading",
    ruleTags: ["reading_signs", "lectura_basica", "public_notices"]
  },
  cards: [
    {
      id: "senales-basicas",
      type: "carousel",
      title: "Carteles frecuentes",
      description: "Мини-словарь вывесок и табличек для города.",
      payload: {
        slides: [
          "Entrada||Вход",
          "Salida||Выход",
          "Cerrado||Закрыто",
          "No fumar||Не курить",
          "Solo personal||Только для персонала",
          "Abierto de 9 a 18||Открыто с 9 до 18"
        ]
      },
      reward: { xp: 10 }
    },
    {
      id: "quiz-no-fumar",
      type: "quiz",
      title: "Entender un aviso",
      description: "Понимание коротких запретов и правил.",
      interaction: {
        prompt: "Que significa 'No fumar'?||Что означает табличка No fumar?",
        options: [
          "Se puede fumar||Можно курить (неверно)",
          "No esta permitido fumar||Верно: курить запрещено",
          "Solo personal puede fumar||Такого смысла нет"
        ],
        correctAnswer: "No esta permitido fumar"
      },
      reward: { xp: 17 }
    },
    {
      id: "match-salida",
      type: "match",
      title: "Orientacion en edificio",
      description: "Selecciona la senal correcta para salir.",
      interaction: {
        prompt: "Quieres salir del edificio. Que senal buscas?||Нужно найти выход",
        options: [
          "Salida||Верно: выход",
          "Entrada||Это вход",
          "Solo personal||Это ограничение доступа"
        ],
        correctAnswer: "Salida"
      },
      reward: { xp: 20 }
    },
    {
      id: "mini-aviso-biblioteca",
      type: "mini_game",
      title: "Aviso corto",
      description: "Comprende una frase breve.",
      interaction: {
        prompt: "Aviso: 'La biblioteca cierra a las 6 p. m.'||Библиотека закрывается в 18:00",
        options: [
          "La biblioteca abre a las 6 p. m.||Открывается в 18:00 (неверно)",
          "La biblioteca esta abierta toda la noche.||Всю ночь открыта (неверно)",
          "La biblioteca termina su horario a las 6 p. m.||Верно"
        ],
        correctAnswer: "La biblioteca termina su horario a las 6 p. m."
      },
      reward: { xp: 23 }
    },
    {
      id: "reading-notice-duration",
      type: "quiz",
      title: "Horario de tienda",
      description: "Вытащи практический смысл из короткого объявления.",
      interaction: {
        prompt: "Aviso: 'Abierto de lunes a viernes'.||Открыто с понедельника по пятницу",
        options: [
          "La tienda abre solo el fin de semana.||Неверно",
          "La tienda abre de lunes a viernes.||Верно",
          "La tienda nunca abre.||Неверно"
        ],
        correctAnswer: "La tienda abre de lunes a viernes."
      },
      reward: { xp: 22 }
    }
  ]
};
