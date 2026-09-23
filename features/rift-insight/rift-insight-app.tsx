"use client";

import type { FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AlertCircle, ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InsightsPanel } from "@/features/rift-insight/components/insights-panel";
import { LandingPage } from "@/features/rift-insight/components/landing-page";
import { LoadingPanel } from "@/features/rift-insight/components/loading-panel";
import { MasteryPanel } from "@/features/rift-insight/components/mastery-panel";
import { MatchesPanel } from "@/features/rift-insight/components/matches-panel";
import { ProfileCard } from "@/features/rift-insight/components/profile-card";
import { RankPanel } from "@/features/rift-insight/components/rank-panel";
import { SiteHeader } from "@/features/rift-insight/components/site-header";
import { SummaryPanel } from "@/features/rift-insight/components/summary-panel";
import { useRiftInsightState } from "@/features/rift-insight/hooks/use-rift-insight-state";
import { getCopy } from "@/features/rift-insight/copy";
import { defaultProfile } from "@/features/rift-insight/constants";
import { buildProfileHref } from "@/features/rift-insight/routing";
import type { Region } from "@/lib/types";

type Lookup = { gameName: string; tagLine: string; region: Region };

export function RiftInsightFeature({
  initialLookup,
}: {
  initialLookup?: Lookup;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const state = useRiftInsightState(initialLookup);
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
    tagLine,
  } = state;
  const c = getCopy(language);
  const currentUrl = initialLookup ? buildProfileHref(initialLookup) : pathname;

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const lookup = {
      gameName: gameName.trim(),
      tagLine: tagLine.trim(),
      region,
    };
    if (!lookup.gameName || !lookup.tagLine) return;
    const targetHref = buildProfileHref(lookup);
    if (targetHref === currentUrl) void fetchProfile({ quick: lookup });
    else router.push(targetHref);
  }

  function handleRefresh() {
    const lookup = profile
      ? {
          gameName: profile.profile.gameName,
          tagLine: profile.profile.tagLine,
          region: profile.profile.region as Region,
        }
      : initialLookup;
    if (lookup) void fetchProfile({ forceRefresh: true, quick: lookup });
  }

  return (
    <div className="site-atmosphere min-h-screen">
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[2000] rounded-md bg-primary p-3 text-primary-foreground focus:not-sr-only"
      >
        {c.overview}
      </a>
      <SiteHeader
        gameName={gameName}
        tagLine={tagLine}
        region={region}
        language={language}
        loading={loading}
        onGameName={setGameName}
        onTagLine={setTagLine}
        onRegion={setRegion}
        onLanguage={setLanguage}
        onSubmit={handleSearchSubmit}
        onTestAccount={
          initialLookup
            ? undefined
            : () => router.push(buildProfileHref(defaultProfile))
        }
      />
      <main
        id="main-content"
        className={`mx-auto w-full px-4 pb-12 pt-6 sm:px-6 lg:px-8 ${initialLookup ? "max-w-[1500px]" : "max-w-[1720px]"}`}
      >
        {status.type === "error" ? (
          <div
            role="alert"
            className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm"
          >
            <AlertCircle className="size-5 shrink-0 text-destructive" />
            <p className="min-w-0 flex-1">{status.message}</p>
            {initialLookup ? (
              <Button
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={handleRefresh}
              >
                {c.retry}
              </Button>
            ) : null}
          </div>
        ) : null}
        {!initialLookup ? (
          <LandingPage language={language} />
        ) : (
          <div className="space-y-5">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
            >
              <Link href="/" className="hover:text-primary">
                {c.home}
              </Link>
              <ChevronRight className="size-3" />
              <span className="text-foreground">
                {initialLookup.gameName}{" "}
                <span className="text-muted-foreground">
                  #{initialLookup.tagLine}
                </span>
              </span>
            </nav>
            {loading ? (
              <LoadingPanel
                title={t("searchingTitle")}
                description={t("searchingDesc")}
              />
            ) : null}
            {profile ? (
              <div className="reveal space-y-5" aria-busy={loading}>
                <ProfileCard
                  profile={profile}
                  language={language}
                  loading={loading}
                  onRefresh={handleRefresh}
                />
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <nav className="flex flex-wrap gap-5 text-sm font-medium">
                    <a href="#match-history" className="text-primary">
                      {c.overview}
                    </a>
                    <a
                      href="#ranked"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {c.ranked}
                    </a>
                    <a
                      href="#champions"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {c.picks}
                    </a>
                    <a
                      href="#performance"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {c.insights}
                    </a>
                  </nav>
                  <span className="text-xs text-muted-foreground">
                    {profile.matches.length} {c.sample}
                  </span>
                </div>
                <div className="profile-layout">
                  <aside
                    id="ranked"
                    className="profile-sidebar grid min-w-0 content-start gap-4 sm:grid-cols-2 lg:grid-cols-1"
                  >
                    <RankPanel profile={profile} language={language} />
                    <MasteryPanel profile={profile} language={language} />
                  </aside>
                  <div className="profile-history min-w-0 space-y-4">
                    <SummaryPanel profile={profile} language={language} />
                    <MatchesPanel
                      profile={profile}
                      language={language}
                      lane={lane}
                      onLaneChange={setLane}
                      filteredMatches={filteredMatches}
                    />
                  </div>
                  <div className="profile-insights min-w-0">
                    <InsightsPanel profile={profile} language={language} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </main>
      <footer className="mx-auto flex max-w-[1720px] flex-col gap-3 border-t border-border px-4 py-7 text-xs text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link
          href="/"
          className="flex w-fit items-center gap-2 font-heading text-sm text-foreground"
        >
          Rift Insight
          <ArrowUpRight className="size-3 text-primary" />
        </Link>
        <p className="max-w-2xl leading-5">{c.footer}</p>
      </footer>
    </div>
  );
}
