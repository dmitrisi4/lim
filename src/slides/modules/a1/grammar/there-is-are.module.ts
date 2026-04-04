import type { SlideModule } from "~/slides/core/types";

export const thereIsAreModule: SlideModule = {
  meta: {
    id: "grammar.there-is-are",
    title: "There is / There are",
    description: "Конструкция для описания существования и местонахождения",
    level: "a1",
    category: "grammar",
    ruleTags: ["there_is", "there_are", "existence", "location"]
  },
  cards: [
    {
      id: "there-is-are-overview",
      type: "carousel",
      title: "There is / There are",
      description: "Используем для описания того, что есть в каком-то месте.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "There is + singular noun: There is a cat in the room.||В комнате есть кот",
          "There are + plural noun: There are two chairs.||Есть два стула",
          "Negative: There is not (isn't) a car here.||Отрицание с isn't / aren't",
          "There aren't any shops on this street.||Нет магазинов на этой улице",
          "Question: Is there a bank near here?||Вопрос: Is/Are + there",
          "Are there any seats available?||Есть ли свободные места?",
          "Short answers: Yes, there is. / No, there aren't.||Короткие ответы"
        ]
      },
      reward: { xp: 13 }
    },
    {
      id: "quiz-there-is-are",
      type: "quiz",
      title: "is или are?",
      description: "Выбери правильную форму.",
      interaction: {
        prompt: "There ___ three windows in the room.",
        options: [
          "are||Верно: три окна = множественное число",
          "is||Is — для единственного числа",
          "be||Базовая форма, не используется здесь"
        ],
        correctAnswer: "are"
      },
      reward: { xp: 20 }
    },
    {
      id: "match-negative-there",
      type: "match",
      title: "Отрицание",
      description: "Составь правильное отрицательное предложение.",
      interaction: {
        prompt: "There ___ a supermarket on this street.",
        options: [
          "isn't||Верно: единственное число -> isn't",
          "aren't||Aren't — для множественного числа",
          "is not any||Нестандартная форма для исчисляемых"
        ],
        correctAnswer: "isn't"
      },
      reward: { xp: 22 }
    },
    {
      id: "quiz-question-there",
      type: "quiz",
      title: "Вопрос с there",
      description: "Выбери правильный вопрос.",
      interaction: {
        prompt: "You want to ask: 'Is there a café nearby?'",
        options: [
          "Is there a café nearby?||Верно",
          "There is a café nearby?||Порядок слов для вопроса неверен",
          "Does there a café near?||Нельзя использовать does с there"
        ],
        correctAnswer: "Is there a café nearby?"
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-there-is-are-context",
      type: "mini_game",
      title: "Описание комнаты",
      description: "Опиши, что есть в комнате.",
      interaction: {
        prompt: "You see one table and four chairs. What do you say?",
        options: [
          "There is a table and there are four chairs.||Верно",
          "There are a table and four chairs.||Ошибка: стол один -> there is",
          "Is there a table and chairs?"
        ],
        correctAnswer: "There is a table and there are four chairs."
      },
      reward: { xp: 25 }
    }
  ]
};
