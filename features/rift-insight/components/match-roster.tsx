import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCopy } from "@/features/rift-insight/copy";
import { cn } from "@/lib/utils";
import type { Language, MatchParticipant } from "@/lib/types";

export function MatchRoster({
  participants,
  language,
  puuid,
}: {
  participants: MatchParticipant[];
  language: Language;
  puuid: string;
}) {
  const c = getCopy(language);
  const teams = [...new Set(participants.map((player) => player.teamId))].sort(
    (a, b) => a - b,
  );
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {teams.map((teamId) => (
        <ul
          key={teamId}
          aria-label={teamId === 100 ? c.blueTeam : c.redTeam}
          className="min-w-0 space-y-px"
        >
          {participants
            .filter((player) => player.teamId === teamId)
            .map((player, index) => (
              <li
                key={player.puuid || index}
                title={`${player.riotId} · ${player.championName}`}
                className="flex min-w-0 items-center gap-1"
              >
                <Avatar className="size-4 rounded-sm">
                  <AvatarImage
                    src={player.championIcon || undefined}
                    alt={player.championName}
                  />
                  <AvatarFallback className="rounded-sm text-[8px]">
                    {player.championName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "truncate text-[11px] leading-[17px]",
                    player.puuid === puuid
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {player.gameName || player.riotId}
                </span>
              </li>
            ))}
        </ul>
      ))}
    </div>
  );
}
