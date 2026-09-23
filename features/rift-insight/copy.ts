import type { Language } from "@/lib/types";
import type { InsightId, ScoreMetric } from "@/lib/match-analysis";

const copy = {
  en: {
    eyebrow: "YOUR NEXT GAME STARTS HERE",
    title: "Every match.",
    titleAccent: "A clearer picture.",
    intro:
      "Find your edge on the Rift. Explore your matches, spot your strengths, and turn the small details into your next big play.",
    searchCta: "Find my profile",
    howItWorks: "Explore the insights",
    noLogin: "Your Riot ID. No sign-up needed.",
    preview: "ILLUSTRATIVE PREVIEW",
    score: "Insight score",
    outOf: "out of 100",
    analysis: "Performance insights",
    improve: "Next game, focus on",
    strengths: "Keep it up",
    balanced: "No standout patterns in this match.",
    methodTitle: "How your score works",
    method:
      "A 0–100 guide from participation, survival, economy, farming, and vision. Weights adapt to your role; supports are not scored on farm. Economy compares gold with the opposing role. Missing metrics are excluded. Not an official Riot rating or a rank prediction.",
    methodLimits:
      "For standard Summoner's Rift games lasting at least 10 minutes. These are general benchmarks, not champion- or rank-specific targets. Match context matters.",
    featureOne: "The full picture",
    featureOneText:
      "Up to 30 recent games. Every player, item build, and the stats that tell the story.",
    featureTwo: "Less guesswork",
    featureTwoText:
      "Short, specific feedback on farming, vision, survival, and team participation.",
    featureThree: "Know your comfort picks",
    featureThreeText:
      "Track your ranked progress, champion mastery, and the picks you come back to.",
    home: "Home",
    overview: "Overview",
    history: "Match history",
    insights: "Insights",
    search: "Search",
    searchNamePlaceholder: "Game name",
    searchTagPlaceholder: "Tag",
    testAccount: "Test account",
    testAccountHint: "Just exploring?",
    level: "Level",
    victories: "Wins",
    defeats: "Losses",
    victory: "Victory",
    defeat: "Defeat",
    blueTeam: "Blue team",
    redTeam: "Red team",
    recent: "Recent performance",
    sample: "recent games",
    averageScore: "Avg. insight score",
    scoredGames: "scored games",
    avgCs: "Avg. CS",
    avgKp: "Avg. participation",
    avgVision: "Avg. vision",
    vision: "Vision",
    player: "Player",
    build: "Item build",
    masteryPoints: "mastery points",
    ranked: "Ranked overview",
    mastery: "Champion mastery",
    picks: "Most played",
    snapshot: "At a glance",
    region: "Region",
    primaryRole: "Primary role",
    help: "A little insight. A better next game.",
    footer:
      "Rift Insight isn't endorsed by Riot Games. League of Legends and Riot Games are trademarks of Riot Games, Inc.",
    retry: "Try again",
    shortGame: "Short game / remake: not scored",
    unsupported: "Scoring unavailable for this mode or role",
    insufficientData: "Not enough data to score this game",
    improvementHint: "Open match details for the numbers and a next-game tip.",
    latest: "Latest first",
    game: "game",
    doubleKill: "Double kill",
    tripleKill: "Triple kill",
    quadraKill: "Quadra kill",
    pentaKill: "Pentakill",
  },
  "es-LATAM": {
    eyebrow: "TU PRÓXIMA PARTIDA EMPIEZA AQUÍ",
    title: "Cada partida.",
    titleAccent: "Más claridad.",
    intro:
      "Encuentra tu ventaja en la Grieta. Explora tus partidas, descubre tus fortalezas y convierte los pequeños detalles en tu próxima gran jugada.",
    searchCta: "Buscar mi perfil",
    howItWorks: "Explorar los análisis",
    noLogin: "Tu Riot ID. Sin registrarte.",
    preview: "EJEMPLO ILUSTRATIVO",
    score: "Puntuación",
    outOf: "de 100",
    analysis: "Análisis de rendimiento",
    improve: "En tu próxima partida",
    strengths: "Sigue así",
    balanced: "Sin patrones destacados en esta partida.",
    methodTitle: "Cómo funciona la puntuación",
    method:
      "Una guía de 0 a 100 basada en participación, supervivencia, economía, farmeo y visión. Los pesos dependen de tu rol; el farmeo no se evalúa en soportes. La economía compara el oro con el rival del mismo rol. Se omiten los datos faltantes. No es una calificación oficial de Riot ni una predicción de rango.",
    methodLimits:
      "Para partidas estándar en la Grieta de al menos 10 minutos. Son referencias generales, no objetivos por campeón o rango. El contexto importa.",
    featureOne: "La historia completa",
    featureOneText:
      "Hasta 30 partidas recientes. Cada jugador, sus objetos y las estadísticas que cuentan la historia.",
    featureTwo: "Menos dudas",
    featureTwoText:
      "Consejos breves sobre farmeo, visión, supervivencia y participación con tu equipo.",
    featureThree: "Conoce tus mejores picks",
    featureThreeText:
      "Sigue tu progreso ranked, la maestría y los campeones que más juegas.",
    home: "Inicio",
    overview: "Resumen",
    history: "Historial",
    insights: "Análisis",
    search: "Buscar",
    searchNamePlaceholder: "Nombre",
    searchTagPlaceholder: "Tag",
    testAccount: "Cuenta de prueba",
    testAccountHint: "¿Solo explorando?",
    level: "Nivel",
    victories: "Victorias",
    defeats: "Derrotas",
    victory: "Victoria",
    defeat: "Derrota",
    blueTeam: "Equipo azul",
    redTeam: "Equipo rojo",
    recent: "Rendimiento reciente",
    sample: "partidas recientes",
    averageScore: "Puntuación media",
    scoredGames: "partidas evaluadas",
    avgCs: "CS promedio",
    avgKp: "Participación media",
    avgVision: "Visión media",
    vision: "Visión",
    player: "Jugador",
    build: "Objetos",
    masteryPoints: "puntos de maestría",
    ranked: "Resumen ranked",
    mastery: "Maestría de campeones",
    picks: "Más jugados",
    snapshot: "De un vistazo",
    region: "Región",
    primaryRole: "Rol principal",
    help: "Más claridad. Una mejor partida.",
    footer:
      "Rift Insight no está respaldado por Riot Games. League of Legends y Riot Games son marcas de Riot Games, Inc.",
    retry: "Reintentar",
    shortGame: "Partida corta / remake: sin puntuación",
    unsupported: "Sin puntuación para este modo o rol",
    insufficientData: "Faltan datos para evaluar esta partida",
    improvementHint: "Abre los detalles para ver los datos y un consejo.",
    latest: "Más recientes",
    game: "partida",
    doubleKill: "Doble asesinato",
    tripleKill: "Triple asesinato",
    quadraKill: "Asesinato cuádruple",
    pentaKill: "Pentakill",
  },
};

export function getCopy(language: Language) {
  return copy[language];
}

export const metricLabels: Record<Language, Record<ScoreMetric, string>> = {
  en: {
    participation: "Participation",
    survival: "Survival",
    economy: "Economy",
    farming: "Farming",
    vision: "Vision",
  },
  "es-LATAM": {
    participation: "Participación",
    survival: "Supervivencia",
    economy: "Economía",
    farming: "Farmeo",
    vision: "Visión",
  },
};

const insights: Record<
  Language,
  Record<InsightId, [string, (value: number) => string]>
> = {
  en: {
    earlyFarmGap: [
      "Missed early farm",
      (v) =>
        `${v} lane minions in the first 10 minutes (guide: 45+). Practice last-hitting and catch waves before rotating.`,
    ],
    earlyFarmLead: [
      "Strong lane farm",
      (v) =>
        `${v} lane minions in the first 10 minutes. Keep collecting waves as you transition into the mid game.`,
    ],
    farmGap: [
      "More farm to collect",
      (v) =>
        `${v} CS/min. Catch safe waves or clear available camps between fights.`,
    ],
    strongFarm: [
      "Steady farming",
      (v) => `${v} CS/min. You maintained a consistent source of resources.`,
    ],
    highDeaths: [
      "Costly deaths",
      (v) =>
        `${v} deaths per 10 minutes. Check vision and nearby teammates before committing to a fight.`,
    ],
    safePlay: [
      "Hard to catch",
      (v) =>
        `${v} total deaths. Keep pairing that survival with pressure on the map.`,
    ],
    lowParticipation: [
      "Join more plays",
      (v) =>
        `${v}% kill participation. Look for windows to join your team when your wave or camps are handled.`,
    ],
    teamPlayer: [
      "Teamfight presence",
      (v) =>
        `${v}% kill participation. You contributed to most of your team's kills.`,
    ],
    visionGap: [
      "Light on vision",
      (v) =>
        `${v} vision score/min. Place useful wards before objectives and clear enemy vision when safe.`,
    ],
    strongVision: [
      "Vision control",
      (v) =>
        `${v} vision score/min. Keep refreshing vision around the next objective.`,
    ],
    economyLead: [
      "Gold advantage",
      (v) =>
        `${v}% more gold than the opposing role. Use item timing advantages to pressure objectives.`,
    ],
    economyGap: [
      "Behind on gold",
      (v) =>
        `${v}% less gold than the opposing role. Prioritize safe resources before the next big fight.`,
    ],
  },
  "es-LATAM": {
    earlyFarmGap: [
      "Farmeo inicial bajo",
      (v) =>
        `${v} súbditos de línea en 10 minutos (referencia: 45+). Practica el último golpe y recoge oleadas antes de rotar.`,
    ],
    earlyFarmLead: [
      "Buen farmeo inicial",
      (v) =>
        `${v} súbditos de línea en 10 minutos. Sigue recogiendo oleadas durante el juego medio.`,
    ],
    farmGap: [
      "Más farm disponible",
      (v) =>
        `${v} CS/min. Recoge oleadas seguras o limpia campamentos entre peleas.`,
    ],
    strongFarm: [
      "Farmeo constante",
      (v) => `${v} CS/min. Mantuviste una fuente constante de recursos.`,
    ],
    highDeaths: [
      "Muertes costosas",
      (v) =>
        `${v} muertes por cada 10 minutos. Revisa la visión y la posición de tu equipo antes de pelear.`,
    ],
    safePlay: [
      "Difícil de atrapar",
      (v) =>
        `${v} muertes en total. Combina esa supervivencia con presión en el mapa.`,
    ],
    lowParticipation: [
      "Únete a más jugadas",
      (v) =>
        `${v}% de participación. Busca oportunidades de unirte al equipo tras manejar tus oleadas o campamentos.`,
    ],
    teamPlayer: [
      "Presencia en peleas",
      (v) =>
        `${v}% de participación. Contribuiste a la mayoría de los asesinatos de tu equipo.`,
    ],
    visionGap: [
      "Falta de visión",
      (v) =>
        `${v} de visión/min. Coloca wards antes de los objetivos y elimina visión enemiga cuando sea seguro.`,
    ],
    strongVision: [
      "Control de visión",
      (v) =>
        `${v} de visión/min. Mantén la visión alrededor del próximo objetivo.`,
    ],
    economyLead: [
      "Ventaja de oro",
      (v) =>
        `${v}% más oro que el rival de tu rol. Aprovecha tus objetos para presionar objetivos.`,
    ],
    economyGap: [
      "Desventaja de oro",
      (v) =>
        `${v}% menos oro que el rival de tu rol. Prioriza recursos seguros antes de la próxima pelea.`,
    ],
  },
};

export function insightCopy(language: Language, id: InsightId, value: number) {
  const [label, description] = insights[language][id];
  return { label, description: description(value) };
}
