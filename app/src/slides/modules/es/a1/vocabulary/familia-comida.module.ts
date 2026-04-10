import type { SlideModule } from "~/slides/core/types";

export const familiaComidaVocabularyModule: SlideModule = {
  meta: {
    id: "es.vocabulary.familia-comida",
    title: "Vocabulario: Familia y Comida",
    description: "Lexico A1 para hablar de la familia y de la comida diaria",
    level: "a1",
    category: "vocabulary",
    ruleTags: ["familia", "comida", "vocabulario_basico"]
  },
  cards: [
    {
      id: "familia-comida-glosario",
      type: "carousel",
      title: "Palabras base con ejemplos",
      description: "Расширенный словарь по семье и еде с готовыми фразами.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Familia: madre, padre, hermano, hermana, abuelo, abuela.||Базовые слова о семье",
          "Mi hermana se llama Paula.||Мою сестру зовут Паула",
          "Tengo dos hermanos y una hermana.||У меня два брата и одна сестра",
          "Comida: pan, queso, arroz, pollo, fruta, verdura.||Базовые продукты",
          "Desayuno: cafe, pan y fruta.||Завтрак: кофе, хлеб и фрукт",
          "Almuerzo: arroz con pollo.||Обед: рис с курицей",
          "Cena: sopa y ensalada.||Ужин: суп и салат"
        ]
      },
      reward: { xp: 13 }
    },
    {
      id: "quiz-madre-padre",
      type: "quiz",
      title: "Familia inmediata",
      description: "Подбери правильные слова по контексту.",
      interaction: {
        prompt: "Mi ___ se llama Marta y mi ___ se llama Raul.||Мою маму зовут Марта, а папу Рауль",
        options: [
          "madre / padre||Верно",
          "hermana / hermano||Это сестра/брат",
          "abuela / abuelo||Это бабушка/дедушка"
        ],
        correctAnswer: "madre / padre"
      },
      reward: { xp: 19 }
    },
    {
      id: "match-desayuno-basico",
      type: "match",
      title: "Comida del dia",
      description: "Сопоставь привычную еду и прием пищи.",
      interaction: {
        prompt: "Para el desayuno, normalmente tomo:||Обычно на завтрак я беру",
        options: [
          "cafe y pan||Верно",
          "sopa y pescado||Скорее обед/ужин",
          "paella grande||Слишком тяжело для обычного завтрака"
        ],
        correctAnswer: "cafe y pan"
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-cafeteria-pedido",
      type: "mini_game",
      title: "Pedido en cafeteria",
      description: "Собери естественный заказ с вежливой формой.",
      interaction: {
        prompt: "Estas en una cafeteria. Que suena natural?||Ты в кафе. Что звучит естественно?",
        options: [
          "Quiero un cafe y una tortilla, por favor.||Верно: вежливо и грамматично",
          "Yo cafe tortilla ahora.||Неверная грамматика",
          "Dame comida rapido.||Слишком грубо"
        ],
        correctAnswer: "Quiero un cafe y una tortilla, por favor."
      },
      reward: { xp: 24 }
    },
    {
      id: "quiz-tengo-dos-hermanos",
      type: "quiz",
      title: "Hablar de familia con tener",
      description: "Практика `tener` в семейном контексте.",
      interaction: {
        prompt: "Yo ___ dos hermanos.||У меня два брата",
        options: [
          "tengo||Верно",
          "soy||Неверный глагол",
          "estoy||Неверный глагол"
        ],
        correctAnswer: "tengo"
      },
      reward: { xp: 23 }
    },
    {
      id: "quiz-cena-ligera",
      type: "quiz",
      title: "Vocabulario de comida",
      description: "Выбери фразу, которая логично описывает легкий ужин.",
      interaction: {
        prompt: "Que opcion describe una cena ligera?||Что описывает легкий ужин?",
        options: [
          "Ensalada y sopa.||Верно",
          "Cinco hamburguesas y refresco.||Слишком тяжелый вариант",
          "Solo cafe doble a medianoche.||Не типичный вариант ужина"
        ],
        correctAnswer: "Ensalada y sopa."
      },
      reward: { xp: 25 }
    }
  ]
};
