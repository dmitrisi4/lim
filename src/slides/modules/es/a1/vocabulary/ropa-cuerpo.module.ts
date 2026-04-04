import type { SlideModule } from "~/slides/core/types";

export const ropaCuerpoVocabularyModule: SlideModule = {
  meta: {
    id: "es.vocabulary.ropa-cuerpo",
    title: "Vocabulario: Ropa y Cuerpo",
    description: "Prendas de ropa y partes del cuerpo para A1",
    level: "a1",
    category: "vocabulary",
    ruleTags: ["ropa", "cuerpo", "vocabulario_basico", "descripcion"]
  },
  cards: [
    {
      id: "ropa-overview",
      type: "carousel",
      title: "La ropa — одежда",
      description: "Основная лексика для описания одежды.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "camiseta (f), camisa (f), pantalón (m), falda (f).||Футболка, рубашка, брюки, юбка",
          "zapatos (m pl), calcetines (m pl), botas (f pl).||Обувь и носки",
          "abrigo (m), chaqueta (f), jersey (m).||Пальто, куртка, свитер",
          "Llevo una camiseta azul y unos vaqueros.||Я ношу синюю футболку и джинсы",
          "¿Qué llevas hoy? — Llevo un vestido rojo.||Что ты носишь сегодня? — Я в красном платье",
          "Llevar = носить/надевать (одежду).||Ключевой глагол для описания одежды"
        ]
      },
      reward: { xp: 13 }
    },
    {
      id: "cuerpo-overview",
      type: "carousel",
      title: "El cuerpo — тело",
      description: "Части тела для описания и общения у врача.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "cabeza (f), cara (f), ojo (m), nariz (f), boca (f).||Голова, лицо, глаз, нос, рот",
          "mano (f), brazo (m), pierna (f), pie (m).||Рука (кисть), рука (вся), нога, стопа",
          "espalda (f), estómago (m), corazón (m).||Спина, живот, сердце",
          "Me duele la cabeza.||У меня болит голова (конструкция с doler)",
          "Tengo dolor de estómago.||У меня болит живот (альтернативная конструкция)"
        ]
      },
      reward: { xp: 13 }
    },
    {
      id: "quiz-ropa-contexto",
      type: "quiz",
      title: "Ropa en contexto",
      description: "Выбери подходящее слово для описания.",
      interaction: {
        prompt: "En invierno llevo un ___ para abrigarme.||Зимой я ношу ___, чтобы согреться",
        options: [
          "abrigo||Верно: пальто — для зимы",
          "camiseta||Слишком легкая одежда для зимы",
          "falda||Это тоже одежда, но не для тепла"
        ],
        correctAnswer: "abrigo"
      },
      reward: { xp: 18 }
    },
    {
      id: "match-cuerpo-dolor",
      type: "match",
      title: "Me duele...",
      description: "Соотнеси часть тела с жалобой.",
      interaction: {
        prompt: "Después de mucho escribir, te duele la ___.||После долгого письма болит...",
        options: [
          "mano||Верно: от письма болит рука/кисть",
          "pierna||Ноги болят от ходьбы",
          "cabeza||Голова — от стресса, не от письма"
        ],
        correctAnswer: "mano"
      },
      reward: { xp: 20 }
    },
    {
      id: "quiz-llevar-ropa",
      type: "quiz",
      title: "Глагол llevar",
      description: "Как правильно сказать, что кто-то носит?",
      interaction: {
        prompt: "Ella ___ una chaqueta verde hoy.",
        options: [
          "lleva||Верно: ella + lleva",
          "llevas||Llevas — форма tú",
          "llevo||Llevo — форма yo"
        ],
        correctAnswer: "lleva"
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-describe-persona",
      type: "mini_game",
      title: "Describe a una persona",
      description: "Опиши человека, используя одежду и части тела.",
      interaction: {
        prompt: "Quieres describir a tu amigo: темные волосы, синяя рубашка.",
        options: [
          "Tiene el pelo negro y lleva una camisa azul.||Верно",
          "Tiene negro pelo y lleva azul camisa.||Неверный порядок прилагательного",
          "Tiene pelos negros y llevas una camisa azul.||Ошибки в форме"
        ],
        correctAnswer: "Tiene el pelo negro y lleva una camisa azul."
      },
      reward: { xp: 25 }
    }
  ]
};
