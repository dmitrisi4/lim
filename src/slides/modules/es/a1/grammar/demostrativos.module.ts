import type { SlideModule } from "~/slides/core/types";

export const demostrativosModule: SlideModule = {
  meta: {
    id: "es.grammar.demostrativos",
    title: "Demostrativos: este, ese, aquel",
    description: "Указательные местоимения для описания расстояния A1",
    level: "a1",
    category: "grammar",
    ruleTags: ["demostrativos", "este_ese_aquel", "distancia"]
  },
  cards: [
    {
      id: "demostrativos-overview",
      type: "carousel",
      title: "Este, ese, aquel — расстояние",
      description: "Как указывать на предметы в зависимости от расстояния.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "este/esta = aquí — cerca de mí.||Это (рядом со мной): este libro, esta mesa",
          "ese/esa = ahí — cerca de ti.||То (рядом с тобой): ese libro, esa silla",
          "aquel/aquella = allí — lejos de los dos.||Вон то (далеко): aquel edificio, aquella tienda",
          "Plural: estos/estas, esos/esas, aquellos/aquellas.||Множественное число",
          "Concordancia: el adjetivo concuerda con el sustantivo.||Согласование по роду и числу",
          "Este coche es rojo. Esa casa es grande.||Примеры в контексте",
          "¿Cuánto cuesta aquel libro?||Сколько стоит вон та книга?"
        ]
      },
      reward: { xp: 14 }
    },
    {
      id: "quiz-este-ese",
      type: "quiz",
      title: "Cerca o lejos",
      description: "Выбери правильный указательный местоимение.",
      interaction: {
        prompt: "El libro está en tu mano. Dices: '___ libro es interesante.'",
        options: [
          "Ese||Верно: рядом с тобой -> ese",
          "Este||Este — рядом со говорящим",
          "Aquel||Aquel — далеко от обоих"
        ],
        correctAnswer: "Ese"
      },
      reward: { xp: 20 }
    },
    {
      id: "match-genero-demostrativo",
      type: "match",
      title: "Согласование по роду",
      description: "Подбери правильную форму указательного.",
      interaction: {
        prompt: "___ mesa (aquí, cerca de mí) es nueva.",
        options: [
          "Esta||Верно: mesa — femenino -> esta",
          "Este||Este — masculino",
          "Esa||Esa — для предмета рядом с собеседником"
        ],
        correctAnswer: "Esta"
      },
      reward: { xp: 22 }
    },
    {
      id: "quiz-plural-demostrativo",
      type: "quiz",
      title: "Множественное число",
      description: "Выбери правильную форму во множественном числе.",
      interaction: {
        prompt: "___ libros (aquí, cerca de mí) son míos.",
        options: [
          "Estos||Верно: libros — masculino plural -> estos",
          "Estas||Estas — femenino plural",
          "Este||Este — единственное число"
        ],
        correctAnswer: "Estos"
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-demostrativo-tienda",
      type: "mini_game",
      title: "En la tienda",
      description: "Укажи на товар в магазине правильно.",
      interaction: {
        prompt: "Ves una camiseta en el escaparate, lejos de ti y del vendedor. Preguntas:",
        options: [
          "¿Cuánto cuesta aquella camiseta?||Верно: далеко -> aquella",
          "¿Cuánto cuesta esta camiseta?||Esta — если рядом с тобой",
          "¿Cuánto cuesta esa camiseta?||Esa — если рядом с продавцом"
        ],
        correctAnswer: "¿Cuánto cuesta aquella camiseta?"
      },
      reward: { xp: 25 }
    }
  ]
};
