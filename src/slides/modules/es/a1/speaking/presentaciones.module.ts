import type { SlideModule } from "~/slides/core/types";

export const presentacionesSpeakingModule: SlideModule = {
  meta: {
    id: "es.speaking.presentaciones",
    title: "Presentaciones",
    description: "Dialogos cortos para presentarte en espanol",
    level: "a1",
    category: "speaking",
    ruleTags: ["presentaciones", "small_talk", "fluency"]
  },
  cards: [
    {
      id: "presentaciones-frases",
      type: "carousel",
      title: "Frases para presentarte",
      description: "Готовые шаблоны для знакомства и small talk.",
      payload: {
        slides: [
          "Hola, me llamo Lucia.||Привет, меня зовут Лусия",
          "Mucho gusto.||Очень приятно познакомиться",
          "Soy de Valencia.||Я из Валенсии",
          "Trabajo en diseno.||Я работаю в дизайне",
          "Y tu, de donde eres?||А ты откуда?"
        ]
      },
      reward: { xp: 11 }
    },
    {
      id: "quiz-como-te-llamas",
      type: "quiz",
      title: "Pregunta correcta",
      description: "Выбери самый естественный вариант вопроса.",
      interaction: {
        prompt: "Quieres preguntar el nombre de alguien.||Ты хочешь спросить имя человека",
        options: [
          "Como te llamas?||Как тебя зовут?",
          "Que nombre tienes tu?||Неграмотно/неестественно для A1",
          "Quien nombre eres?||Неверная конструкция"
        ],
        correctAnswer: "Como te llamas?"
      },
      reward: { xp: 18 }
    },
    {
      id: "mini-respuesta-natural",
      type: "mini_game",
      title: "Respuesta natural",
      description: "Выбери ответ, который звучит дружелюбно и уместно.",
      interaction: {
        prompt: "Compa: 'Que tal tu fin de semana?'||Коллега: как прошли выходные?",
        options: [
          "Muy bien, fui al parque y descanse bastante.||Отлично, был в парке и хорошо отдохнул",
          "Fin de semana es una estructura temporal.||Слишком странно для диалога",
          "No informacion disponible.||Сухо и неестественно"
        ],
        correctAnswer: "Muy bien, fui al parque y descanse bastante."
      },
      reward: { xp: 23 }
    },
    {
      id: "match-seguir-conversacion",
      type: "match",
      title: "Mantener conversacion",
      description: "Хороший follow-up держит разговор живым.",
      interaction: {
        prompt: "Amigo: 'Empece clases de guitarra.'||Друг начал заниматься гитарой",
        options: [
          "Y por que?||Слишком резко в таком контексте",
          "Que canciones practicas ahora?||Лучший follow-up вопрос",
          "Ok.||Разговор обрывается"
        ],
        correctAnswer: "Que canciones practicas ahora?"
      },
      reward: { xp: 21 }
    },
    {
      id: "presentaciones-roleplay",
      type: "mini_game",
      title: "Mini role-play",
      description: "Отработай короткий диалог знакомства.",
      interaction: {
        prompt: "Persona: 'Hola, soy Ana. Y tu?' Tu respondes:||Тебя представили, нужен естественный ответ",
        options: [
          "Hola, soy Ivan. Mucho gusto.||Привет, я Иван. Очень приятно",
          "No hablo hoy.||Неуместно в ситуации знакомства",
          "Yo nombre Ivan ser.||Грамматическая ошибка"
        ],
        correctAnswer: "Hola, soy Ivan. Mucho gusto."
      },
      reward: { xp: 24 }
    }
  ]
};
