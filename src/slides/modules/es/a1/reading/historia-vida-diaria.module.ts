import type { SlideModule } from "~/slides/core/types";

export const historiaVidaDiariaModule: SlideModule = {
  meta: {
    id: "es.reading.historia-vida-diaria",
    title: "Historias: Vida cotidiana",
    description: "Короткие истории на испанском A1 — читай и понимай смысл",
    level: "a1",
    category: "reading",
    ruleTags: ["comprehensible_input", "reading", "story", "vida_diaria"]
  },
  cards: [
    {
      id: "historia-manana-de-carlos",
      type: "story",
      title: "La mañana de Carlos",
      description: "Прочитай историю. Понимание важнее, чем каждое слово.",
      payload: {
        text: [
          "Carlos se levanta a las siete de la mañana. No le gustan los lunes, pero tiene trabajo.",
          "Primero va a la cocina y hace café. Lo bebe despacio y mira por la ventana.",
          "Después se ducha, se viste y coge su bolsa. Camina hasta la parada del autobús.",
          "En el autobús, Carlos escucha música. Llega al trabajo a las ocho y media."
        ]
      },
      interaction: {
        prompt: "¿Qué hace Carlos antes de salir de casa?",
        options: [
          "Se ducha y se viste.||Верно — это в тексте",
          "Llama a un taxi.||Этого в тексте нет",
          "Come en una cafetería."
        ],
        correctAnswer: "Se ducha y se viste."
      },
      reward: { xp: 22 }
    },
    {
      id: "historia-fin-de-semana-lucia",
      type: "story",
      title: "El fin de semana de Lucía",
      description: "Прочитай о выходных Лусии.",
      payload: {
        text: [
          "A Lucía le encantan los fines de semana. El sábado duerme hasta las diez.",
          "Por la tarde va al mercado con su amiga Carmen. Compran fruta y pan.",
          "Por la noche cocinan juntas en el piso de Lucía. Hacen pasta.",
          "El domingo Lucía se queda en casa. Lee un libro y ve una película. Es un día muy tranquilo."
        ]
      },
      interaction: {
        prompt: "¿Qué compran Lucía y Carmen en el mercado?",
        options: [
          "Fruta y pan.||Верно — это в тексте",
          "Pasta y queso.||Этого в тексте нет",
          "Café y leche."
        ],
        correctAnswer: "Fruta y pan."
      },
      reward: { xp: 22 }
    },
    {
      id: "historia-nuevo-vecino",
      type: "story",
      title: "El nuevo vecino",
      description: "История о новом соседе.",
      payload: {
        text: [
          "Una familia nueva se muda al piso de al lado. Se llaman los García.",
          "El señor García es alto y tiene el pelo oscuro. Trabaja en un hospital.",
          "La señora García es profesora. Tienen dos hijos: un niño llamado Pablo, de ocho años, y una niña llamada Sofía, de cinco.",
          "A Pablo le gusta el fútbol y a Sofía le gusta dibujar. Parecen una familia muy simpática."
        ]
      },
      interaction: {
        prompt: "¿Cuál es el trabajo de la señora García?",
        options: [
          "Es profesora.||Верно",
          "Trabaja en un hospital.||Это el señor García",
          "Es médica."
        ],
        correctAnswer: "Es profesora."
      },
      reward: { xp: 23 }
    },
    {
      id: "historia-perdido-en-ciudad",
      type: "story",
      title: "Perdido en la ciudad",
      description: "История о том, как заблудился в незнакомом городе.",
      payload: {
        text: [
          "Andrés visita Madrid por primera vez. Camina por el centro de la ciudad.",
          "Quiere encontrar el museo, pero no tiene mapa. Mira su móvil — la batería está muerta.",
          "Andrés para a una mujer en la calle. '¿Perdona, dónde está el Museo del Prado?' pregunta.",
          "La mujer sonríe. 'No está lejos. Siga todo recto y gire a la izquierda en el semáforo.'",
          "Andrés le da las gracias y sigue las indicaciones. Cinco minutos después, encuentra el museo."
        ]
      },
      interaction: {
        prompt: "¿Por qué Andrés le pregunta a la mujer por el camino?",
        options: [
          "Su móvil no tiene batería.||Верно — именно поэтому",
          "No habla español.||Этого в тексте нет",
          "No tiene dinero para el taxi."
        ],
        correctAnswer: "Su móvil no tiene batería."
      },
      reward: { xp: 24 }
    }
  ]
};
