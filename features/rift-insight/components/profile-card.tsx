import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetricValue } from "@/features/rift-insight/components/metric-value";
import { Separator } from "@/components/ui/separator";
import { getTranslator } from "@/components/translations";
import { RankMedal } from "@/features/rift-insight/components/rank-medal";
import { cn } from "@/lib/utils";
import type { Language, ProfileResponse } from "@/lib/types";

export function ProfileCard({
  profile,
  language,
  loading,
  onRefresh
}: {
  profile: ProfileResponse;
  language: Language;
  loading: boolean;
  onRefresh: () => void;
}) {
  const t = getTranslator(language);
  const recentTokens = profile.summary.recentForm.split(" ").filter(Boolean);
  const emblemTier = profile.featuredQueue?.emblemTier || "UNRANKED";
  const featuredLabel = profile.featuredQueue?.displayLabel || t("unranked");
  const featuredDetail = profile.featuredQueue?.isFallback ? profile.featuredQueue.tierLabel : null;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <Avatar className="h-20 w-20 rounded-3xl border border-white/10 bg-slate-950/70">
          <AvatarImage src={profile.profile.profileIcon || undefined} alt={profile.profile.gameName} />
          <AvatarFallback className="rounded-3xl bg-sky-400/15 text-3xl font-bold text-white">
            {profile.profile.gameName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Badge variant="subtle" className="px-3 py-1.5 text-amber-200">Lvl {profile.profile.summonerLevel}</Badge>
      </div>

      <div className="min-w-0 space-y-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h3 className="min-w-0 font-[family:var(--font-space-grotesk)] text-2xl font-semibold text-white">
            {profile.profile.gameName} <span className="text-slate-300">#{profile.profile.tagLine}</span>
          </h3>
          <Button type="button" variant="secondary" size="sm" disabled={loading} onClick={onRefresh}>
            {t("refreshLive")}
          </Button>
        </div>
        <p className="text-sm text-slate-400">{profile.profile.region}</p>
      </div>

      <Separator />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t("topQueue")}</p>
          <div className="mt-2 flex min-w-0 items-start gap-3">
            <RankMedal tier={emblemTier} alt={featuredLabel} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">{featuredLabel}</p>
              {featuredDetail ? (
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {featuredDetail}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t("winRate")}</p>
          <MetricValue value={`${profile.summary.winRate}%`} className="mt-2" />
        </div>
      </div>

      <Separator />

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{t("recentForm")}</span>
          <div className="flex min-w-0 gap-1 overflow-x-auto">
            {recentTokens.length ? recentTokens.map((token, index) => (
              <span
                key={`${token}-${index}`}
                className={cn(
                  "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full text-[10px] font-extrabold",
                  token === "W" ? "border border-emerald-400 bg-emerald-400/90 text-emerald-50" : "border border-rose-400 bg-rose-400/90 text-rose-50"
                )}
              >
                {token}
              </span>
            )) : <span className="text-sm text-slate-400">{t("noGames")}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
