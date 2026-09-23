import { RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getTranslator } from "@/components/translations";
import { getCopy } from "@/features/rift-insight/copy";
import { cn } from "@/lib/utils";
import type { Language, ProfileResponse } from "@/lib/types";

export function ProfileCard({
  profile,
  language,
  loading,
  onRefresh,
}: {
  profile: ProfileResponse;
  language: Language;
  loading: boolean;
  onRefresh: () => void;
}) {
  const t = getTranslator(language);
  const c = getCopy(language);
  return (
    <section className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 py-2 sm:py-3">
      <div className="flex min-w-0 items-center gap-4 sm:gap-5">
        <div className="relative shrink-0 pb-2">
          <Avatar className="size-16 rounded-xl ring-1 ring-white/15 sm:size-20">
            <AvatarImage
              src={profile.profile.profileIcon || undefined}
              alt={profile.profile.gameName}
            />
            <AvatarFallback>
              {profile.profile.gameName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span
            title={c.level}
            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded border border-border bg-card px-2 text-xs font-semibold tabular-nums"
          >
            {profile.profile.summonerLevel.toLocaleString()}
          </span>
        </div>
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            {profile.profile.region}{" "}
            <span className="text-muted-foreground/50">/</span> League of
            Legends
          </div>
          <h1 className="overflow-wrap-anywhere text-2xl font-semibold tracking-tight sm:text-[32px]">
            {profile.profile.gameName}{" "}
            <span className="font-normal text-muted-foreground">
              #{profile.profile.tagLine}
            </span>
          </h1>
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 h-8 rounded-md border border-input text-xs"
            disabled={loading}
            onClick={onRefresh}
          >
            <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
            {t("refreshLive")}
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-3 self-end pb-1 sm:self-center">
        <p className="text-xs text-muted-foreground">{t("recentForm")}</p>
        <div className="flex gap-1">
          {profile.matches.slice(0, 5).map((match) => (
            <span
              key={match.matchId}
              title={match.win ? c.victory : c.defeat}
              className={cn(
                "grid size-6 place-items-center rounded-sm text-[11px] font-bold",
                match.win
                  ? "bg-victory/20 text-victory ring-1 ring-inset ring-victory/30"
                  : "bg-defeat/20 text-defeat ring-1 ring-inset ring-defeat/30",
              )}
            >
              {match.win ? "W" : "L"}
            </span>
          ))}
          {!profile.matches.length ? (
            <span className="text-sm text-muted-foreground">
              {t("noGames")}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
