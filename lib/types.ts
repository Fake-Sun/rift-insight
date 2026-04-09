export type Language = "en" | "es-LATAM";

export type Region =
  | "NA1"
  | "EUW1"
  | "EUN1"
  | "KR"
  | "JP1"
  | "BR1"
  | "LA1"
  | "LA2"
  | "OC1"
  | "TR1"
  | "RU";

export type MatchRole = "TOP" | "JUNGLE" | "MIDDLE" | "BOTTOM" | "UTILITY" | "UNKNOWN";

export type TimelineSeries = {
  kp: number[];
};

export type MatchItem = {
  id: number;
  icon: string;
};

export type MatchSpell = {
  name: string;
  icon: string;
};

export type ProfileResponse = {
  profile: {
    gameName: string;
    tagLine: string;
    puuid: string;
    region: string;
    summonerLevel: number;
    profileIcon: string;
  };
  ranked: Array<{
    queueType: string;
    queueLabel: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
    winRate: number;
    hotStreak: boolean;
    tierLabel: string;
  }>;
  featuredQueue: {
    queueType: string;
    queueLabel: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
    winRate: number;
    hotStreak: boolean;
    tierLabel: string;
    emblemTier?: string;
    isFallback?: boolean;
    displayLabel?: string;
  } | null;
  mastery: Array<{
    id: number;
    name: string;
    points: number;
    level: number;
    icon: string;
  }>;
  matches: Array<{
    matchId: string;
    queueId: number;
    championName: string;
    championIcon: string;
    role: MatchRole;
    win: boolean;
    kills: number;
    deaths: number;
    assists: number;
    kda: string;
    cs: number;
    killParticipation: number;
    damage: string;
    gold: string;
    duration: string;
    visionScore: number;
    summonerId: string;
    gameEndTimestamp: number;
    largestMultiKill: number;
    totalDamageTaken: string;
    csPerMinute: string;
    goldPerMinute: number;
    damagePerMinute: number;
    takenPerMinute: number;
    spells: MatchSpell[];
    items: MatchItem[];
    timeline: TimelineSeries;
  }>;
  summary: {
    totalGames: number;
    winRate: number;
    kdaRatio: string;
    averageCs: string;
    averageKillParticipation: string;
    averageVision: string;
    recentForm: string;
  };
  championStats: Array<{
    name: string;
    games: number;
    winRate: number;
    averageKda: string;
    icon: string;
  }>;
  meta: Array<{
    label: string;
    value: string;
    accent: string;
  }>;
};
