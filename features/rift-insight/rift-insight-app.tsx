"use client";

import type { FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CustomSelect } from "@/components/custom-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { languageOptions, regionOptions } from "@/features/rift-insight/constants";
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
      void fetchProfile({ quick: nextLookup }).catch((error) => {
        console.error("Profile fetch failed:", error);
      });
      return;
    }

    router.push(targetHref);
  }

  function handleLoadProfile() {
    navigateToProfile({ gameName, tagLine, region });
  }

  function handleRefreshLive() {
    void fetchProfile({ forceRefresh: true, quick: { gameName, tagLine, region } }).catch((error) => {
      console.error("Profile refresh failed:", error);
    });
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleLoadProfile();
  }

  return (
    <div className="min-h-screen bg-[#020817] text-slate-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.08),transparent_32%)]" />
      <div className="relative mx-auto flex w-full max-w-[1560px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Card className="relative z-50 overflow-visible">
          <CardContent className="grid gap-4 p-4 xl:grid-cols-[auto_minmax(0,620px)_minmax(180px,1fr)] xl:items-center xl:gap-x-10">
            <div className="flex items-center justify-between gap-4 xl:justify-start">
              <Link href="/" aria-label="Go to Rift Insight home" className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300/50">
                <Image
                  src="/rift-insight-brand@2x.png"
                  alt="Rift Insight"
                  width={888}
                  height={1432}
                  className="h-20 w-auto object-contain sm:h-24 xl:h-28"
                  priority
                />
              </Link>
              <span className="sr-only">Rift Insight</span>
            </div>

            <form className="grid w-full max-w-[540px] justify-self-start gap-2 xl:ml-4 lg:grid-cols-[minmax(140px,1.25fr)_minmax(92px,0.75fr)_96px_auto] lg:items-end" onSubmit={handleSearchSubmit}>
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
              <Button type="submit" size="sm" disabled={loading}>
                {t("loadProfile")}
              </Button>
            </form>

            <div className="flex flex-col gap-3 xl:items-end">
              <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300 xl:justify-end">
                <a className="transition-colors hover:text-white" href="#summoner">{t("navSummoner")}</a>
                <a className="transition-colors hover:text-white" href="#champions">{t("navChampions")}</a>
                <a className="transition-colors hover:text-white" href="#meta">{t("navMeta")}</a>
              </nav>
              <div className="flex items-center gap-3 rounded-md border border-white/10 bg-slate-950 px-3 py-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{t("language")}</span>
                <div className="w-[162px]">
                  <CustomSelect value={language} onChange={setLanguage} options={languageOptions} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {!showDashboard ? (
        <Card id="summoner" className="relative z-20 overflow-visible">
          <CardContent className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,500px)] lg:items-center lg:p-8">
            <div className="max-w-3xl space-y-5">
              <SectionLabel>{t("heroEyebrow")}</SectionLabel>
              <h2 className="font-[family:var(--font-space-grotesk)] text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                {t("heroTitle")}
              </h2>
              <p className="max-w-2xl text-base leading-7 text-slate-300">{t("heroText")}</p>
              <div
                className={cn(
                  "max-w-xl rounded-md border px-4 py-3 text-sm",
                  status.type === "success" && "border-emerald-400/30 bg-emerald-400/12 text-emerald-100",
                  status.type === "error" && "border-rose-400/30 bg-rose-400/12 text-rose-100",
                  status.type === "info" && "border-white/10 bg-slate-900 text-slate-200"
                )}
              >
                {status.message}
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Image
                src="/rift-insight-brand@2x.png"
                alt="Rift Insight"
                width={888}
                height={1432}
                className="h-72 w-auto object-contain sm:h-80 lg:h-[28rem]"
                priority
              />
            </div>
          </CardContent>
        </Card>
        ) : null}

        {loading ? <LoadingPanel title={t("searchingTitle")} description={t("searchingDesc")} /> : null}

        {showDashboard ? (
        <section className={cn("grid gap-5 xl:grid-cols-[350px_minmax(0,1fr)]", loading && "pointer-events-none opacity-70")}>
          <aside className="grid content-start gap-5">
            <Card>
              <CardContent className="p-5">
                {profile ? (
                  <ProfileCard profile={profile} language={language} loading={loading} onRefresh={handleRefreshLive} />
                ) : (
                  <EmptyState title={t("searchTitle")} description={t("searchDesc")} />
                )}
              </CardContent>
            </Card>
            <RankPanel profile={profile} language={language} />
            <MasteryPanel profile={profile} language={language} />
          </aside>

          <section className="grid min-w-0 gap-5">
            <SummaryPanel profile={profile} language={language} />
            <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <MatchesPanel profile={profile} language={language} lane={lane} onLaneChange={setLane} filteredMatches={filteredMatches} />
              <InsightsPanel profile={profile} language={language} />
            </div>
          </section>
        </section>
        ) : null}
      </div>
    </div>
  );
}
