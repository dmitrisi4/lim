import type { SlideModule } from "~/slides/core/types";

export const verbosReflexivosModule: SlideModule = {
  meta: {
    id: "es.grammar.verbos-reflexivos",
    title: "Verbos Reflexivos",
    description: "Rutinas diarias con verbos reflexivos para A1",
    level: "a1",
    category: "grammar",
    ruleTags: ["verbos_reflexivos", "rutina", "pronombres_reflexivos"]
  },
  cards: [
    {
      id: "reflexivos-overview",
      type: "carousel",
      title: "Verbos reflexivos: rutina diaria",
      description: "Как описывать свои ежедневные действия.",
      payload: {
        focusMode: "rule_examples",
        slides: [
          "Estructura: pronombre reflexivo + verbo conjugado.||Возвратное местоимение + спряженный глагол",
          "Pronombres: me, te, se, nos, se.||Для: yo, tú, él/ella, nosotros, ellos",
          "levantarse: me levanto, te levantas, se levanta.||Вставать",
          "acostarse: me acuesto, te acuestas, se acuesta.||Ложиться спать (o->ue)",
          "ducharse: me ducho, te duchas, se ducha.||Принимать душ",
          "llamarse: me llamo, te llamas, se llama.||Называться (уже знакомый глагол)",
          "Por la mañana me levanto a las siete.||Утром я встаю в 7"
        ]
      },
      reward: { xp: 14 }
    },
    {
      id: "quiz-me-levanto",
      type: "quiz",
      title: "Pronombre correcto",
      description: "Выбери правильное возвратное местоимение.",
      interaction: {
        prompt: "Yo ___ levanto a las siete.||Я встаю в 7 утра",
        options: [
          "me||Верно: yo -> me",
          "se||Se — для él/ella/ellos",
          "te||Te — для tú"
        ],
        correctAnswer: "me"
      },
      reward: { xp: 20 }
    },
    {
      id: "match-se-acuesta",
      type: "match",
      title: "Forma él/ella",
      description: "Проверь форму для él/ella.",
      interaction: {
        prompt: "Mi hermana ___ acuesta a las once.||Моя сестра ложится спать в 11",
        options: [
          "se||Верно: ella -> se",
          "me||Me — только для yo",
          "nos||Nos — для nosotros"
        ],
        correctAnswer: "se"
      },
      reward: { xp: 22 }
    },
    {
      id: "quiz-routine-order",
      type: "quiz",
      title: "Порядок действий",
      description: "Выбери логичный порядок утренней рутины.",
      interaction: {
        prompt: "Что происходит раньше всего утром?",
        options: [
          "Me levanto, me ducho y me visto.||Верно: встаю, душ, одеваюсь",
          "Me visto, me levanto y me ducho.||Неестественный порядок",
          "Me ducho, me visto y me levanto.||Нельзя одеться, не встав"
        ],
        correctAnswer: "Me levanto, me ducho y me visto."
      },
      reward: { xp: 21 }
    },
    {
      id: "mini-mi-rutina",
      type: "mini_game",
      title: "Mi rutina",
      description: "Составь естественную фразу о своей рутине.",
      interaction: {
        prompt: "Хочешь сказать: 'Обычно я принимаю душ утром'",
        options: [
          "Normalmente me ducho por la mañana.||Верно",
          "Normalmente ducho por la mañana.||Пропущено возвратное местоимение",
          "Normalmente se ducho por la mañana.||Неверное местоимение для yo"
        ],
        correctAnswer: "Normalmente me ducho por la mañana."
      },
      reward: { xp: 25 }
    }
  ]
};
