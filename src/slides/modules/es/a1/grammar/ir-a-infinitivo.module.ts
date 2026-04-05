import type { SlideModule } from "~/slides/core/types";

export const irAInfinitivoModule: SlideModule = {
  meta: {
    id: "es.grammar.ir-a-infinitivo",
    title: "Ir a + Infinitivo",
    description: "Futuro cercano para planes en A1",
    level: "a1",
    category: "grammar",
    ruleTags: ["ir_a_infinitivo", "futuro_cercano", "planes"]
  },
  cards: [
    {
      id: "ir-a-regla-base",
      type: "carousel",
      title: "Formula para hablar de planes",
      description: "Как говорить о ближайшем будущем без сложных времен.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Estructura: sujeto + ir (conjugado) + a + infinitivo.||Формула: кто + идти + делать",
          "Yo voy a estudiar esta noche.||Я буду учиться сегодня вечером",
          "Tu vas a cocinar mañana.||Ты собираешься готовить завтра",
          "El/Ella va a trabajar temprano.||Он/она собирается работать рано",
          "Nosotros vamos a viajar el sábado.||Мы собираемся поехать в субботу",
          "Ellos van a descansar en casa.||Они собираются отдыхать дома",
          "Negacion: No voy a salir hoy.||Отрицание ставим перед ir",
          "Pregunta: Vas a venir conmigo?||Вопрос о намерении/плане"
        ]
      },
      reward: { xp: 14 }
    },
    {
      id: "quiz-voy-estudiar",
      type: "quiz",
      title: "Forma de yo",
      description: "Подбери правильную форму глагола ir.",
      interaction: {
        prompt: "Yo ___ a estudiar ahora.||Сейчас я собираюсь учиться",
        options: [
          "voy||Верно: yo voy",
          "va||Форма el/ella",
          "vamos||Форма nosotros"
        ],
        correctAnswer: "voy"
      },
      reward: { xp: 19 }
    },
    {
      id: "match-vamos-pelicula",
      type: "match",
      title: "Plan de nosotros",
      description: "Тренировка формы `nosotros` в планах.",
      interaction: {
        prompt: "Nosotros ___ a ver una pelicula esta noche.||Мы собираемся смотреть фильм сегодня вечером",
        options: [
          "vamos||Верно: nosotros + vamos",
          "van||Форма ellos/ellas",
          "voy||Форма yo"
        ],
        correctAnswer: "vamos"
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-plan-fin-semana",
      type: "mini_game",
      title: "Plan para el fin de semana",
      description: "Выбери естественную фразу о планах.",
      interaction: {
        prompt: "Quieres contar un plan para mañana. Que dices?||Нужно сказать план на завтра",
        options: [
          "Manana voy a visitar a mi abuela.||Верно: естественный план",
          "Manana visito a mi abuela ir.||Неверная структура",
          "Manana estoy visitar a mi abuela.||Неверная форма"
        ],
        correctAnswer: "Manana voy a visitar a mi abuela."
      },
      reward: { xp: 24 }
    },
    {
      id: "quiz-negacion-ir-a",
      type: "quiz",
      title: "Negacion con ir a",
      description: "Закрепи отрицательную форму конструкции.",
      interaction: {
        prompt: "Hoy no ___ a comer fuera.||Сегодня я не собираюсь есть вне дома",
        options: [
          "voy||Верно: no voy a + infinitivo",
          "soy||Неверный глагол",
          "estoy||Неверный глагол"
        ],
        correctAnswer: "voy"
      },
      reward: { xp: 23 }
    },
    {
      id: "quiz-pregunta-vas-a",
      type: "quiz",
      title: "Pregunta sobre planes",
      description: "Выбери корректный вопрос с `ir a`.",
      interaction: {
        prompt: "Quieres preguntar: 'Ты собираешься учиться завтра?'",
        options: [
          "Vas a estudiar mañana?||Верно",
          "Estas estudiar mañana?||Неверная конструкция",
          "Vas estudiar a mañana?||Порядок слов неверный"
        ],
        correctAnswer: "Vas a estudiar mañana?"
      },
      reward: { xp: 25 }
    }
  ]
};
