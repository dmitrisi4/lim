import type { SlideModule } from "~/slides/core/types";

export const numerosTiempoListeningModule: SlideModule = {
  meta: {
    id: "es.listening.numeros-tiempo",
    title: "Escucha: Numeros y Hora",
    description: "Comprension auditiva de numeros y expresiones de tiempo",
    level: "a1",
    category: "listening",
    ruleTags: ["listening", "numeros", "tiempo"]
  },
  cards: [
    {
      id: "audio-hora-basica",
      type: "video",
      title: "Como decir la hora",
      description: "Сначала слушай шаблоны, потом повторяй вслух.",
      payload: {
        mediaUrl: "mock://audio/es/hora-a1"
      },
      reward: { xp: 10 }
    },
    {
      id: "hora-expresiones-resumen",
      type: "carousel",
      title: "Expresiones clave de tiempo",
      description: "Быстрый набор фраз, которые часто встречаются в аудио.",
      payload: {
        slides: [
          "Son las seis y cuarto.||6:15",
          "Son las ocho y media.||8:30",
          "Son las siete menos cuarto.||6:45",
          "A las nueve en punto.||Ровно в девять"
        ]
      },
      reward: { xp: 12 }
    },
    {
      id: "quiz-seis-y-cuarto",
      type: "quiz",
      title: "Comprension de hora",
      description: "Identifica la hora correcta.",
      interaction: {
        prompt: "Escuchas: 'Son las seis y cuarto'. Que hora es?||Шесть пятнадцать",
        options: [
          "6:15||Верно",
          "6:45||Это 'menos cuarto'",
          "7:15||На час позже"
        ],
        correctAnswer: "6:15"
      },
      reward: { xp: 17 }
    },
    {
      id: "quiz-doble-tres",
      type: "quiz",
      title: "Comprension de numeros",
      description: "Selecciona el numero dictado.",
      interaction: {
        prompt: "Escuchas: 'doble tres, nueve cero cinco'.||дважды три, девять ноль пять",
        options: [
          "33905||Верно",
          "33095||Порядок цифр другой",
          "33950||Последние две цифры перепутаны"
        ],
        correctAnswer: "33905"
      },
      reward: { xp: 20 }
    },
    {
      id: "match-horario-clase",
      type: "match",
      title: "Horario de clase",
      description: "Relaciona la frase con la hora.",
      interaction: {
        prompt: "Escuchas: 'La clase empieza a las ocho y media'.||Занятие начинается в половине девятого",
        options: [
          "8:15||Это y cuarto",
          "8:30||Верно",
          "9:30||На час позже"
        ],
        correctAnswer: "8:30"
      },
      reward: { xp: 22 }
    },
    {
      id: "listening-meeting-time",
      type: "quiz",
      title: "Hora de una cita",
      description: "Тренируем понимание времени в бытовом контексте.",
      interaction: {
        prompt: "Escuchas: 'Nos vemos a las cinco en punto'.||Встречаемся ровно в пять",
        options: [
          "5:00||Верно",
          "5:15||Это y cuarto",
          "4:50||Это menos diez"
        ],
        correctAnswer: "5:00"
      },
      reward: { xp: 21 }
    }
  ]
};
