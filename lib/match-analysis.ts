import type { MatchRole } from "./types";

export type InsightId =
  | "earlyFarmGap"
  | "earlyFarmLead"
  | "farmGap"
  | "strongFarm"
  | "highDeaths"
  | "safePlay"
  | "lowParticipation"
  | "teamPlayer"
  | "visionGap"
  | "strongVision"
  | "economyLead"
  | "economyGap";

export type MatchInsight = {
  id: InsightId;
  tone: "positive" | "improve";
  value: number;
};
export type ScoreMetric =
  "participation" | "survival" | "economy" | "farming" | "vision";
export type MatchAnalysis = {
  version: 1;
  score: number | null;
  reason?: "shortGame" | "unsupported" | "insufficientData";
  breakdown: Array<{ metric: ScoreMetric; score: number; weight: number }>;
  insights: MatchInsight[];
};

type AnalysisInput = {
  queueId: number;
  mapId: number;
  durationSeconds: number;
  participant: Record<string, unknown>;
  participants: Array<Record<string, unknown>>;
};

const roles: MatchRole[] = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];
const queues = new Set([400, 420, 430, 440, 490, 700]);
const clamp = (value: number) => Math.max(0, Math.min(100, value));

function number(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : null;
}

function roleOf(participant: Record<string, unknown>) {
  return participant.teamPosition || participant.individualPosition;
}

export function analyzeMatch({
  queueId,
  mapId,
  durationSeconds,
  participant,
  participants,
}: AnalysisInput): MatchAnalysis {
  const unavailable = (reason: MatchAnalysis["reason"]): MatchAnalysis => ({
    version: 1,
    score: null,
    reason,
    breakdown: [],
    insights: [],
  });
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0)
    return unavailable("insufficientData");
  if (
    durationSeconds < 600 ||
    participants.some((entry) => entry.gameEndedInEarlySurrender === true)
  ) {
    return unavailable("shortGame");
  }
  const role = roleOf(participant) as MatchRole;
  if (mapId !== 11 || !queues.has(queueId) || !roles.includes(role))
    return unavailable("unsupported");
  const teamId = number(participant.teamId);
  if (teamId === null || participants.length !== 10)
    return unavailable("insufficientData");
  const team = participants.filter((entry) => entry.teamId === teamId);
  const enemies = participants.filter((entry) => entry.teamId !== teamId);
  if (team.length !== 5 || enemies.length !== 5)
    return unavailable("insufficientData");
  const opponents = enemies.filter((entry) => roleOf(entry) === role);
  const opponent = opponents.length === 1 ? opponents[0] : undefined;
  const minutes = durationSeconds / 60;
  const support = role === "UTILITY";
  const jungle = role === "JUNGLE";
  const weights: Record<ScoreMetric, number> = support
    ? { participation: 30, survival: 25, economy: 10, farming: 0, vision: 35 }
    : { participation: 25, survival: 25, economy: 20, farming: 20, vision: 10 };
  const breakdown: MatchAnalysis["breakdown"] = [];
  const insights: MatchInsight[] = [];
  const addMetric = (metric: ScoreMetric, score: number) => {
    breakdown.push({
      metric,
      score: Math.round(clamp(score)),
      weight: weights[metric],
    });
  };
  const addInsight = (
    id: InsightId,
    tone: MatchInsight["tone"],
    value: number,
  ) => {
    insights.push({ id, tone, value: Math.round(value * 10) / 10 });
  };

  const kills = number(participant.kills);
  const assists = number(participant.assists);
  const deaths = number(participant.deaths);
  const teamKills = team.every((entry) => number(entry.kills) !== null)
    ? team.reduce((total, entry) => total + (number(entry.kills) ?? 0), 0)
    : null;
  if (
    kills !== null &&
    assists !== null &&
    teamKills !== null &&
    teamKills > 0
  ) {
    const kp = clamp(((kills + assists) / teamKills) * 100);
    addMetric("participation", kp);
    if (teamKills >= 5) {
      if (kp < 35) addInsight("lowParticipation", "improve", kp);
      else if (kp >= 65) addInsight("teamPlayer", "positive", kp);
    }
  }
  if (deaths !== null) {
    const deathsPer10 = (deaths / minutes) * 10;
    addMetric("survival", 100 - 20 * deathsPer10);
    if (deathsPer10 >= 3) addInsight("highDeaths", "improve", deathsPer10);
    else if (deathsPer10 <= 1) addInsight("safePlay", "positive", deaths);
  }
  const gold = number(participant.goldEarned);
  const opponentGold = number(opponent?.goldEarned);
  if (gold !== null && opponentGold !== null && opponentGold > 0) {
    const ratio = gold / opponentGold;
    addMetric("economy", 50 * ratio);
    if (ratio >= 1.2) addInsight("economyLead", "positive", (ratio - 1) * 100);
    else if (ratio <= 0.8)
      addInsight("economyGap", "improve", (1 - ratio) * 100);
  }
  const laneCs = number(participant.totalMinionsKilled);
  const jungleCs = number(participant.neutralMinionsKilled);
  if (!support && laneCs !== null && jungleCs !== null) {
    const cspm = (laneCs + jungleCs) / minutes;
    addMetric("farming", (cspm / (jungle ? 6 : 8)) * 100);
    const challenges = participant.challenges as
      Record<string, unknown> | undefined;
    const earlyCs = number(challenges?.laneMinionsFirst10Minutes);
    // Early lane CS comes from Riot's measured challenge field, never from final CS.
    if (!jungle && earlyCs !== null && earlyCs <= laneCs && earlyCs < 45) {
      addInsight("earlyFarmGap", "improve", earlyCs);
    } else if (
      !jungle &&
      earlyCs !== null &&
      earlyCs <= laneCs &&
      earlyCs >= 75
    ) {
      addInsight("earlyFarmLead", "positive", earlyCs);
    } else if (cspm < (jungle ? 3.5 : 4.5)) {
      addInsight("farmGap", "improve", cspm);
    } else if (cspm >= (jungle ? 6 : 7.5)) {
      addInsight("strongFarm", "positive", cspm);
    }
  }
  const vision = number(participant.visionScore);
  if (vision !== null) {
    const visionPerMinute = vision / minutes;
    addMetric("vision", (visionPerMinute / (support ? 2 : 1)) * 100);
    if (visionPerMinute < (support ? 1 : 0.4))
      addInsight("visionGap", "improve", visionPerMinute);
    else if (visionPerMinute >= (support ? 2 : 1))
      addInsight("strongVision", "positive", visionPerMinute);
  }
  // Missing metrics are omitted and remaining weights are normalized, not treated as zero.
  if (breakdown.length < 3) return unavailable("insufficientData");
  const weightTotal = breakdown.reduce(
    (total, entry) => total + entry.weight,
    0,
  );
  const score = Math.round(
    breakdown.reduce((total, entry) => total + entry.score * entry.weight, 0) /
      weightTotal,
  );
  const improvements = insights.filter((entry) => entry.tone === "improve");
  const strengths = insights.filter((entry) => entry.tone === "positive");
  const selected = [
    ...improvements.slice(0, strengths.length ? 2 : 3),
    ...strengths,
  ].slice(0, 3);
  return { version: 1, score, breakdown, insights: selected };
}
