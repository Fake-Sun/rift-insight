import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTranslator } from "@/components/translations";
import { ItemBuild } from "./item-build";
import { getCopy } from "@/features/rift-insight/copy";
import { buildProfileHref } from "@/features/rift-insight/routing";
import { cn } from "@/lib/utils";
import type { Language, MatchParticipant, Region } from "@/lib/types";
import styles from "./match-participants.module.css";

export function MatchParticipants({
  participants,
  region,
  language,
  puuid,
}: {
  participants: MatchParticipant[];
  region: Region;
  language: Language;
  puuid: string;
}) {
  const c = getCopy(language);
  const t = getTranslator(language);
  const teams = [...new Set(participants.map((p) => p.teamId))].sort(
    (a, b) => a - b,
  );
  const maxDamage = Math.max(1, ...participants.map((p) => p.damage));
  return (
    <div className={styles.scoreboard}>
      {teams.map((teamId) => {
        const team = participants.filter((p) => p.teamId === teamId);
        return (
          <section
            key={teamId}
            className="min-w-0 overflow-hidden rounded-md border border-border"
          >
            <div
              className={cn(
                "flex items-center justify-between gap-3 px-3 py-2 text-sm",
                team[0].win ? "bg-victory/10" : "bg-defeat/10",
              )}
            >
              <h5 className="font-semibold">
                {teamId === 100 ? c.blueTeam : c.redTeam}
                <span
                  className={cn(
                    "ml-2 text-xs font-normal",
                    team[0].win ? "text-victory" : "text-defeat",
                  )}
                >
                  {team[0].win ? c.victory : c.defeat}
                </span>
              </h5>
              <span className="text-xs tabular-nums text-muted-foreground">
                {team.reduce((total, p) => total + p.kills, 0)} /{" "}
                {team.reduce((total, p) => total + p.deaths, 0)} /{" "}
                {team.reduce((total, p) => total + p.assists, 0)}
              </span>
            </div>
            <div className={cn(styles.row, styles.heading)} aria-hidden="true">
              <span>{c.player}</span>
              <span>KDA</span>
              <span>{t("damage")}</span>
              <span className={styles.buildHeading}>{c.build}</span>
            </div>
            {team.map((player, index) => {
              const href =
                player.gameName && player.tagLine
                  ? buildProfileHref({
                      gameName: player.gameName,
                      tagLine: player.tagLine,
                      region,
                    })
                  : null;
              return (
                <div
                  key={player.puuid || index}
                  className={cn(
                    styles.row,
                    player.puuid === puuid && styles.currentPlayer,
                  )}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar className="size-8 rounded-md">
                      <AvatarImage
                        src={player.championIcon || undefined}
                        alt={player.championName}
                      />
                      <AvatarFallback className="rounded-md text-xs">
                        {player.championName.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      {href ? (
                        <Link
                          className="overflow-wrap-anywhere text-xs font-semibold underline-offset-4 hover:text-primary hover:underline sm:text-sm"
                          href={href}
                        >
                          {player.riotId}
                        </Link>
                      ) : (
                        <p className="overflow-wrap-anywhere text-xs font-semibold">
                          {player.riotId}
                        </p>
                      )}
                      <p className="text-[11px] text-muted-foreground">
                        {player.championName}
                      </p>
                    </div>
                  </div>
                  <div className="text-center tabular-nums">
                    <p className="whitespace-nowrap text-xs font-semibold sm:text-sm">
                      {player.kills} /{" "}
                      <span className="text-rose-300">{player.deaths}</span> /{" "}
                      {player.assists}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {player.kda} KDA
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="mb-1 text-xs tabular-nums sm:text-sm">
                      {player.damage.toLocaleString()}
                    </p>
                    <div className="h-1 rounded-full bg-secondary">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          teamId === 100 ? "bg-sky-300/80" : "bg-rose-300/80",
                        )}
                        style={{
                          width: `${(Math.max(0, player.damage) / maxDamage) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={styles.build}
                    aria-label={`${player.riotId} ${c.build}`}
                  >
                    <ItemBuild items={player.items ?? []} compact />
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
