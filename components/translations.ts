import type { Language, MatchRole } from "@/lib/types";

export const quickProfiles = [
  { gameName: "Fake Sun", tagLine: "Kite", region: "LA2" as const },
  { gameName: "Faker", tagLine: "KR1", region: "KR" as const },
  { gameName: "Keria", tagLine: "KR1", region: "KR" as const },
  { gameName: "Canyon", tagLine: "KR1", region: "KR" as const }
];

export const laneOptions: Array<"All" | MatchRole> = ["All", "TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];

export const roleSymbols: Record<string, string> = {
  TOP: "T",
  JUNGLE: "J",
  MIDDLE: "M",
  BOTTOM: "A",
  UTILITY: "S",
  UNKNOWN: "?"
};

const queueLabels: Record<number, string> = {
  400: "Normal Draft",
  420: "Ranked Solo/Duo",
  430: "Normal Blind",
  440: "Ranked Flex",
  450: "ARAM",
  700: "Clash",
  900: "URF",
  1700: "Arena"
};

export const translations = {
  en: {
    brandEyebrow: "Live Stats Platform",
    navSummoner: "Summoner",
    navChampions: "Champions",
    navMeta: "Meta",
    language: "Language",
    heroEyebrow: "Real Riot API Search",
    heroTitle: "Look up live Riot IDs, ranked queues, mastery, and recent matches.",
    heroText:
      "The app uses a secure Next.js backend for Riot API access, caching, and a responsive dashboard experience on desktop and mobile.",
    riotId: "Riot ID",
    gameName: "Game name",
    tagLine: "Tag line",
    loadProfile: "Load profile",
    refreshLive: "Refresh live",
    recentMatches: "Recent Matches",
    liveTimeline: "Live match timeline",
    championStats: "Champion Stats",
    mostPlayed: "Most played picks",
    queueSnapshot: "Queue Snapshot",
    accountInsights: "Live account insights",
    searchTitle: "Search a Riot ID",
    searchDesc: "Use game name, tag line, and region to load a live League profile.",
    loading: "Loading cached/live Riot data...",
    refreshing: "Refreshing live Riot data...",
    waiting: "Waiting for a live profile request.",
    loaded: "Loaded",
    refreshed: "Refreshed",
    from: "from",
    profileUnavailable: "Profile unavailable",
    topQueue: "Top Queue",
    winRate: "Win Rate",
    recentForm: "Recent Form",
    noGames: "No games",
    noRankedData: "No ranked data",
    noRankedDataDesc: "This player has no current ranked entries on this server.",
    rankOverview: "Rank Overview",
    liveRankedProfile: "Live ranked profile",
    championMastery: "Champion Mastery",
    topMasteryPicks: "Top mastery picks",
    noMasteryData: "No mastery data",
    noMasteryDataDesc: "Riot returned no champion mastery records for this account.",
    matches: "Matches",
    vision: "Vision",
    allLanes: "All Lanes",
    noMatchesLane: "No matches for this lane filter",
    noMatchesLaneDesc: "Switch lanes to inspect the rest of the recent match history.",
    games: "games",
    noChampionBreakdown: "No champion breakdown",
    noChampionBreakdownDesc: "Not enough match history came back to compute champion stats.",
    noQueueInsights: "No queue insights",
    noQueueInsightsDesc: "Queue and role insights will appear after a successful profile fetch.",
    unranked: "Unranked"
  },
  "es-LATAM": {
    brandEyebrow: "Plataforma de estadísticas en vivo",
    navSummoner: "Invocador",
    navChampions: "Campeones",
    navMeta: "Meta",
    language: "Idioma",
    heroEyebrow: "Búsqueda real con Riot API",
    heroTitle: "Busca Riot IDs en vivo, colas ranked, maestría y partidas recientes.",
    heroText:
      "La app usa un backend seguro en Next.js para Riot API, caché y una experiencia responsive en escritorio y móvil.",
    riotId: "Riot ID",
    gameName: "Nombre de juego",
    tagLine: "Etiqueta",
    loadProfile: "Cargar perfil",
    refreshLive: "Actualizar en vivo",
    recentMatches: "Partidas recientes",
    liveTimeline: "Timeline de partidas en vivo",
    championStats: "Estadísticas de campeones",
    mostPlayed: "Picks más jugados",
    queueSnapshot: "Resumen de colas",
    accountInsights: "Insights de la cuenta",
    searchTitle: "Busca un Riot ID",
    searchDesc: "Usa nombre de juego, etiqueta y región para cargar un perfil de League en vivo.",
    loading: "Cargando datos en caché/en vivo de Riot...",
    refreshing: "Actualizando datos en vivo de Riot...",
    waiting: "Esperando una solicitud de perfil en vivo.",
    loaded: "Perfil cargado",
    refreshed: "Perfil actualizado",
    from: "desde",
    profileUnavailable: "Perfil no disponible",
    topQueue: "Mejor cola",
    winRate: "Win Rate",
    recentForm: "Forma reciente",
    noGames: "Sin partidas",
    noRankedData: "Sin datos ranked",
    noRankedDataDesc: "Este jugador no tiene entradas ranked actuales en este servidor.",
    rankOverview: "Resumen ranked",
    liveRankedProfile: "Perfil ranked en vivo",
    championMastery: "Maestría de campeón",
    topMasteryPicks: "Picks con más maestría",
    noMasteryData: "Sin datos de maestría",
    noMasteryDataDesc: "Riot no devolvió registros de maestría para esta cuenta.",
    matches: "Partidas",
    vision: "Visión",
    allLanes: "Todas las líneas",
    noMatchesLane: "No hay partidas para este filtro",
    noMatchesLaneDesc: "Cambia la línea para revisar el resto del historial reciente.",
    games: "partidas",
    noChampionBreakdown: "Sin desglose de campeones",
    noChampionBreakdownDesc: "No volvió suficiente historial para calcular estadísticas por campeón.",
    noQueueInsights: "Sin insights de colas",
    noQueueInsightsDesc: "Los insights de colas y roles aparecerán tras cargar un perfil.",
    unranked: "Sin rankear"
  }
} as const;

export function getTranslator(language: Language) {
  return (key: keyof (typeof translations)["en"]) => translations[language][key] || translations.en[key];
}

export function queueLabelFor(language: Language, queueId: number) {
  const base = queueLabels[queueId] || `Queue ${queueId}`;
  if (language !== "es-LATAM") return base;
  const map: Record<string, string> = {
    "Ranked Solo/Duo": "Solo/Dúo Ranked",
    "Ranked Flex": "Flex Ranked"
  };
  return map[base] || base;
}

export function laneLabel(language: Language, lane: "All" | MatchRole) {
  if (lane === "All") return translations[language].allLanes;
  if (language !== "es-LATAM") return lane;
  const map: Record<MatchRole, string> = {
    TOP: "Top",
    JUNGLE: "Jungla",
    MIDDLE: "Medio",
    BOTTOM: "ADC",
    UTILITY: "Soporte",
    UNKNOWN: "Desconocido"
  };
  return map[lane];
}
