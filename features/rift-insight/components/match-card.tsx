import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { laneLabel, queueLabelFor } from "@/components/translations";
import { StatBlock } from "@/features/rift-insight/components/stat-block";
import { roleSymbols } from "@/features/rift-insight/display";
import { cn } from "@/lib/utils";
import type { Language, ProfileResponse } from "@/lib/types";

type MatchCardProps = {
  language: Language;
  match: ProfileResponse["matches"][number];
};

export function MatchCard({ language, match }: MatchCardProps) {
  return (
    <article
      className={cn(
        "rounded-lg border bg-slate-950/70 p-3 shadow-sm",
        match.win
          ? "border-emerald-500/20"
          : "border-rose-500/20"
      )}
    >
      <div className="grid min-w-0 gap-1.5 border-b border-white/6 pb-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-3">
        <p className="text-xs font-semibold leading-5 text-slate-300">{queueLabelFor(language, match.queueId)}</p>
        <h4 className="min-w-0 truncate text-base font-semibold leading-5 text-white">
          {match.championName}
          <span className="text-slate-400"> • {laneLabel(language, match.role)}</span>
        </h4>
        <p className="text-sm text-slate-400 sm:text-right">
          {new Date(match.gameEndTimestamp).toLocaleString(language === "es-LATAM" ? "es-AR" : "en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
          })}
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between xl:gap-5">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 rounded-md border border-white/10">
                <AvatarImage src={match.championIcon || undefined} alt={match.championName} />
                <AvatarFallback className="rounded-md bg-slate-900 text-sm font-medium text-white">
                  {match.championName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                {match.spells.map((spell) => (
                  <Avatar key={spell.name} className="h-5 w-5 rounded-[4px] border border-white/10">
                    <AvatarImage src={spell.icon} alt={spell.name} title={spell.name} />
                    <AvatarFallback className="rounded-[4px] bg-slate-900 text-[8px] text-white">
                      {spell.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>

            <Badge variant="subtle" className="h-6 px-2.5 text-[11px]">
              {match.kills} / {match.deaths} / {match.assists} • {match.kda} KDA
            </Badge>
            <Badge variant="secondary" className="h-6 gap-1.5 px-2">
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-white/10 px-1 text-[10px] leading-none">
                {roleSymbols[match.role] || "?"}
              </span>
              {laneLabel(language, match.role)}
            </Badge>
            <Badge variant="secondary" className="h-6 px-2">
              {match.duration}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={match.win ? "success" : "destructive"}>{match.win ? "Win" : "Loss"}</Badge>
            {match.largestMultiKill >= 2 ? <Badge variant="destructive" className="text-[11px]">{match.largestMultiKill}x kill</Badge> : null}
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-[340px_132px] xl:items-center xl:self-center">
          <div className="grid min-w-0 grid-cols-5 gap-1.5">
            <StatBlock label="CSPM" value={match.csPerMinute} detail={`${match.cs} CS`} />
            <StatBlock label="KP" value={`${match.killParticipation}%`} />
            <StatBlock label="DPM" value={match.damagePerMinute.toLocaleString()} detail={match.damage} />
            <StatBlock label="DTPM" value={match.takenPerMinute.toLocaleString()} detail={match.totalDamageTaken} />
            <StatBlock label="GPM" value={match.goldPerMinute.toLocaleString()} detail={match.gold} />
          </div>

          <div className="grid grid-cols-4 gap-1.5 border-t border-white/6 pt-3 xl:max-w-[132px] xl:grid-cols-4 xl:border-l xl:border-t-0 xl:pl-3 xl:pt-0">
            {match.items.map((item, index) =>
              item.icon ? (
                <Avatar key={`${match.matchId}-${index}`} className="h-[28px] w-[28px] rounded-[4px] border border-white/10">
                  <AvatarImage src={item.icon} alt={`Item ${item.id}`} />
                  <AvatarFallback className="rounded-[4px] bg-slate-900 text-[8px] text-white">
                    {index + 1}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div key={`${match.matchId}-${index}`} className="h-[28px] w-[28px] rounded-[4px] border border-dashed border-white/10 bg-white/[0.03]" aria-hidden="true" />
              )
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
