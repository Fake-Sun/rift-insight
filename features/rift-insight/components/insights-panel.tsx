import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslator } from "@/components/translations";
import { EmptyState } from "@/features/rift-insight/components/empty-state";
import { SectionLabel } from "@/features/rift-insight/components/section-label";
import type { Language, ProfileResponse } from "@/lib/types";

export function InsightsPanel({ profile, language }: { profile: ProfileResponse | null; language: Language }) {
  const t = getTranslator(language);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
      <Card id="champions">
        <CardHeader className="space-y-1 p-5">
          <div className="space-y-1">
            <SectionLabel>{t("championStats")}</SectionLabel>
            <CardTitle className="text-2xl text-white">{t("mostPlayed")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 p-5 pt-0">
          {profile?.championStats.length ? profile.championStats.map((entry) => (
            <div key={entry.name} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="h-11 w-11 rounded-xl border border-white/10">
                  <AvatarImage src={entry.icon || undefined} alt={entry.name} />
                  <AvatarFallback className="rounded-xl bg-sky-400/15 text-sm font-semibold text-white">
                    {entry.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <strong className="block truncate text-white">{entry.name}</strong>
                  <p className="text-sm text-slate-400">{entry.games} {t("games")} • {entry.averageKda} KDA</p>
                </div>
              </div>
              <div className="grid min-w-[180px] gap-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-400">{t("winRate")}</span>
                  <strong className="text-white">{entry.winRate}%</strong>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/8">
                  <div className="h-full rounded-full bg-[linear-gradient(135deg,#2f8cff,#29e3ff,#7a6cff)]" style={{ width: `${entry.winRate}%` }} />
                </div>
              </div>
            </div>
          )) : <EmptyState title={t("noChampionBreakdown")} description={t("noChampionBreakdownDesc")} />}
        </CardContent>
      </Card>

      <Card id="meta">
        <CardHeader className="space-y-1 p-5">
          <div className="space-y-1">
            <SectionLabel>{t("queueSnapshot")}</SectionLabel>
            <CardTitle className="text-2xl text-white">{t("accountInsights")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 p-5 pt-0">
          {profile?.meta.length ? profile.meta.map((entry) => (
            <div key={`${entry.label}-${entry.value}`} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center">
              <Avatar className="h-11 w-11 rounded-xl border border-white/10">
                <AvatarFallback className="rounded-xl bg-violet-400/15 text-sm font-semibold text-sky-50">
                  {entry.label[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <strong className="block text-white">{entry.label}</strong>
                <p className="text-sm text-slate-400">{entry.value}</p>
              </div>
              <Badge variant="subtle" className="w-fit text-cyan-100">{entry.accent}</Badge>
            </div>
          )) : <EmptyState title={t("noQueueInsights")} description={t("noQueueInsightsDesc")} />}
        </CardContent>
      </Card>
    </div>
  );
}
