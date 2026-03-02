import type { SlideModule } from "~/slides/core/types";

export const articulosGeneroNumeroModule: SlideModule = {
  meta: {
    id: "es.grammar.articulos-genero-numero",
    title: "Articulos, Genero y Numero",
    description: "Sustantivos A1: genero (masculino/femenino) y singular/plural",
    level: "a1",
    category: "grammar",
    ruleTags: ["articulos", "genero", "numero", "sustantivos", "plural"]
  },
  cards: [
    {
      id: "regla-articulo-definido",
      type: "carousel",
      title: "Regla 1: Articulo definido",
      description: "Один фокус: используем `el/la/los/las`, когда предмет уже известен или конкретен.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Regla: usa el/la/los/las para algo especifico.||Определенный артикль: говорим о конкретном объекте",
          "El libro esta en la mochila.||Конкретная книга уже понятна собеседнику",
          "La mesa de la cocina es pequena.||Конкретный стол на кухне",
          "Los libros de Ana son nuevos.||Конкретные книги Аны"
        ]
      },
      interaction: {
        prompt: "___ casa de Maria es grande.||Дом Марии большой (конкретный дом)",
        options: [
          "La||Верно",
          "Una||Неверно: речь о конкретном доме",
          "Las||Неверно: множественное число"
        ],
        correctAnswer: "La"
      },
      reward: { xp: 18 }
    },
    {
      id: "regla-articulo-indefinido",
      type: "carousel",
      title: "Regla 2: Articulo indefinido",
      description: "Один фокус: `un/una/unos/unas` для нового или неконкретного объекта.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Regla: usa un/una/unos/unas para mencionar algo por primera vez.||Неопределенный артикль: новый объект в разговоре",
          "Quiero un cafe, por favor.||Хочу какой-то/один кофе",
          "Necesitamos unas sillas para la clase.||Нам нужны несколько стульев",
          "Ella compra una manzana en el mercado.||Она покупает одно яблоко"
        ]
      },
      interaction: {
        prompt: "Necesito ___ boligrafo.||Мне нужна ручка (любая)",
        options: [
          "un||Верно",
          "el||Неверно: не конкретная ручка",
          "los||Неверно: множественное число"
        ],
        correctAnswer: "un"
      },
      reward: { xp: 20 }
    },
    {
      id: "regla-genero-nombre",
      type: "carousel",
      title: "Regla 3: Genero del sustantivo",
      description: "Один фокус: базовый род существительных и артикль перед ними.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Regla: normalmente -o es masculino y -a es femenino.||Базовый шаблон рода на A1",
          "el perro / el chico / el libro.||Примеры masculino",
          "la casa / la mesa / la chica.||Примеры femenino",
          "Pregunta util: Es el o la?||Полезный самоконтроль при новом слове"
        ]
      },
      interaction: {
        prompt: "___ mesa es nueva.||Стол новый",
        options: [
          "La||Верно",
          "El||Неверно: mesa femenino",
          "Los||Неверно: множественное число"
        ],
        correctAnswer: "La"
      },
      reward: { xp: 22 }
    },
    {
      id: "regla-plural",
      type: "carousel",
      title: "Regla 4: Numero (plural)",
      description: "Один фокус: как делать множественное число.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Regla: +s despues de vocal, +es despues de consonante.||Главное правило множественного числа",
          "casa -> casas, libro -> libros.||После гласной добавляем -s",
          "papel -> papeles, color -> colores.||После согласной добавляем -es",
          "Articulo tambien cambia: el -> los, la -> las.||Артикль должен согласоваться"
        ]
      },
      interaction: {
        prompt: "Plural de 'reloj':||Множественное число слова reloj",
        options: [
          "relojes||Верно: после согласной -es",
          "relojs||Неверная форма",
          "relojeses||Лишнее окончание"
        ],
        correctAnswer: "relojes"
      },
      reward: { xp: 24 }
    },
    {
      id: "regla-excepciones",
      type: "carousel",
      title: "Regla 5: Excepciones utiles",
      description: "Один фокус: частые исключения, которые надо запомнить отдельно.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Regla: algunas palabras no siguen el patron -o/-a.||Есть частые исключения по роду",
          "el dia, el mapa.||Заканчиваются на -a, но masculino",
          "la mano.||Заканчивается на -o, но femenino",
          "Aprende estas tres como bloque.||Лучше запоминать как готовый набор"
        ]
      },
      interaction: {
        prompt: "Hoy es ___ dia importante.||Сегодня важный день",
        options: [
          "un||Верно: dia - masculino, хотя заканчивается на -a",
          "una||Неверно: dia не femenino",
          "la||Неверно: здесь не определенный артикль"
        ],
        correctAnswer: "un"
      },
      reward: { xp: 23 }
    },
    {
      id: "regla-concordancia",
      type: "carousel",
      title: "Regla 6: Concordancia",
      description: "Один фокус: прилагательное согласуется по роду и числу с существительным.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Regla: sustantivo y adjetivo deben coincidir.||Согласуем род и число",
          "el libro rojo / la casa roja.||Мужской и женский род",
          "los libros rojos / las casas rojas.||Множественное число",
          "Primero el sustantivo, despues el adjetivo.||Базовый порядок в A1"
        ]
      },
      interaction: {
        prompt: "Elige la frase correcta:||Выбери правильную фразу",
        options: [
          "Tengo unas manzanas rojas.||Верно",
          "Tengo unos manzanas rojo.||Ошибки в роде и числе",
          "Tengo una manzanas rojos.||Ошибки в числе"
        ],
        correctAnswer: "Tengo unas manzanas rojas."
      },
      reward: { xp: 25 }
    }
  ]
};
