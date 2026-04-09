"use client";

import { useEffect, useMemo, useState } from "react";
import { CustomSelect, type SelectOption } from "@/components/custom-select";
import {
  getTranslator,
  laneLabel,
  laneOptions,
  quickProfiles,
  queueLabelFor,
  roleSymbols
} from "@/components/translations";
import type { Language, MatchRole, ProfileResponse, Region } from "@/lib/types";

const rankMedalUrls: Record<string, string> = {
  UNRANKED: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/unranked.svg",
  IRON: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/iron.svg",
  BRONZE: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/bronze.svg",
  SILVER: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/silver.svg",
  GOLD: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/gold.svg",
  PLATINUM: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/platinum.svg",
  EMERALD: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/emerald.svg",
  DIAMOND: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/diamond.svg",
  MASTER: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/master.svg",
  GRANDMASTER: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/grandmaster.svg",
  CHALLENGER: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/challenger.svg"
};

function RankMedal({ tier, alt }: { tier: string; alt: string }) {
  if (!tier) {
    return null;
  }
  const src = rankMedalUrls[tier.toUpperCase()] || rankMedalUrls.UNRANKED;
  return (
    <img
      className="rank-medal"
      src={src}
      alt={alt}
      onError={(event) => {
        const target = event.currentTarget;
        if (target.dataset.fallbackApplied === "true") {
          target.style.display = "none";
          return;
        }
        target.dataset.fallbackApplied = "true";
        target.src = rankMedalUrls.UNRANKED;
      }}
    />
  );
}

export function RiftInsightApp() {
  const [language, setLanguage] = useState<Language>("en");
  const [gameName, setGameName] = useState("Fake Sun");
  const [tagLine, setTagLine] = useState("Kite");
  const [region, setRegion] = useState<Region>("LA2");
  const [lane, setLane] = useState<"All" | MatchRole>("All");
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [status, setStatus] = useState<{ message: string; type: "info" | "success" | "error" }>({
    message: "",
    type: "info"
  });
  const [loading, setLoading] = useState(false);

  const t = useMemo(() => getTranslator(language), [language]);

  useEffect(() => {
    const stored = window.localStorage.getItem("opgg-language");
    if (stored === "en" || stored === "es-LATAM") {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("opgg-language", language);
    if (!profile && !loading) {
      setStatus({ message: t("waiting"), type: "info" });
    }
  }, [language, loading, profile, t]);

  const regionOptions = useMemo<SelectOption<Region>[]>(
    () =>
      ["NA1", "EUW1", "EUN1", "KR", "JP1", "BR1", "LA1", "LA2", "OC1", "TR1", "RU"].map((value) => ({
        value: value as Region,
        label: value
      })),
    []
  );

  const languageOptions = useMemo<SelectOption<Language>[]>(
    () => [
      { value: "en", label: "English" },
      { value: "es-LATAM", label: "Español LATAM" }
    ],
    []
  );

  const filteredMatches = useMemo(() => {
    if (!profile) return [];
    return lane === "All" ? profile.matches : profile.matches.filter((match) => match.role === lane);
  }, [lane, profile]);

  async function fetchProfile(
    forceRefresh = false,
    quick?: { gameName: string; tagLine: string; region: Region }
  ) {
    const next = quick || { gameName, tagLine, region };
    if (quick) {
      setGameName(quick.gameName);
      setTagLine(quick.tagLine);
      setRegion(quick.region);
    }

    setLoading(true);
    setLane("All");
    setStatus({ message: forceRefresh ? t("refreshing") : t("loading"), type: "info" });

    try {
      const params = new URLSearchParams(next);
      if (forceRefresh) params.set("refresh", "1");
      const response = await fetch(`/api/profile?${params.toString()}`);
      const payload = (await response.json()) as ProfileResponse | { error: string };
      if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error : "Failed to load profile.");
      }

      setProfile(payload);
      setStatus({
        message: `${forceRefresh ? t("refreshed") : t("loaded")} ${payload.profile.gameName}#${payload.profile.tagLine} ${t("from")} ${payload.profile.region}.`,
        type: "success"
      });
    } catch (error) {
      setProfile(null);
      setStatus({
        message: error instanceof Error ? error.message : t("profileUnavailable"),
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-badge">R</div>
          <div>
            <p className="eyebrow">{t("brandEyebrow")}</p>
            <h1>Rift Insight</h1>
          </div>
        </div>
        <div className="topbar-actions">
          <nav className="topnav" aria-label="Primary">
            <a href="#summoner">{t("navSummoner")}</a>
            <a href="#champions">{t("navChampions")}</a>
            <a href="#meta">{t("navMeta")}</a>
          </nav>
          <label className="language-select-wrap">
            <span>{t("language")}</span>
            <CustomSelect value={language} onChange={setLanguage} options={languageOptions} />
          </label>
        </div>
      </header>

      <main>
        <section className="hero" id="summoner">
          <div className="hero-copy">
            <p className="eyebrow">{t("heroEyebrow")}</p>
            <h2>{t("heroTitle")}</h2>
            <p className="hero-text">{t("heroText")}</p>
            <div className="status-banner" data-type={status.type}>
              {status.message}
            </div>
          </div>

          <form
            className="search-panel"
            onSubmit={(event) => {
              event.preventDefault();
              void fetchProfile(false);
            }}
          >
            <label className="search-label">{t("riotId")}</label>
            <div className="search-grid">
              <input value={gameName} onChange={(event) => setGameName(event.target.value)} placeholder={t("gameName")} required />
              <input value={tagLine} onChange={(event) => setTagLine(event.target.value)} placeholder={t("tagLine")} required />
              <CustomSelect className="search-select" value={region} onChange={setRegion} options={regionOptions} />
            </div>
            <div className="search-row">
              <button type="submit" disabled={loading}>{t("loadProfile")}</button>
              <button type="button" className="secondary-button" disabled={loading} onClick={() => void fetchProfile(true)}>
                {t("refreshLive")}
              </button>
            </div>
            <div className="tag-row">
              {quickProfiles.map((entry) => (
                <button key={`${entry.gameName}-${entry.tagLine}`} type="button" className="tag" onClick={() => void fetchProfile(false, entry)}>
                  {entry.gameName} #{entry.tagLine}
                </button>
              ))}
            </div>
          </form>
        </section>

        <section className="dashboard">
          <aside className="profile-panel">
            <div className="panel glass">
              {profile ? <ProfileCard profile={profile} language={language} /> : <EmptyState title={t("searchTitle")} description={t("searchDesc")} />}
            </div>
            <RankPanel profile={profile} language={language} />
            <MasteryPanel profile={profile} language={language} />
          </aside>

          <section className="content-panel">
            <SummaryPanel profile={profile} language={language} />
            <MatchesPanel
              profile={profile}
              language={language}
              lane={lane}
              onLaneChange={setLane}
              filteredMatches={filteredMatches}
            />
            <InsightsPanel profile={profile} language={language} />
          </section>
        </section>
      </main>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function ProfileCard({ profile, language }: { profile: ProfileResponse; language: Language }) {
  const t = getTranslator(language);
  const recentTokens = profile.summary.recentForm.split(" ").filter(Boolean);
  const emblemTier = profile.featuredQueue?.emblemTier || "UNRANKED";
  const featuredLabel = profile.featuredQueue?.displayLabel || t("unranked");
  const featuredDetail = profile.featuredQueue?.isFallback ? profile.featuredQueue.tierLabel : null;
  return (
    <>
      <div className="profile-card-top">
        {profile.profile.profileIcon ? (
          <img className="avatar-image" src={profile.profile.profileIcon} alt={profile.profile.gameName} />
        ) : (
          <div className="avatar">{profile.profile.gameName.slice(0, 2).toUpperCase()}</div>
        )}
        <div className="level-chip">Lvl {profile.profile.summonerLevel}</div>
      </div>
      <div className="section-copy profile-copy">
        <h3>{profile.profile.gameName} <span>#{profile.profile.tagLine}</span></h3>
        <p>{profile.profile.region} • PUUID {profile.profile.puuid.slice(0, 10)}...</p>
      </div>
      <div className="profile-meta">
        <div className="meta-item">
          <span>{t("topQueue")}</span>
          <div className="rank-display">
            <RankMedal tier={emblemTier} alt={featuredLabel} />
            <div className="rank-display-copy">
              <strong>{featuredLabel}</strong>
              {featuredDetail ? <small>{featuredDetail}</small> : null}
            </div>
          </div>
        </div>
        <div className="meta-item">
          <span>{t("winRate")}</span>
          <strong>{profile.summary.winRate}%</strong>
        </div>
      </div>
      <div className="recent-form-row">
        <span>{t("recentForm")}</span>
        <div className="form-strip">
          {recentTokens.length
            ? recentTokens.map((token, index) => (
                <span key={`${token}-${index}`} className={`form-token ${token === "W" ? "win" : "loss"}`}>
                  {token}
                </span>
              ))
            : t("noGames")}
        </div>
      </div>
    </>
  );
}

function RankPanel({ profile, language }: { profile: ProfileResponse | null; language: Language }) {
  const t = getTranslator(language);
  return (
    <div className="panel">
      <div className="section-title">
        <p className="eyebrow">{t("rankOverview")}</p>
        <h3>{t("liveRankedProfile")}</h3>
      </div>
      {profile?.ranked.length ? (
        <div className="rank-card-grid">
          {profile.ranked.map((entry) => (
            <div key={entry.queueType} className="rank-box">
              <p className="eyebrow">{entry.queueLabel}</p>
              <div className="rank-title-row">
                <RankMedal tier={entry.emblemTier || "UNRANKED"} alt={entry.tier || "Unranked"} />
                <h4>{entry.tier} {entry.rank}</h4>
              </div>
              <p>{entry.leaguePoints} LP • {entry.wins}W {entry.losses}L</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state compact">
          <h3>{t("noRankedData")}</h3>
          <p>{t("noRankedDataDesc")}</p>
        </div>
      )}
    </div>
  );
}

function MasteryPanel({ profile, language }: { profile: ProfileResponse | null; language: Language }) {
  const t = getTranslator(language);
  return (
    <div className="panel">
      <div className="section-title">
        <p className="eyebrow">{t("championMastery")}</p>
        <h3>{t("topMasteryPicks")}</h3>
      </div>
      <div className="mastery-list">
        {profile?.mastery.length ? (
          profile.mastery.map((entry) => (
            <div key={entry.id} className="mastery-item">
              <div className="mastery-copy">
                {entry.icon ? <img className="mastery-image" src={entry.icon} alt={entry.name} /> : null}
                <div>
                  <strong>{entry.name}</strong>
                  <p>{entry.points.toLocaleString()} mastery points</p>
                </div>
              </div>
              <div className="level-chip">Lv {entry.level}</div>
            </div>
          ))
        ) : (
          <div className="empty-state compact">
            <h3>{t("noMasteryData")}</h3>
            <p>{t("noMasteryDataDesc")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryPanel({ profile, language }: { profile: ProfileResponse | null; language: Language }) {
  const t = getTranslator(language);
  if (!profile) return <div className="panel summary-grid" />;
  const stats = [
    { label: t("matches"), value: profile.summary.totalGames },
    { label: "KDA", value: profile.summary.kdaRatio },
    { label: "Avg CS", value: profile.summary.averageCs },
    { label: "Avg KP", value: profile.summary.averageKillParticipation },
    { label: t("vision"), value: profile.summary.averageVision }
  ];
  return <div className="panel summary-grid">{stats.map((s) => <article key={s.label} className="summary-card"><p>{s.label}</p><strong>{s.value}</strong></article>)}</div>;
}

function MatchesPanel({
  profile,
  language,
  lane,
  onLaneChange,
  filteredMatches
}: {
  profile: ProfileResponse | null;
  language: Language;
  lane: "All" | MatchRole;
  onLaneChange: (lane: "All" | MatchRole) => void;
  filteredMatches: ProfileResponse["matches"];
}) {
  const t = getTranslator(language);
  return (
    <div className="panel controls-panel">
      <div className="control-header">
        <div>
          <p className="eyebrow">{t("recentMatches")}</p>
          <h3>{t("liveTimeline")}</h3>
        </div>
        <div className="filter-group">
          {laneOptions.map((entry) => (
            <button key={entry} type="button" className={`filter-button ${lane === entry ? "active" : ""}`} onClick={() => onLaneChange(entry)}>
              {laneLabel(language, entry)}
            </button>
          ))}
        </div>
      </div>
      <div className="match-list">
        {profile ? (
          filteredMatches.length ? (
            filteredMatches.map((match) => (
              <article key={match.matchId} className={`match-card ${match.win ? "win" : "loss"}`}>
                <div className="match-head">
                  <div>
                    <p className="eyebrow">{queueLabelFor(language, match.queueId)}</p>
                    <h4>{match.championName} • {laneLabel(language, match.role)}</h4>
                    <p className="match-subtext">
                      {new Date(match.gameEndTimestamp).toLocaleString(language === "es-LATAM" ? "es-AR" : "en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <div className="match-head-right">
                    {match.largestMultiKill >= 2 ? <div className="level-chip">{match.largestMultiKill}x kill</div> : null}
                    <div className={match.win ? "win-pill" : "loss-pill"}>{match.win ? "Win" : "Loss"}</div>
                  </div>
                </div>
                <div className="match-body">
                  <div className="match-hero">
                    <div className="champion-stack">
                      {match.championIcon ? <img className="match-champion-image" src={match.championIcon} alt={match.championName} /> : null}
                      <div className="spell-stack">
                        {match.spells.map((spell) => <img key={spell.name} className="spell-image" src={spell.icon} alt={spell.name} title={spell.name} />)}
                      </div>
                    </div>
                    <div className="match-core">
                      <div className="kda-pill">
                        <strong>{match.kills} / {match.deaths} / {match.assists}</strong>
                        <span className="match-subtext">{match.kda} KDA</span>
                      </div>
                      <div className="mini-list">
                        <span className="role-pill"><span className="role-symbol">{roleSymbols[match.role] || "?"}</span>{laneLabel(language, match.role)}</span>
                        <span className="level-chip">{match.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="match-stats-grid">
                    <div className="stat-block"><span>CSPM</span><strong>{match.csPerMinute}</strong><small>{match.cs} CS</small></div>
                    <div className="stat-block"><span>KP</span><strong>{match.killParticipation}%</strong></div>
                    <div className="stat-block"><span>DPM</span><strong>{match.damagePerMinute.toLocaleString()}</strong><small>{match.damage}</small></div>
                    <div className="stat-block"><span>DTPM</span><strong>{match.takenPerMinute.toLocaleString()}</strong><small>{match.totalDamageTaken}</small></div>
                    <div className="stat-block"><span>GPM</span><strong>{match.goldPerMinute.toLocaleString()}</strong><small>{match.gold}</small></div>
                  </div>
                  <div className="item-row">
                    <div className="item-grid">
                      {match.items.map((item, index) =>
                        item.icon ? <img key={`${match.matchId}-${index}`} className="item-image" src={item.icon} alt={`Item ${item.id}`} /> : <div key={`${match.matchId}-${index}`} className="item-empty" aria-hidden="true" />
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <EmptyState title={t("noMatchesLane")} description={t("noMatchesLaneDesc")} />
          )
        ) : null}
      </div>
    </div>
  );
}

function InsightsPanel({ profile, language }: { profile: ProfileResponse | null; language: Language }) {
  const t = getTranslator(language);
  return (
    <div className="insights-grid">
      <div className="panel" id="champions">
        <div className="section-title">
          <p className="eyebrow">{t("championStats")}</p>
          <h3>{t("mostPlayed")}</h3>
        </div>
        <div className="champion-table">
          {profile?.championStats.length ? (
            profile.championStats.map((entry) => (
              <div key={entry.name} className="champion-row">
                <div className="champion-copy">
                  {entry.icon ? <img className="champion-image" src={entry.icon} alt={entry.name} /> : null}
                  <div>
                    <strong>{entry.name}</strong>
                    <p>{entry.games} {t("games")} • {entry.averageKda} KDA</p>
                  </div>
                </div>
                <div className="champion-metric">
                  <div className="champion-metric-row">
                    <span>{t("winRate")}</span>
                    <strong>{entry.winRate}%</strong>
                  </div>
                  <div className="bar"><span style={{ width: `${entry.winRate}%` }} /></div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState title={t("noChampionBreakdown")} description={t("noChampionBreakdownDesc")} />
          )}
        </div>
      </div>

      <div className="panel" id="meta">
        <div className="section-title">
          <p className="eyebrow">{t("queueSnapshot")}</p>
          <h3>{t("accountInsights")}</h3>
        </div>
        <div className="meta-list">
          {profile?.meta.length ? (
            profile.meta.map((entry) => (
              <div key={`${entry.label}-${entry.value}`} className="meta-row">
                <div className="queue-badge">{entry.label[0]}</div>
                <div className="meta-copy">
                  <strong>{entry.label}</strong>
                  <p>{entry.value}</p>
                </div>
                <div className="level-chip">{entry.accent}</div>
              </div>
            ))
          ) : (
            <EmptyState title={t("noQueueInsights")} description={t("noQueueInsightsDesc")} />
          )}
        </div>
      </div>
    </div>
  );
}
