import type { SlideModule } from "~/slides/core/types";

export const imperativoModule: SlideModule = {
  meta: {
    id: "es.grammar.imperativo",
    title: "Imperativo: Comandos básicos",
    description: "Formas básicas del imperativo afirmativo para A1",
    level: "a1",
    category: "grammar",
    ruleTags: ["imperativo", "comandos", "instrucciones"]
  },
  cards: [
    {
      id: "imperativo-overview",
      type: "carousel",
      title: "Imperativo afirmativo",
      description: "Как давать команды и инструкции на испанском.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Para tú: quita la -s de la forma tú del presente.||Для tú: форма presente без -s",
          "hablas -> habla! Comes -> come! Abres -> abre!||Три группы глаголов",
          "Escucha bien. Abre el libro. Come despacio.||Слушай. Открой книгу. Ешь медленно.",
          "Para usted: usa la forma del presente de subjuntivo (igual al yo sin -o).||Для уважительной формы",
          "Hable más despacio, por favor. (usted)||Говорите медленнее, пожалуйста",
          "Irregulares comunes: ven (venir), di (decir), haz (hacer), ve (ir).||Частые неправильные формы",
          "Negativo: no + subjuntivo: No hables. No comas eso.||Запрет: no + субхунтив"
        ]
      },
      reward: { xp: 14 }
    },
    {
      id: "quiz-imperativo-tu",
      type: "quiz",
      title: "Forma tú del imperativo",
      description: "Выбери правильный императив для глагола hablar.",
      interaction: {
        prompt: "¿Cuál es el imperativo de «hablar» para tú?",
        options: [
          "habla||Верно: hablas -> habla",
          "hablas||Это форма presente, не imperativo",
          "hablad||Это форма vosotros"
        ],
        correctAnswer: "habla"
      },
      reward: { xp: 20 }
    },
    {
      id: "match-imperativo-context",
      type: "match",
      title: "Команда в контексте",
      description: "Выбери подходящую команду.",
      interaction: {
        prompt: "En clase, el profesor dice: '___ el libro en la página 12.'",
        options: [
          "Abre||Верно: imperativo de abrir",
          "Abres||Форма presente, не imperativo",
          "Abriendo||Это герундий"
        ],
        correctAnswer: "Abre"
      },
      reward: { xp: 22 }
    },
    {
      id: "quiz-imperativo-negativo",
      type: "quiz",
      title: "Imperativo negativo",
      description: "Как правильно запретить что-то?",
      interaction: {
        prompt: "Choose the correct prohibition:",
        options: [
          "No hablas tan rápido.||Это утверждение в presente",
          "No hables tan rápido.||Верно: no + subjuntivo",
          "No habla tan rápido.||Это imperativo para usted"
        ],
        correctAnswer: "No hables tan rápido."
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-imperativo-polite",
      type: "mini_game",
      title: "Вежливая просьба",
      description: "Попроси что-то вежливо с imperativo + por favor.",
      interaction: {
        prompt: "Хочешь попросить коллегу говорить медленнее. Что скажешь?",
        options: [
          "Habla más despacio, por favor.||Верно: imperativo + por favor",
          "Hablas despacio, por favor.||Это presente, не команда",
          "Hablar más despacio.||Инфинитив не используется как команда"
        ],
        correctAnswer: "Habla más despacio, por favor."
      },
      reward: { xp: 25 }
    }
  ]
};
