import type { SlideModule } from "~/slides/core/types";

export const tenerLlamarseModule: SlideModule = {
  meta: {
    id: "es.grammar.tener-llamarse",
    title: "Tener y Llamarse",
    description: "Dos verbos base para datos personales y edad",
    level: "a1",
    category: "grammar",
    ruleTags: ["tener", "llamarse", "edad", "datos_personales"]
  },
  cards: [
    {
      id: "tener-llamarse-overview",
      type: "carousel",
      title: "Conjugacion rapida y uso",
      description: "Детальная база по формам и типовым фразам для A1.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Tener: tengo, tienes, tiene, tenemos, tienen.||Базовые формы tener",
          "Edad: Tengo 20 anos.||В испанском возраст выражают через tener",
          "Posesion: Tengo un libro nuevo.||У меня есть новая книга",
          "Estado fisico: Tengo hambre / Tengo sed.||Я голоден / хочу пить",
          "Llamarse: me llamo, te llamas, se llama, nos llamamos, se llaman.||Возвратный глагол для имени",
          "Presentacion: Me llamo Sofia, mucho gusto.||Меня зовут София, приятно познакомиться",
          "Pregunta informal: Como te llamas?||Как тебя зовут? (tu)",
          "Pregunta formal: Como se llama usted?||Как вас зовут? (вежливо)"
        ]
      },
      reward: { xp: 13 }
    },
    {
      id: "quiz-tengo-anos",
      type: "quiz",
      title: "Hablar de edad",
      description: "Выбери правильную форму для возраста.",
      interaction: {
        prompt: "Yo ___ 25 anos.||Мне 25 лет",
        options: [
          "tengo||Верно: возраст выражаем через tener",
          "soy||Неверно: soy не для возраста",
          "estoy||Неверно: estoy не для возраста"
        ],
        correctAnswer: "tengo"
      },
      reward: { xp: 20 }
    },
    {
      id: "match-te-llamas",
      type: "match",
      title: "Pregunta de nombre",
      description: "Проверь форму глагола llamarse.",
      interaction: {
        prompt: "Tu amigo: 'Como ___?'||Как тебя зовут?",
        options: [
          "te llamas||Верно: форма tu",
          "se llama||Форма el/ella",
          "me llamo||Форма yo"
        ],
        correctAnswer: "te llamas"
      },
      reward: { xp: 22 }
    },
    {
      id: "quiz-tengo-hambre",
      type: "quiz",
      title: "Necesidades basicas con tener",
      description: "Практика частой бытовой конструкции.",
      interaction: {
        prompt: "Ahora yo ___ hambre.||Сейчас я голоден",
        options: [
          "tengo||Верно",
          "soy||Неверно: не выражает потребность",
          "estoy||Здесь не используется"
        ],
        correctAnswer: "tengo"
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-personal-info",
      type: "mini_game",
      title: "Ficha personal",
      description: "Собери естественную мини-самопрезентацию.",
      interaction: {
        prompt: "Elige la mejor presentacion:||Выбери лучший вариант представления",
        options: [
          "Me llamo Ivan y tengo 27 anos.||Верно: имя + возраст",
          "Soy Ivan y estoy 27 anos.||Неверно: возраст",
          "Llamo Ivan y tengo de 27.||Неверная грамматика"
        ],
        correctAnswer: "Me llamo Ivan y tengo 27 anos."
      },
      reward: { xp: 24 }
    },
    {
      id: "quiz-formal-llamarse",
      type: "quiz",
      title: "Pregunta formal",
      description: "Выбери вежливый вопрос для нового знакомства.",
      interaction: {
        prompt: "Hablas con una profesora. Preguntas su nombre:||Разговор с преподавателем, нужна вежливая форма",
        options: [
          "Como se llama usted?||Верно: formal",
          "Como te llamas?||Слишком неформально",
          "Que llamas?||Неверная структура"
        ],
        correctAnswer: "Como se llama usted?"
      },
      reward: { xp: 25 }
    }
  ]
};
