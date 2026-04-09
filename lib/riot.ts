import "server-only";

import { ProfileResponse } from "@/lib/types";

const RIOT_API_KEY = process.env.RIOT_API_KEY || "";
const MATCH_COUNT = 5;
const CACHE_TTL = {
  profile: 5 * 60 * 1000,
  account: 30 * 60 * 1000,
  summoner: 10 * 60 * 1000,
  mastery: 10 * 60 * 1000,
  league: 3 * 60 * 1000,
  matchIds: 2 * 60 * 1000,
  match: 15 * 60 * 1000,
  ddragon: 12 * 60 * 60 * 1000
};

const clusterByPlatform: Record<string, string> = {
  BR1: "americas",
  EUN1: "europe",
  EUW1: "europe",
  JP1: "asia",
  KR: "asia",
  LA1: "americas",
  LA2: "americas",
  ME1: "europe",
  NA1: "americas",
  OC1: "sea",
  PH2: "sea",
  RU: "europe",
  SG2: "sea",
  TH2: "sea",
  TR1: "europe",
  TW2: "sea",
  VN2: "sea"
};

const queueMap: Record<string, string> = {
  RANKED_SOLO_5x5: "Ranked Solo/Duo",
  RANKED_FLEX_SR: "Ranked Flex"
};

const cache = new Map<string, { value: unknown; expiresAt: number }>();

type RiotOptions = {
  forceRefresh?: boolean;
};

type ChampionCatalog = {
  version: string;
  championByKey: Record<string, { id: string; key: string; name: string }>;
  championByName: Record<string, { id: string; key: string; name: string }>;
  spellByKey: Record<string, { id: string; key: string; name: string }>;
};

export function isRiotConfigured() {
  return Boolean(RIOT_API_KEY);
}

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry || entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.value as T;
}

function setCached<T>(key: string, value: T, ttlMs: number): T {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  });
  return value;
}

async function riotFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "X-Riot-Token": RIOT_API_KEY
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const bodyText = await response.text();
    let parsedMessage = "";
    try {
      const parsed = JSON.parse(bodyText) as { status?: { message?: string }; message?: string };
      parsedMessage = parsed.status?.message || parsed.message || "";
    } catch {
      parsedMessage = "";
    }

    const error = new Error(parsedMessage || bodyText || `Riot API error ${response.status}`) as Error & {
      statusCode?: number;
    };
    error.statusCode = response.status;
    throw error;
  }

  return response.json() as Promise<T>;
}

async function riotFetchCached<T>(
  url: string,
  cacheKey: string,
  ttlMs: number,
  options: RiotOptions = {}
): Promise<T> {
  if (!options.forceRefresh) {
    const cached = getCached<T>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const value = await riotFetch<T>(url);
  return setCached(cacheKey, value, ttlMs);
}

async function riotFetchOptional<T>(
  url: string,
  fallbackValue: T,
  options: RiotOptions & { ignoreStatuses?: number[]; cacheKey?: string; ttlMs?: number } = {}
): Promise<T> {
  try {
    if (options.cacheKey && options.ttlMs) {
      return await riotFetchCached<T>(url, options.cacheKey, options.ttlMs, options);
    }
    return await riotFetch<T>(url);
  } catch (error) {
    const statusCode =
      typeof error === "object" && error && "statusCode" in error
        ? Number((error as { statusCode?: number }).statusCode)
        : 500;
    if ((options.ignoreStatuses || []).includes(statusCode)) {
      return fallbackValue;
    }
    throw error;
  }
}

async function getChampionCatalog(): Promise<ChampionCatalog> {
  const cachedCatalog = getCached<ChampionCatalog>("ddragon:catalog");
  if (cachedCatalog) {
    return cachedCatalog;
  }

  try {
    const versions = await fetch("https://ddragon.leagueoflegends.com/api/versions.json", {
      cache: "no-store"
    }).then((response) => response.json() as Promise<string[]>);
    const version = versions[0];
    const [championPayload, spellPayload] = await Promise.all([
      fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`, {
        cache: "no-store"
      }).then((response) => response.json() as Promise<{ data: Record<string, { id: string; key: string; name: string }> }>),
      fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/summoner.json`, {
        cache: "no-store"
      }).then((response) => response.json() as Promise<{ data: Record<string, { id: string; key: string; name: string }> }>)
    ]);

    const championByKey: ChampionCatalog["championByKey"] = {};
    const championByName: ChampionCatalog["championByName"] = {};
    const spellByKey: ChampionCatalog["spellByKey"] = {};

    Object.values(championPayload.data).forEach((champion) => {
      championByKey[champion.key] = champion;
      championByName[champion.name.toLowerCase()] = champion;
    });

    Object.values(spellPayload.data).forEach((spell) => {
      spellByKey[spell.key] = spell;
    });

    return setCached(
      "ddragon:catalog",
      {
        version,
        championByKey,
        championByName,
        spellByKey
      },
      CACHE_TTL.ddragon
    );
  } catch (error) {
    console.error("Data Dragon fetch failed, using empty catalog:", error);
    return {
      version: "latest",
      championByKey: {},
      championByName: {},
      spellByKey: {}
    };
  }
}

function platformToCluster(platform: string) {
  const cluster = clusterByPlatform[platform];
  if (!cluster) {
    const error = new Error(`Unsupported region "${platform}".`) as Error & { statusCode?: number };
    error.statusCode = 400;
    throw error;
  }
  return cluster;
}

function profileIconUrl(version: string, profileIconId: number) {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`;
}

function championIconUrl(version: string, championId: string) {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championId}.png`;
}

function spellIconUrl(version: string, spellId: string) {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spellId}.png`;
}

function itemIconUrl(version: string, itemId: number) {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`;
}

function summarizeRanked(entries: Array<Record<string, unknown>>) {
  const ranked = entries.map((entry) => {
    const wins = Number(entry.wins || 0);
    const losses = Number(entry.losses || 0);
    const queueType = String(entry.queueType || "");
    const tier = String(entry.tier || "");
    const rank = String(entry.rank || "");
    const leaguePoints = Number(entry.leaguePoints || 0);
    return {
      queueType,
      queueLabel: queueMap[queueType] || queueType,
      tier,
      rank,
      leaguePoints,
      wins,
      losses,
      winRate: Math.round((wins / Math.max(1, wins + losses)) * 100),
      hotStreak: Boolean(entry.hotStreak),
      tierLabel: `${tier} ${rank} ${leaguePoints} LP`,
      emblemTier: tier || "UNRANKED",
      displayLabel: `${tier} ${rank} ${leaguePoints} LP`
    };
  });

  const featuredQueue =
    ranked.find((entry) => entry.queueType === "RANKED_SOLO_5x5") || ranked[0] || null;

  return { ranked, featuredQueue };
}

function deriveFeaturedQueueFromMatches(matches: ProfileResponse["matches"]) {
  const rankedQueues = matches.filter((match) => match.queueId === 420 || match.queueId === 440);
  if (!rankedQueues.length) {
    return null;
  }

  const counts = new Map<number, number>();
  rankedQueues.forEach((match) => {
    counts.set(match.queueId, (counts.get(match.queueId) || 0) + 1);
  });

  const [queueId] =
    [...counts.entries()].sort((left, right) => right[1] - left[1])[0] || [];

  if (!queueId) {
    return null;
  }

  const queueType = queueId === 420 ? "RANKED_SOLO_5x5" : "RANKED_FLEX_SR";
  return {
    queueType,
    queueLabel: queueMap[queueType] || `Queue ${queueId}`,
    tier: "",
    rank: "",
    leaguePoints: 0,
    wins: 0,
    losses: 0,
    winRate: Math.round((rankedQueues.filter((match) => match.queueId === queueId && match.win).length / Math.max(1, rankedQueues.filter((match) => match.queueId === queueId).length)) * 100),
    hotStreak: false,
    tierLabel: "Rank unavailable",
    emblemTier: "",
    isFallback: true,
    displayLabel: queueMap[queueType] || `Queue ${queueId}`
  };
}

function formatMatchDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

function normalizeRole(participant: Record<string, unknown>) {
  const role = String(participant.teamPosition || participant.individualPosition || "UNKNOWN");
  return (role || "UNKNOWN") as ProfileResponse["matches"][number]["role"];
}

function computeSummary(matches: ProfileResponse["matches"]): ProfileResponse["summary"] {
  if (!matches.length) {
    return {
      totalGames: 0,
      winRate: 0,
      kdaRatio: "0.00",
      averageCs: "0",
      averageKillParticipation: "0%",
      averageVision: "0",
      recentForm: "No games"
    };
  }

  const totals = matches.reduce(
    (accumulator, match) => {
      accumulator.wins += match.win ? 1 : 0;
      accumulator.kills += match.kills;
      accumulator.deaths += match.deaths;
      accumulator.assists += match.assists;
      accumulator.cs += match.cs;
      accumulator.kp += match.killParticipation;
      accumulator.vision += match.visionScore;
      return accumulator;
    },
    { wins: 0, kills: 0, deaths: 0, assists: 0, cs: 0, kp: 0, vision: 0 }
  );

  return {
    totalGames: matches.length,
    winRate: Math.round((totals.wins / matches.length) * 100),
    kdaRatio: ((totals.kills + totals.assists) / Math.max(1, totals.deaths)).toFixed(2),
    averageCs: Math.round(totals.cs / matches.length).toString(),
    averageKillParticipation: `${Math.round(totals.kp / matches.length)}%`,
    averageVision: (totals.vision / matches.length).toFixed(1),
    recentForm: matches
      .slice(0, 10)
      .map((match) => (match.win ? "W" : "L"))
      .join(" ")
  };
}

function computeChampionStats(matches: ProfileResponse["matches"], championCatalog: ChampionCatalog) {
  const grouped = new Map<
    string,
    { name: string; games: number; wins: number; kills: number; deaths: number; assists: number }
  >();

  matches.forEach((match) => {
    const current = grouped.get(match.championName) || {
      name: match.championName,
      games: 0,
      wins: 0,
      kills: 0,
      deaths: 0,
      assists: 0
    };

    current.games += 1;
    current.wins += match.win ? 1 : 0;
    current.kills += match.kills;
    current.deaths += match.deaths;
    current.assists += match.assists;
    grouped.set(match.championName, current);
  });

  return [...grouped.values()]
    .map((entry) => {
      const champion = championCatalog.championByName[entry.name.toLowerCase()];
      return {
        name: entry.name,
        games: entry.games,
        winRate: Math.round((entry.wins / entry.games) * 100),
        averageKda: ((entry.kills + entry.assists) / Math.max(1, entry.deaths)).toFixed(2),
        icon: champion ? championIconUrl(championCatalog.version, champion.id) : ""
      };
    })
    .sort((left, right) => right.games - left.games)
    .slice(0, 5);
}

function buildMeta(profile: ProfileResponse["profile"], matches: ProfileResponse["matches"], ranked: ProfileResponse["ranked"]) {
  const primaryRoleCounts = new Map<string, number>();
  matches.forEach((match) => {
    primaryRoleCounts.set(match.role, (primaryRoleCounts.get(match.role) || 0) + 1);
  });

  const topRole =
    [...primaryRoleCounts.entries()].sort((left, right) => right[1] - left[1])[0] || null;

  return [
    {
      label: "Region",
      value: `${profile.region} account cluster`,
      accent: profile.region
    },
    {
      label: "Primary Role",
      value: topRole ? `${topRole[0]} in ${topRole[1]} of ${matches.length} games` : "Unknown",
      accent: topRole ? topRole[0] : "N/A"
    },
    {
      label: "Best Queue",
      value: ranked[0] ? `${ranked[0].queueLabel} at ${ranked[0].winRate}% WR` : "Unranked",
      accent: ranked[0] ? `${ranked[0].leaguePoints} LP` : "N/A"
    }
  ];
}

export async function getLiveProfile(
  gameName: string,
  tagLine: string,
  region: string,
  options: RiotOptions = {}
): Promise<ProfileResponse> {
  if (!RIOT_API_KEY) {
    const error = new Error(
      "Missing RIOT_API_KEY. Add it to your environment before searching live profiles."
    ) as Error & { statusCode?: number };
    error.statusCode = 500;
    throw error;
  }

  const cacheKey = `profile:${region}:${gameName}:${tagLine}`.toLowerCase();
  const cached = options.forceRefresh ? null : getCached<ProfileResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  const cluster = platformToCluster(region);
  const championCatalog = await getChampionCatalog();

  const account = await riotFetchCached<{ puuid: string; gameName: string; tagLine: string }>(
    `https://${cluster}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
    `account:${region}:${gameName}:${tagLine}`.toLowerCase(),
    CACHE_TTL.account,
    options
  );

  const [summoner, masteryEntries, matchIds] = await Promise.all([
    riotFetchCached<{ id?: string; summonerLevel: number; profileIconId: number }>(
      `https://${region.toLowerCase()}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(account.puuid)}`,
      `summoner:${region}:${account.puuid}`.toLowerCase(),
      CACHE_TTL.summoner,
      options
    ),
    riotFetchCached<Array<{ championId: number; championPoints: number; championLevel: number }>>(
      `https://${region.toLowerCase()}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${encodeURIComponent(account.puuid)}/top?count=5`,
      `mastery:${region}:${account.puuid}`.toLowerCase(),
      CACHE_TTL.mastery,
      options
    ),
    riotFetchCached<string[]>(
      `https://${cluster}.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(account.puuid)}/ids?start=0&count=${MATCH_COUNT}`,
      `matchids:${region}:${account.puuid}:${MATCH_COUNT}`.toLowerCase(),
      CACHE_TTL.matchIds,
      options
    )
  ]);

  const rawMatches = await Promise.all(
    matchIds.map((matchId) =>
      riotFetchCached<{
        metadata: { matchId: string };
        info: {
          queueId: number;
          gameDuration: number;
          gameEndTimestamp?: number;
          gameCreation: number;
          participants: Array<Record<string, unknown>>;
        };
      }>(
        `https://${cluster}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(matchId)}`,
        `match:${cluster}:${matchId}`.toLowerCase(),
        CACHE_TTL.match,
        options
      )
    )
  );

  const matches: ProfileResponse["matches"] = rawMatches
    .map((match) => {
      const participant = match.info.participants.find((entry) => entry.puuid === account.puuid);
      if (!participant) {
        return null;
      }

      const teamKills = match.info.participants
        .filter((entry) => entry.teamId === participant.teamId)
        .reduce((total, entry) => total + Number(entry.kills || 0), 0);
      const champion = championCatalog.championByName[String(participant.championName).toLowerCase()];
      const spell1 = championCatalog.spellByKey[String(participant.summoner1Id || "")];
      const spell2 = championCatalog.spellByKey[String(participant.summoner2Id || "")];
      const gameDurationMinutes = Math.max(1, match.info.gameDuration / 60);
      const cs = Number(participant.totalMinionsKilled || 0) + Number(participant.neutralMinionsKilled || 0);
      const totalDamageDealt = Number(participant.totalDamageDealtToChampions || 0);
      const totalDamageTaken = Number(participant.totalDamageTaken || 0);
      const goldEarned = Number(participant.goldEarned || 0);

      return {
        matchId: match.metadata.matchId,
        queueId: match.info.queueId,
        championName: String(participant.championName || "Unknown"),
        championIcon: champion ? championIconUrl(championCatalog.version, champion.id) : "",
        role: normalizeRole(participant),
        win: Boolean(participant.win),
        kills: Number(participant.kills || 0),
        deaths: Number(participant.deaths || 0),
        assists: Number(participant.assists || 0),
        kda: ((Number(participant.kills || 0) + Number(participant.assists || 0)) / Math.max(1, Number(participant.deaths || 0))).toFixed(2),
        cs,
        killParticipation: teamKills
          ? Math.round(((Number(participant.kills || 0) + Number(participant.assists || 0)) / teamKills) * 100)
          : 0,
        damage: `${Math.round(totalDamageDealt / 100) / 10}k`,
        gold: `${Math.round(goldEarned / 100) / 10}k`,
        duration: formatMatchDuration(match.info.gameDuration),
        visionScore: Number(participant.visionScore || 0),
        summonerId: String(participant.summonerId || ""),
        gameEndTimestamp: match.info.gameEndTimestamp || match.info.gameCreation + match.info.gameDuration * 1000,
        largestMultiKill: Number(participant.largestMultiKill || 0),
        totalDamageTaken: `${Math.round(totalDamageTaken / 100) / 10}k`,
        csPerMinute: (cs / gameDurationMinutes).toFixed(1),
        goldPerMinute: Math.round(goldEarned / gameDurationMinutes),
        damagePerMinute: Math.round(totalDamageDealt / gameDurationMinutes),
        takenPerMinute: Math.round(totalDamageTaken / gameDurationMinutes),
        spells: [
          spell1 ? { name: spell1.name, icon: spellIconUrl(championCatalog.version, spell1.id) } : null,
          spell2 ? { name: spell2.name, icon: spellIconUrl(championCatalog.version, spell2.id) } : null
        ].filter(Boolean) as ProfileResponse["matches"][number]["spells"],
        items: [
          Number(participant.item0 || 0),
          Number(participant.item1 || 0),
          Number(participant.item2 || 0),
          Number(participant.item3 || 0),
          Number(participant.item4 || 0),
          Number(participant.item5 || 0),
          Number(participant.item6 || 0)
        ].map((itemId) => ({
          id: itemId,
          icon: itemId ? itemIconUrl(championCatalog.version, itemId) : ""
        })),
        timeline: {
          kp: []
        }
      };
    })
    .filter(Boolean) as ProfileResponse["matches"];

  const encryptedSummonerId = summoner.id || matches.find((match) => match.summonerId)?.summonerId || "";
  const leagueEntries = encryptedSummonerId
    ? await riotFetchOptional<Array<Record<string, unknown>>>(
        `https://${region.toLowerCase()}.api.riotgames.com/lol/league/v4/entries/by-summoner/${encodeURIComponent(encryptedSummonerId)}`,
        [],
        {
          ignoreStatuses: [403, 404],
          cacheKey: `league:${region}:${encryptedSummonerId}`.toLowerCase(),
          ttlMs: CACHE_TTL.league,
          forceRefresh: options.forceRefresh
        }
      )
    : [];

  const { ranked, featuredQueue: rankedFeaturedQueue } = summarizeRanked(leagueEntries);
  const featuredQueue = rankedFeaturedQueue || deriveFeaturedQueueFromMatches(matches);
  const mastery = masteryEntries.map((entry) => {
    const champion = championCatalog.championByKey[String(entry.championId)];
    return {
      id: entry.championId,
      name: champion?.name || `Champion ${entry.championId}`,
      points: entry.championPoints,
      level: entry.championLevel,
      icon: champion ? championIconUrl(championCatalog.version, champion.id) : ""
    };
  });

  const profile: ProfileResponse["profile"] = {
    gameName: account.gameName,
    tagLine: account.tagLine,
    puuid: account.puuid,
    region,
    summonerLevel: summoner.summonerLevel,
    profileIcon: profileIconUrl(championCatalog.version, summoner.profileIconId)
  };

  return setCached(
    cacheKey,
    {
      profile,
      ranked,
      featuredQueue,
      mastery,
      matches,
      summary: computeSummary(matches),
      championStats: computeChampionStats(matches, championCatalog),
      meta: buildMeta(profile, matches, ranked)
    },
    CACHE_TTL.profile
  );
}
