import type { SlideModule } from "~/slides/core/types";

export const numeros0100VocabularyModule: SlideModule = {
  meta: {
    id: "es.vocabulary.numeros-0-100",
    title: "Vocabulario: Números 0-100",
    description: "Sistema base de números para A1 (edad, precio, hora, teléfono)",
    level: "a1",
    category: "vocabulary",
    ruleTags: ["numeros", "0_100", "vocabulario_basico", "tiempo"]
  },
  cards: [
    {
      id: "numeros-0-100-esquema",
      type: "carousel",
      title: "Mapa rapido de numeros",
      description: "Полная опора по числам от 0 до 100 с реальными контекстами.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "0-10: cero, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez.||База, с которой начинается все",
          "11-15: once, doce, trece, catorce, quince.||Часто встречаются в возрасте и времени",
          "16-19: dieciséis, diecisiete, dieciocho, diecinueve.||Формы через dieci-",
          "20: veinte; 21-29: veintiuno, veintidós, veintitrés...||Диапазон 20-29 имеет слитное написание",
          "Decenas: treinta, cuarenta, cincuenta, sesenta, setenta, ochenta, noventa.||Десятки",
          "31-99: treinta y uno, cuarenta y cinco, noventa y nueve.||После 30: десяток + y + единицы",
          "100: cien.||Сто",
          "Contexto: Tengo 24 años / Cuesta 58 euros / Son las 9:30.||Возраст, цена и время"
        ]
      },
      reward: { xp: 14 }
    },
    {
      id: "quiz-47",
      type: "quiz",
      title: "Numero escrito",
      description: "Найди правильную запись числа 47.",
      interaction: {
        prompt: "Como se escribe 47?||Как пишется 47 по-испански?",
        options: [
          "cuarenta y siete||Верно",
          "cuarenta siete||Пропущено y",
          "cuariente y siete||Неверная форма десятка"
        ],
        correctAnswer: "cuarenta y siete"
      },
      reward: { xp: 19 }
    },
    {
      id: "match-75",
      type: "match",
      title: "Palabra -> cifra",
      description: "Соотнеси словесную и цифровую форму.",
      interaction: {
        prompt: "setenta y cinco = ?||setenta y cinco это",
        options: [
          "75||Верно",
          "57||Цифры перепутаны",
          "70||Потеряна единица"
        ],
        correctAnswer: "75"
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-numero-telefono",
      type: "mini_game",
      title: "Telefono y escucha",
      description: "Тренировка чисел в практичном контексте телефона.",
      interaction: {
        prompt: "Elige la version correcta: 'Mi numero es 28 63'.||Выбери правильную испанскую фразу",
        options: [
          "Mi numero es veintiocho, sesenta y tres.||Верно",
          "Mi numero es veinte ocho, seis tres.||Неверная форма чисел",
          "Mi numero es veintiocho y sesenta treses.||Неверная структура"
        ],
        correctAnswer: "Mi numero es veintiocho, sesenta y tres."
      },
      reward: { xp: 24 }
    },
    {
      id: "quiz-edad-32",
      type: "quiz",
      title: "Edad en contexto",
      description: "Используй число в фразе про возраст.",
      interaction: {
        prompt: "Tengo ___ años. (32)||Мне 32 года",
        options: [
          "treinta y dos||Верно",
          "trece y dos||Неверная форма",
          "treinta dos||Пропущено y"
        ],
        correctAnswer: "treinta y dos"
      },
      reward: { xp: 23 }
    },
    {
      id: "quiz-cien",
      type: "quiz",
      title: "Limite A1",
      description: "Проверка верхней границы темы 0-100.",
      interaction: {
        prompt: "Como se dice 100?||Как по-испански 100?",
        options: [
          "cien||Верно",
          "ciento||Используется в других конструкциях",
          "cien y uno||Это уже 101"
        ],
        correctAnswer: "cien"
      },
      reward: { xp: 25 }
    }
  ]
};
