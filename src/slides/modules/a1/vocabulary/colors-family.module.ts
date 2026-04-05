import type { SlideModule } from "~/slides/core/types";

export const colorsFamilyVocabularyModule: SlideModule = {
  meta: {
    id: "vocabulary.colors-family",
    title: "Colors & Family",
    description: "Базовые цвета и члены семьи для A1",
    level: "a1",
    category: "vocabulary",
    ruleTags: ["colors", "family", "vocabulary_basic"]
  },
  cards: [
    {
      id: "colors-overview",
      type: "carousel",
      title: "Colors — базовые цвета",
      description: "Основные цвета с примерами в контексте.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "red, blue, green, yellow, orange, purple.||Основные цвета",
          "white, black, grey, brown, pink.||Нейтральные и смешанные",
          "My car is red. Her dress is blue.||Цвет + существительное",
          "What colour is it? — It's green.||Вопрос о цвете",
          "A blue sky. A yellow flower. Black shoes.||Цвет как прилагательное перед существительным"
        ]
      },
      reward: { xp: 12 }
    },
    {
      id: "family-overview",
      type: "carousel",
      title: "Family — члены семьи",
      description: "Основная лексика для описания семьи.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "mother / mum, father / dad.||Мать, отец",
          "brother, sister.||Брат, сестра",
          "son, daughter.||Сын, дочь",
          "grandmother / grandma, grandfather / grandad.||Бабушка, дедушка",
          "husband, wife.||Муж, жена",
          "I have two sisters and one brother.||Типичная фраза о семье"
        ]
      },
      reward: { xp: 12 }
    },
    {
      id: "quiz-color-context",
      type: "quiz",
      title: "Цвет в предложении",
      description: "Выбери правильное употребление цвета.",
      interaction: {
        prompt: "The sky is ___.",
        options: [
          "blue||Верно",
          "blues||Цвета не изменяются в английском",
          "a blue||Артикль здесь не нужен"
        ],
        correctAnswer: "blue"
      },
      reward: { xp: 18 }
    },
    {
      id: "match-family-members",
      type: "match",
      title: "Члены семьи",
      description: "Соотнеси слово и родственника.",
      interaction: {
        prompt: "Your mother's mother is your ___.",
        options: [
          "grandmother||Верно",
          "aunt||Тётя — сестра родителя",
          "sister||Сестра — другое поколение"
        ],
        correctAnswer: "grandmother"
      },
      reward: { xp: 20 }
    },
    {
      id: "quiz-family-sentence",
      type: "quiz",
      title: "Фраза о семье",
      description: "Выбери естественную фразу.",
      interaction: {
        prompt: "How do you say: 'У меня есть брат и сестра'?",
        options: [
          "I have a brother and a sister.",
          "I have brother and sister.",
          "I am having a brother and a sister."
        ],
        correctAnswer: "I have a brother and a sister."
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-describe-family",
      type: "mini_game",
      title: "Описание семьи",
      description: "Составь естественное описание.",
      interaction: {
        prompt: "Tell something about your family using colours.",
        options: [
          "My sister has red hair and brown eyes.",
          "My sister is having red hairs.",
          "My sister hair is red colour."
        ],
        correctAnswer: "My sister has red hair and brown eyes."
      },
      reward: { xp: 24 }
    }
  ]
};
