import type { SlideModule } from "~/slides/core/types";

export const storyDailyLifeModule: SlideModule = {
  meta: {
    id: "reading.story-daily-life",
    title: "Stories: Daily Life",
    description: "Короткие истории на A1 — читай и понимай смысл",
    level: "a1",
    category: "reading",
    ruleTags: ["comprehensible_input", "reading", "story", "daily_life"]
  },
  cards: [
    {
      id: "story-toms-morning",
      type: "story",
      title: "Tom's Morning",
      description: "Прочитай историю. Понимание важнее, чем каждое слово.",
      payload: {
        text: [
          "Tom wakes up at seven o'clock every morning. He doesn't like early mornings, but he has work.",
          "First, he goes to the kitchen and makes coffee. He drinks it slowly and looks out the window.",
          "Then he has a shower, gets dressed, and takes his bag. He walks to the bus stop.",
          "On the bus, Tom listens to music. He arrives at work at half past eight."
        ]
      },
      interaction: {
        prompt: "What does Tom do before he leaves the house?",
        options: [
          "He has a shower and gets dressed.||Верно — это в тексте",
          "He calls a taxi.||В тексте этого нет",
          "He eats breakfast at a café."
        ],
        correctAnswer: "He has a shower and gets dressed."
      },
      reward: { xp: 22 }
    },
    {
      id: "story-marias-weekend",
      type: "story",
      title: "Maria's Weekend",
      description: "Прочитай о выходных Марии.",
      payload: {
        text: [
          "Maria loves weekends. On Saturday, she sleeps until ten o'clock.",
          "In the afternoon, she goes to the market with her friend Anna. They buy fruit and bread.",
          "In the evening, they cook dinner together at Maria's flat. They make pasta.",
          "On Sunday, Maria stays home. She reads a book and watches a film. It is a relaxing day."
        ]
      },
      interaction: {
        prompt: "What do Maria and Anna buy at the market?",
        options: [
          "Fruit and bread.||Верно — это в тексте",
          "Pasta and cheese.||В тексте этого нет",
          "Coffee and milk."
        ],
        correctAnswer: "Fruit and bread."
      },
      reward: { xp: 22 }
    },
    {
      id: "story-new-neighbour",
      type: "story",
      title: "The New Neighbour",
      description: "История о новом соседе.",
      payload: {
        text: [
          "A new family moves into the flat next door. Their name is the Greens.",
          "Mr Green is tall with dark hair. He works in a hospital. Mrs Green is a teacher.",
          "They have two children: a boy called Sam, who is eight, and a girl called Lily, who is five.",
          "Sam likes football and Lily likes drawing. They seem like a very friendly family."
        ]
      },
      interaction: {
        prompt: "What is Mrs Green's job?",
        options: [
          "She is a teacher.||Верно",
          "She works in a hospital.||Это Mr Green",
          "She is a nurse."
        ],
        correctAnswer: "She is a teacher."
      },
      reward: { xp: 23 }
    },
    {
      id: "story-lost-in-city",
      type: "story",
      title: "Lost in the City",
      description: "История о том, как потерялся в незнакомом городе.",
      payload: {
        text: [
          "Jake is visiting London for the first time. He walks around the city centre.",
          "He wants to find the museum, but he doesn't have a map. He looks at his phone — the battery is dead.",
          "Jake stops a woman on the street. 'Excuse me, where is the British Museum?' he asks.",
          "The woman smiles. 'It's not far. Go straight, then turn left at the traffic lights.'",
          "Jake thanks her and follows the directions. Five minutes later, he finds the museum."
        ]
      },
      interaction: {
        prompt: "Why does Jake ask a woman for help?",
        options: [
          "His phone has no battery.||Верно — именно поэтому",
          "He doesn't speak English.||В тексте этого нет",
          "He has no money for a taxi."
        ],
        correctAnswer: "His phone has no battery."
      },
      reward: { xp: 24 }
    }
  ]
};
