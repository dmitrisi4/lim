import type { SlideModule } from "~/slides/core/types";

export const coloresDiasTiempoVocabularyModule: SlideModule = {
  meta: {
    id: "es.vocabulary.colores-dias-tiempo",
    title: "Vocabulario: Colores, Días y Tiempo",
    description: "Palabras esenciales A1 para colores, días de la semana y expresiones de tiempo",
    level: "a1",
    category: "vocabulary",
    ruleTags: ["colores", "dias_semana", "tiempo", "vocabulario_basico"]
  },
  cards: [
    {
      id: "colores-dias-tiempo-resumen",
      type: "carousel",
      title: "Bloques clave para A1",
      description: "Слова и выражения, которые нужны каждый день в речи.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Colores: rojo, azul, verde, blanco, negro, amarillo.||Базовые цвета",
          "Ejemplo: Tengo una camisa azul.||У меня синяя рубашка",
          "Días: lunes, martes, miércoles, jueves, viernes, sábado, domingo.||Дни недели",
          "Hoy es lunes. Mañana es martes.||Сегодня понедельник, завтра вторник",
          "Tiempo: hoy, mañana, ayer, ahora, tarde, temprano.||Маркер времени",
          "Hora: a las ocho, a las cinco y media.||Как говорить время встречи",
          "Rutina: El viernes estudio y el sábado descanso.||Пример с днями и планом"
        ]
      },
      reward: { xp: 13 }
    },
    {
      id: "quiz-manana-martes",
      type: "quiz",
      title: "Días consecutivos",
      description: "Проверь базовый порядок дней недели.",
      interaction: {
        prompt: "Hoy es lunes. Mañana es ___.||Сегодня понедельник. Завтра ___",
        options: [
          "martes||Верно",
          "domingo||Это не следующий день",
          "viernes||Слишком далеко"
        ],
        correctAnswer: "martes"
      },
      reward: { xp: 18 }
    },
    {
      id: "match-color-camisa",
      type: "match",
      title: "Color en contexto",
      description: "Выбери цвет, который завершает фразу.",
      interaction: {
        prompt: "Tengo una camisa ___.||У меня ___ рубашка",
        options: [
          "azul||Верно",
          "lunes||Это день, не цвет",
          "mañana||Это маркер времени"
        ],
        correctAnswer: "azul"
      },
      reward: { xp: 20 }
    },
    {
      id: "mini-agenda-semanal",
      type: "mini_game",
      title: "Plan semanal",
      description: "Собери естественную фразу о графике на неделю.",
      interaction: {
        prompt: "Quieres decir que estudias el jueves por la tarde.||Нужно сказать, что ты учишься в четверг днем",
        options: [
          "El jueves por la tarde estudio español.||Верно",
          "Jueves estudiar tarde yo.||Неверный порядок слов",
          "El color jueves es azul.||Не по смыслу"
        ],
        correctAnswer: "El jueves por la tarde estudio español."
      },
      reward: { xp: 24 }
    },
    {
      id: "quiz-cita-viernes",
      type: "quiz",
      title: "Dia + hora",
      description: "Закрепи шаблон встречи `el + dia + a las + hora`.",
      interaction: {
        prompt: "Nos vemos ___ viernes a las siete.||Увидимся в пятницу в семь",
        options: [
          "el||Верно: el viernes",
          "la||Неверный артикль",
          "de||Здесь не нужен предлог de"
        ],
        correctAnswer: "el"
      },
      reward: { xp: 22 }
    },
    {
      id: "quiz-despues-jueves",
      type: "quiz",
      title: "Orden de la semana",
      description: "Понимание последовательности дней в речи.",
      interaction: {
        prompt: "¿Qué día viene después de jueves?||Какой день идет после четверга?",
        options: [
          "viernes||Верно",
          "miércoles||Это день до четверга",
          "martes||Это еще раньше"
        ],
        correctAnswer: "viernes"
      },
      reward: { xp: 24 }
    }
  ]
};
