import type { SlideModule } from "~/slides/core/types";

export const presenteBasicoModule: SlideModule = {
  meta: {
    id: "es.grammar.presente-basico",
    title: "Presente Basico",
    description: "Verbos regulares en presente para A1",
    level: "a1",
    category: "grammar",
    ruleTags: ["presente", "verbos_regulares", "conjugacion"]
  },
  cards: [
    {
      id: "presente-endings",
      type: "carousel",
      title: "Terminaciones en presente",
      description: "Шпаргалка по трем группам глаголов с примерами.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "-ar: hablo, hablas, habla, hablamos.||Окончания для hablar",
          "-er: como, comes, come, comemos.||Окончания для comer",
          "-ir: vivo, vives, vive, vivimos.||Окончания для vivir",
          "Con yo casi siempre termina en -o.||Для yo обычно -o",
          "Con nosotros: hablamos/comemos/vivimos.||Форма nosotros часто самая узнаваемая"
        ]
      },
      reward: { xp: 12 }
    },
    {
      id: "quiz-hablamos",
      type: "quiz",
      title: "Conjugacion de hablar",
      description: "Подбери форму для nosotros в привычном действии.",
      interaction: {
        prompt: "Nosotros ___ espanol todos los dias.||Мы говорим по-испански каждый день",
        options: [
          "hablamos||Верно: nosotros + -amos",
          "habla||Неверно: это форма el/ella",
          "hablo||Неверно: это форма yo"
        ],
        correctAnswer: "hablamos"
      },
      reward: { xp: 18 }
    },
    {
      id: "match-bebes",
      type: "match",
      title: "Conjugacion de beber",
      description: "Проверь форму для tu в ежедневной рутине.",
      interaction: {
        prompt: "Tu ___ cafe por la manana.||Ты пьешь кофе утром",
        options: [
          "bebo||Неверно: это форма yo",
          "bebes||Верно: tu + -es",
          "beben||Неверно: форма ellos/ellas"
        ],
        correctAnswer: "bebes"
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-viven",
      type: "mini_game",
      title: "Conjugacion de vivir",
      description: "Выбери форму для ellos с глаголом на -ir.",
      interaction: {
        prompt: "Ellos ___ en Madrid.||Они живут в Мадриде",
        options: [
          "vive||Неверно: форма el/ella",
          "viven||Верно: ellos + -en",
          "vivo||Неверно: форма yo"
        ],
        correctAnswer: "viven"
      },
      reward: { xp: 23 }
    },
    {
      id: "presente-negative-mini",
      type: "quiz",
      title: "Negacion en presente",
      description: "Добавь отрицание без изменения формы глагола.",
      interaction: {
        prompt: "Yo ___ trabajo los domingos.||Я не работаю по воскресеньям",
        options: [
          "no||Верно: yo no trabajo",
          "not||В испанском используем 'no'",
          "nunca no||Двойное отрицание здесь не нужно"
        ],
        correctAnswer: "no"
      },
      reward: { xp: 24 }
    }
  ]
};
