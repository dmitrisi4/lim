import type { SlideModule } from "~/slides/core/types";

export const classroomListeningModule: SlideModule = {
  meta: {
    id: "listening.classroom-basics",
    title: "Listening: Classroom Basics",
    description: "Понимание простых инструкций преподавателя",
    level: "a1",
    category: "listening",
    ruleTags: ["listening", "classroom", "instructions"]
  },
  cards: [
    {
      id: "classroom-commands",
      type: "video",
      title: "Common classroom commands",
      description: "Слушай и повторяй простые команды.",
      payload: {
        mediaUrl: "mock://audio/classroom-commands-a1"
      },
      reward: { xp: 10 }
    },
    {
      id: "quiz-open-book",
      type: "quiz",
      title: "Понимание инструкции",
      description: "Определи, что нужно сделать.",
      interaction: {
        prompt: "You hear: 'Open your book on page ten.' What should you do?",
        options: ["Close the book", "Go to page ten", "Write page ten"],
        correctAnswer: "Go to page ten"
      },
      reward: { xp: 18 }
    },
    {
      id: "listen-and-respond",
      type: "match",
      title: "Реакция на просьбу",
      description: "Выбери корректную реакцию ученика.",
      interaction: {
        prompt: "Teacher: 'Can you repeat, please?'",
        options: ["Sorry?", "Yes, I'll say it again.", "I am page ten."],
        correctAnswer: "Yes, I'll say it again."
      },
      reward: { xp: 22 }
    }
  ]
};
