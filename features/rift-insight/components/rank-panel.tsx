import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslator } from "@/components/translations";
import { EmptyState } from "@/features/rift-insight/components/empty-state";
import { RankMedal } from "@/features/rift-insight/components/rank-medal";
import { SectionLabel } from "@/features/rift-insight/components/section-label";
import type { Language, ProfileResponse } from "@/lib/types";

export function RankPanel({ profile, language }: { profile: ProfileResponse | null; language: Language }) {
  const t = getTranslator(language);

  return (
    <Card>
      <CardHeader className="space-y-1 p-5">
        <div className="space-y-1">
          <SectionLabel>{t("rankOverview")}</SectionLabel>
          <CardTitle className="text-2xl text-white">{t("liveRankedProfile")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5 pt-0">
        {profile?.ranked.length ? (
          <div className="grid gap-3">
            {profile.ranked.map((entry) => (
              <div key={entry.queueType} className="grid min-w-0 gap-2 rounded-xl border  border-white/10 bg-white/[0.02] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{entry.queueLabel}</p>
                <div className="grid min-w-0 grid-cols-[24px_minmax(0,1fr)] items-start gap-3">
                  <RankMedal
                    tier={entry.emblemTier || "UNRANKED"}
                    alt={entry.tier || "Unranked"}
                    className="h-6 w-6 shrink-0 object-contain"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                      <span className="text-base font-semibold leading-none text-white">
                        {entry.tier}
                      </span>
                      <span className="inline-flex h-5 shrink-0 items-center rounded-sm border border-white/10 bg-slate-900 px-1.5 text-[10px] font-medium leading-none text-slate-300">
                        {entry.rank}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="inline-flex items-center rounded-sm border border-white/8 bg-slate-950/60 px-2 py-1 font-medium tabular-nums text-slate-300">
                        {entry.leaguePoints} LP
                      </span>
                      <span className="inline-flex items-center rounded-sm border border-white/8 bg-slate-950/60 px-2 py-1 font-medium tabular-nums text-slate-300">
                        {entry.wins}W {entry.losses}L
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title={t("noRankedData")} description={t("noRankedDataDesc")} />
        )}
      </CardContent>
    </Card>
  );
}
