import type { SlideModule } from "~/slides/core/types";

export const possessivesModule: SlideModule = {
  meta: {
    id: "grammar.possessives",
    title: "Possessive Adjectives",
    description: "Притяжательные местоимения: my, your, his, her, our, their",
    level: "a1",
    category: "grammar",
    ruleTags: ["possessives", "my_your_his_her", "pronouns"]
  },
  cards: [
    {
      id: "possessives-overview",
      type: "carousel",
      title: "Притяжательные местоимения",
      description: "Кратко и с примерами для каждого лица.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "I -> my: This is my bag.||Мой/моя",
          "You -> your: Is this your phone?||Твой / Ваш",
          "He -> his: His name is Tom.||Его",
          "She -> her: Her book is on the table.||Её",
          "We -> our: Our house is big.||Наш",
          "They -> their: Their dog is friendly.||Их",
          "Rule: possessive adjective + noun (no article needed).||Перед существительным — без артикля"
        ]
      },
      reward: { xp: 13 }
    },
    {
      id: "quiz-my-her",
      type: "quiz",
      title: "My или Her?",
      description: "Выбери правильное притяжательное местоимение.",
      interaction: {
        prompt: "Anna loves ___ cat. (Anna's cat)",
        options: [
          "her||Верно: Anna = she -> her",
          "his||His — для мужчин",
          "my||My — только для говорящего"
        ],
        correctAnswer: "her"
      },
      reward: { xp: 20 }
    },
    {
      id: "match-their-our",
      type: "match",
      title: "Our или Their?",
      description: "Проверь различие между our и their.",
      interaction: {
        prompt: "The kids left ___ toys in the garden.",
        options: [
          "their||Верно: the kids = they -> their",
          "our||Our — для нас (we)",
          "her||Her — для одной женщины"
        ],
        correctAnswer: "their"
      },
      reward: { xp: 22 }
    },
    {
      id: "quiz-possessive-word-order",
      type: "quiz",
      title: "Порядок слов",
      description: "Найди правильную структуру с притяжательным местоимением.",
      interaction: {
        prompt: "Choose the correct sentence:",
        options: [
          "This is my brother.",
          "This is brother my.",
          "This is the my brother."
        ],
        correctAnswer: "This is my brother."
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-possessives-context",
      type: "mini_game",
      title: "В контексте",
      description: "Выбери правильную фразу для описания ситуации.",
      interaction: {
        prompt: "You want to say: 'This bag belongs to me.'",
        options: [
          "This is my bag.",
          "This is me bag.",
          "This is the bag of I."
        ],
        correctAnswer: "This is my bag."
      },
      reward: { xp: 24 }
    }
  ]
};
