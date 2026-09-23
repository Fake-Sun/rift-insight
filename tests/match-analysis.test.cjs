const { test } = require("node:test");
const assert = require("node:assert/strict");
const { analyzeMatch } = require("../.test-build/match-analysis.js");

function fixture(overrides = {}, options = {}) {
  const roles = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];
  const participants = [100, 200].flatMap((teamId) =>
    roles.map((teamPosition) => ({
      teamId,
      teamPosition,
      kills: 5,
      assists: 8,
      deaths: 5,
      goldEarned: 12000,
      totalMinionsKilled: 150,
      neutralMinionsKilled: 0,
      visionScore: 30,
    })),
  );
  const participant = participants[2];
  Object.assign(participant, overrides);
  return {
    queueId: 420,
    mapId: 11,
    durationSeconds: 1800,
    participants,
    participant,
    ...options,
  };
}

test("produces a bounded score and at most three evidence-based insights", () => {
  const result = analyzeMatch(fixture());
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.equal(result.breakdown.length, 5);
  assert.equal(
    result.breakdown.reduce((sum, entry) => sum + entry.weight, 0),
    100,
  );
  assert.ok(result.insights.length <= 3);
});

test("score does not award points for the game result", () => {
  assert.deepEqual(
    analyzeMatch(fixture({ win: true })),
    analyzeMatch(fixture({ win: false })),
  );
});

test("improving farm, survival and vision improves the score", () => {
  const low = analyzeMatch(
    fixture({ deaths: 12, totalMinionsKilled: 90, visionScore: 10 }),
  );
  const high = analyzeMatch(
    fixture({ deaths: 2, totalMinionsKilled: 240, visionScore: 45 }),
  );
  assert.ok(high.score > low.score);
  assert.ok(low.insights.some((entry) => entry.id === "highDeaths"));
});

test("support is never penalized for farm or early CS", () => {
  const input = fixture();
  input.participant = input.participants[4];
  Object.assign(input.participant, {
    totalMinionsKilled: 0,
    challenges: { laneMinionsFirst10Minutes: 0 },
  });
  const result = analyzeMatch(input);
  assert.ok(!result.breakdown.some((entry) => entry.metric === "farming"));
  assert.ok(!result.insights.some((entry) => /farm/i.test(entry.id)));
  assert.equal(
    result.breakdown.find((entry) => entry.metric === "vision").weight,
    35,
  );
});

test("jungle uses its own farming benchmark and ignores lane CS at ten", () => {
  const input = fixture();
  input.participant = input.participants[1];
  Object.assign(input.participant, {
    totalMinionsKilled: 0,
    neutralMinionsKilled: 180,
    challenges: { laneMinionsFirst10Minutes: 0 },
  });
  const result = analyzeMatch(input);
  assert.equal(
    result.breakdown.find((entry) => entry.metric === "farming").score,
    100,
  );
  assert.ok(!result.insights.some((entry) => entry.id === "earlyFarmGap"));
});

test("early farm feedback uses Riot's measured ten-minute field", () => {
  const result = analyzeMatch(
    fixture({ challenges: { laneMinionsFirst10Minutes: 32 } }),
  );
  assert.equal(
    result.insights.find((entry) => entry.id === "earlyFarmGap").value,
    32,
  );
});

test("zero early farm is valid data, but missing early farm is not inferred", () => {
  assert.ok(
    analyzeMatch(
      fixture({ challenges: { laneMinionsFirst10Minutes: 0 } }),
    ).insights.some((entry) => entry.id === "earlyFarmGap"),
  );
  assert.ok(
    !analyzeMatch(fixture()).insights.some((entry) =>
      entry.id.startsWith("early"),
    ),
  );
});

test("remakes and games shorter than ten minutes are not scored", () => {
  assert.equal(
    analyzeMatch(fixture({}, { durationSeconds: 599 })).reason,
    "shortGame",
  );
  assert.equal(
    analyzeMatch(fixture({ gameEndedInEarlySurrender: true })).score,
    null,
  );
});

test("ARAM, Arena, unknown positions and non-Rift maps are excluded", () => {
  for (const options of [{ queueId: 450 }, { queueId: 1700 }, { mapId: 12 }]) {
    assert.equal(analyzeMatch(fixture({}, options)).reason, "unsupported");
  }
  assert.equal(analyzeMatch(fixture({ teamPosition: "UNKNOWN" })).score, null);
});

test("missing vision is excluded instead of counted as poor vision", () => {
  const result = analyzeMatch(fixture({ visionScore: undefined }));
  assert.ok(!result.breakdown.some((entry) => entry.metric === "vision"));
  assert.ok(!result.insights.some((entry) => entry.id === "visionGap"));
  const total = result.breakdown.reduce(
    (sum, e) => sum + e.score * e.weight,
    0,
  );
  const weights = result.breakdown.reduce((sum, e) => sum + e.weight, 0);
  assert.equal(result.score, Math.round(total / weights));
});

test("a zero-kill team is not called low participation", () => {
  const input = fixture();
  input.participants.forEach((entry) => {
    entry.kills = 0;
    entry.assists = 0;
  });
  const result = analyzeMatch(input);
  assert.ok(!result.insights.some((entry) => entry.id === "lowParticipation"));
  assert.ok(
    !result.breakdown.some((entry) => entry.metric === "participation"),
  );
});

test("missing opponent economy, duplicate roles and zero gold do not divide by zero", () => {
  for (const gold of [undefined, 0, NaN, Infinity]) {
    const input = fixture();
    input.participants[7].goldEarned = gold;
    const result = analyzeMatch(input);
    assert.ok(Number.isFinite(result.score));
    assert.ok(!result.breakdown.some((entry) => entry.metric === "economy"));
  }
  const input = fixture();
  input.participants[6].teamPosition = "MIDDLE";
  assert.ok(
    !analyzeMatch(input).breakdown.some((entry) => entry.metric === "economy"),
  );
});

test("insufficient and malformed data never produces a fabricated score", () => {
  assert.equal(
    analyzeMatch(
      fixture({
        kills: undefined,
        assists: undefined,
        visionScore: undefined,
        totalMinionsKilled: undefined,
      }),
    ).score,
    null,
  );
  for (const durationSeconds of [0, -1, NaN, Infinity])
    assert.equal(analyzeMatch(fixture({}, { durationSeconds })).score, null);
  const input = fixture();
  input.participants.pop();
  assert.equal(analyzeMatch(input).score, null);
});

test("extreme values stay bounded without changing the source match", () => {
  const input = fixture({
    kills: 10000,
    assists: 10000,
    goldEarned: 1000000,
    totalMinionsKilled: 10000,
    visionScore: 10000,
  });
  const before = JSON.stringify(input);
  const result = analyzeMatch(input);
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.ok(
    result.breakdown.every((entry) => entry.score >= 0 && entry.score <= 100),
  );
  assert.equal(JSON.stringify(input), before);
});
