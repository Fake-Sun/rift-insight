import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getTranslator, laneLabel, queueLabelFor } from "@/components/translations";
import { StatBlock } from "@/features/rift-insight/components/stat-block";
import { roleSymbols } from "@/features/rift-insight/display";
import { buildProfileHref } from "@/features/rift-insight/routing";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import type { Language, MatchParticipant, ProfileResponse, Region } from "@/lib/types";

type MatchCardProps = {
  language: Language;
  match: ProfileResponse["matches"][number];
  region: Region;
};

function formatDamage(value: number) {
  return value >= 1000 ? `${Math.round(value / 100) / 10}k` : value.toLocaleString();
}

function teamLabel(teamId: number) {
  if (teamId === 100) return "Blue Side";
  if (teamId === 200) return "Red Side";
  return `Team ${teamId}`;
}

function ParticipantRow({
  participant,
  maxDamage,
  region
}: {
  participant: MatchParticipant;
  maxDamage: number;
  region: Region;
}) {
  const damagePercent = Math.max(4, Math.round((participant.damage / Math.max(1, maxDamage)) * 100));
  const profileHref =
    participant.gameName && participant.tagLine
      ? buildProfileHref({
          gameName: participant.gameName,
          tagLine: participant.tagLine,
          region
        })
      : "";

  return (
    <div className="grid min-w-0 grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-white/8 bg-slate-950/70 p-2">
      <Avatar className="h-8 w-8 rounded-md border border-white/10">
        <AvatarImage src={participant.championIcon || undefined} alt={participant.championName} />
        <AvatarFallback className="rounded-md bg-slate-900 text-[10px] font-semibold text-white">
          {participant.championName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          {profileHref ? (
            <Link
              href={profileHref}
              className="min-w-0 truncate text-sm font-semibold leading-5 text-white underline-offset-4 transition-colors hover:text-sky-200 hover:underline"
            >
              {participant.riotId}
            </Link>
          ) : (
            <p className="truncate text-sm font-semibold leading-5 text-white">{participant.riotId}</p>
          )}
          <span className="shrink-0 text-[11px] text-slate-500">{roleSymbols[participant.role] || "?"}</span>
        </div>
        <p className="truncate text-xs leading-4 text-slate-400">{participant.championName}</p>
        <div className="mt-1.5 flex min-w-0 flex-wrap gap-1">
          {participant.items.map((item, index) =>
            item.icon ? (
              <Avatar key={`${participant.puuid}-${item.id}-${index}`} className="h-5 w-5 rounded-[4px] border border-white/10">
                <AvatarImage src={item.icon} alt={`Item ${item.id}`} />
                <AvatarFallback className="rounded-[4px] bg-slate-900 text-[8px] text-white">
                  {index + 1}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div
                key={`${participant.puuid}-empty-${index}`}
                className="h-5 w-5 rounded-[4px] border border-dashed border-white/10 bg-white/[0.03]"
                aria-hidden="true"
              />
            )
          )}
        </div>
      </div>

      <div className="w-[112px] text-right">
        <p className="text-xs font-semibold tabular-nums text-slate-100">
          {participant.kills} / {participant.deaths} / {participant.assists}
        </p>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/8">
          <div
            className={cn("h-full rounded-full", participant.win ? "bg-emerald-300/80" : "bg-rose-300/80")}
            style={{ width: `${damagePercent}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] font-medium tabular-nums text-slate-300">{formatDamage(participant.damage)}</p>
      </div>
    </div>
  );
}

export function MatchCard({ language, match, region }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const t = getTranslator(language);
  const participants = match.participants || [];
  const teams = [...new Set(participants.map((participant) => participant.teamId))].sort((left, right) => left - right);
  const maxDamage = Math.max(...participants.map((participant) => participant.damage), 1);

  function toggleExpanded() {
    if (participants.length) {
      setExpanded((current) => !current);
    }
  }

  return (
    <article
      className={cn(
        "rounded-lg border bg-slate-950/70 p-3 shadow-sm transition-colors",
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
        <div className="flex items-center gap-3 sm:justify-end">
          <p className="text-sm text-slate-400 sm:text-right">
            {new Date(match.gameEndTimestamp).toLocaleString(language === "es-LATAM" ? "es-AR" : "en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit"
            })}
          </p>
          {participants.length ? (
            <button
              type="button"
              aria-expanded={expanded}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs font-medium text-slate-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/50"
              onClick={toggleExpanded}
            >
              {expanded ? t("hideDetails") : t("showDetails")}
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
            </button>
          ) : null}
        </div>
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

      {expanded && participants.length ? (
        <div className="mt-4 border-t border-white/6 pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h5 className="text-sm font-semibold text-white">{t("matchDetails")}</h5>
            <div className="hidden grid-cols-[1fr_112px] gap-3 text-xs font-medium text-slate-500 sm:grid">
              <span>{t("player")}</span>
              <span className="text-right">KDA / {t("damage")}</span>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-2">
            {teams.map((teamId) => (
              <section key={teamId} className="min-w-0 space-y-2">
                <div className="flex items-center justify-between rounded-md border border-white/8 bg-white/[0.02] px-3 py-2">
                  <p className="text-xs font-semibold text-slate-300">{teamLabel(teamId)}</p>
                  <Badge variant={participants.find((participant) => participant.teamId === teamId)?.win ? "success" : "destructive"}>
                    {participants.find((participant) => participant.teamId === teamId)?.win ? "Win" : "Loss"}
                  </Badge>
                </div>
                {participants
                  .filter((participant) => participant.teamId === teamId)
                  .map((participant) => (
                    <ParticipantRow
                      key={participant.puuid || `${teamId}-${participant.riotId}`}
                      participant={participant}
                      maxDamage={maxDamage}
                      region={region}
                    />
                  ))}
              </section>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
