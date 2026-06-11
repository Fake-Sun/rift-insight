"use client";

import { usePathname, useRouter } from "next/navigation";
import { CustomSelect } from "@/components/custom-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { languageOptions, quickProfiles, regionOptions } from "@/features/rift-insight/constants";
import { InsightsPanel } from "@/features/rift-insight/components/insights-panel";
import { LoadingPanel } from "@/features/rift-insight/components/loading-panel";
import { MasteryPanel } from "@/features/rift-insight/components/mastery-panel";
import { MatchesPanel } from "@/features/rift-insight/components/matches-panel";
import { ProfileCard } from "@/features/rift-insight/components/profile-card";
import { RankPanel } from "@/features/rift-insight/components/rank-panel";
import { SectionLabel } from "@/features/rift-insight/components/section-label";
import { SummaryPanel } from "@/features/rift-insight/components/summary-panel";
import { EmptyState } from "@/features/rift-insight/components/empty-state";
import { useRiftInsightState } from "@/features/rift-insight/hooks/use-rift-insight-state";
import { buildProfileHref } from "@/features/rift-insight/routing";
import { cn } from "@/lib/utils";
import type { Region } from "@/lib/types";

type RiftInsightFeatureProps = {
  initialLookup?: {
    gameName: string;
    tagLine: string;
    region: Region;
  };
};

export function RiftInsightFeature({ initialLookup }: RiftInsightFeatureProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    filteredMatches,
    fetchProfile,
    gameName,
    lane,
    language,
    loading,
    profile,
    region,
    setGameName,
    setLane,
    setLanguage,
    setRegion,
    setTagLine,
    status,
    t,
    tagLine
  } = useRiftInsightState(initialLookup);

  const showDashboard = Boolean(profile) || loading;
  const currentUrl = initialLookup ? buildProfileHref(initialLookup) : pathname;

  function navigateToProfile(nextLookup: { gameName: string; tagLine: string; region: Region }) {
    const targetHref = buildProfileHref(nextLookup);

    if (targetHref === currentUrl) {
      void fetchProfile({ quick: nextLookup });
      return;
    }

    router.push(targetHref);
  }

  function handleLoadProfile() {
    navigateToProfile({ gameName, tagLine, region });
  }

  function handleRefreshLive() {
    void fetchProfile({ forceRefresh: true, quick: { gameName, tagLine, region } });
  }

  return (
    <div className="min-h-screen bg-[#020817] text-slate-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.08),transparent_32%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Card className="relative z-50 overflow-visible">
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-slate-900 text-sm font-semibold text-white">
                R
              </div>
              <div>
                <SectionLabel>{t("brandEyebrow")}</SectionLabel>
                <h1 className="font-[family:var(--font-space-grotesk)] text-2xl font-semibold tracking-tight text-white">Rift Insight</h1>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <a className="transition-colors hover:text-white" href="#summoner">{t("navSummoner")}</a>
                <a className="transition-colors hover:text-white" href="#champions">{t("navChampions")}</a>
                <a className="transition-colors hover:text-white" href="#meta">{t("navMeta")}</a>
              </nav>
              <div className="flex items-center gap-3 rounded-md border border-white/10 bg-slate-950 px-3 py-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{t("language")}</span>
                <div className="w-[160px]">
                  <CustomSelect value={language} onChange={setLanguage} options={languageOptions} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card id="summoner" className="relative z-20 overflow-visible">
          <CardContent className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,420px)] lg:items-start">
            <div className="space-y-4">
              <SectionLabel>{t("heroEyebrow")}</SectionLabel>
              <h2 className="max-w-[12ch] font-[family:var(--font-space-grotesk)] text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                {t("heroTitle")}
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">{t("heroText")}</p>
              <div
                className={cn(
                  "rounded-md border px-4 py-3 text-sm",
                  status.type === "success" && "border-emerald-400/30 bg-emerald-400/12 text-emerald-100",
                  status.type === "error" && "border-rose-400/30 bg-rose-400/12 text-rose-100",
                  status.type === "info" && "border-white/10 bg-slate-900 text-slate-200"
                )}
              >
                {status.message}
              </div>
            </div>

            <Card>
              <CardHeader className="space-y-1 p-5">
                <CardTitle className="text-lg text-white">{t("riotId")}</CardTitle>
                <CardDescription>Search by Riot ID and server region.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-5 pt-0">
                <div className="grid gap-3 md:grid-cols-[1.35fr_1fr_110px]">
                  <label className="grid gap-1.5">
                    <span className="text-xs font-medium text-slate-300">{t("gameName")}</span>
                    <Input
                      value={gameName}
                      onChange={(event) => setGameName(event.target.value)}
                      placeholder="Fake Sun"
                      required
                    />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-xs font-medium text-slate-300">{t("tagLine")}</span>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                        #
                      </span>
                      <Input
                        value={tagLine}
                        onChange={(event) => setTagLine(event.target.value.replace(/^#/, ""))}
                        placeholder="Kite"
                        className="pl-7"
                        required
                      />
                    </div>
                  </label>
                  <div className="grid gap-1.5">
                    <span className="text-xs font-medium text-slate-300">{t("server")}</span>
                    <CustomSelect className="w-full" value={region} onChange={setRegion} options={regionOptions} />
                  </div>
                </div>
                <p className="text-xs leading-5 text-slate-400">
                  {t("riotIdHelpPrefix")} <span className="font-medium text-slate-200">Game Name#Tag</span>, {t("riotIdHelpExample")} <span className="font-medium text-slate-200">Fake Sun#Kite</span>.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button disabled={loading} onClick={handleLoadProfile}>
                    {t("loadProfile")}
                  </Button>
                  <Button variant="secondary" disabled={loading || !initialLookup} onClick={handleRefreshLive}>
                    {t("refreshLive")}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {quickProfiles.map((entry) => (
                    <Button
                      key={`${entry.gameName}-${entry.tagLine}`}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateToProfile(entry)}
                    >
                      {entry.gameName} #{entry.tagLine}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {loading ? <LoadingPanel title={t("searchingTitle")} description={t("searchingDesc")} /> : null}

        {showDashboard ? (
        <section className={cn("grid gap-5 xl:grid-cols-[350px_minmax(0,1fr)]", loading && "pointer-events-none opacity-70")}>
          <aside className="grid content-start gap-5">
            <Card>
              <CardContent className="p-5">
                {profile ? <ProfileCard profile={profile} language={language} /> : <EmptyState title={t("searchTitle")} description={t("searchDesc")} />}
              </CardContent>
            </Card>
            <RankPanel profile={profile} language={language} />
            <MasteryPanel profile={profile} language={language} />
          </aside>

          <section className="grid min-w-0 gap-5">
            <SummaryPanel profile={profile} language={language} />
            <MatchesPanel profile={profile} language={language} lane={lane} onLaneChange={setLane} filteredMatches={filteredMatches} />
            <InsightsPanel profile={profile} language={language} />
          </section>
        </section>
        ) : null}
      </div>
    </div>
  );
}
