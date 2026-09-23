import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslator, queueLabelFor } from "@/components/translations";
import { EmptyState } from "@/features/rift-insight/components/empty-state";
import { RankMedal } from "@/features/rift-insight/components/rank-medal";
import { getCopy } from "@/features/rift-insight/copy";
import type { Language, ProfileResponse } from "@/lib/types";

export function RankPanel({
  profile,
  language,
}: {
  profile: ProfileResponse | null;
  language: Language;
}) {
  const t = getTranslator(language);
  const c = getCopy(language);
  return (
    <Card className="rounded-md shadow-none">
      <CardHeader className="border-b border-border px-3 py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="size-4 text-primary" />
          {c.ranked}
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border p-0">
        {profile?.ranked.length ? (
          profile.ranked.map((entry) => {
            const apex = ["MASTER", "GRANDMASTER", "CHALLENGER"].includes(
              entry.tier,
            );
            return (
              <div key={entry.queueType} className="p-3">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  {queueLabelFor(
                    language,
                    entry.queueType === "RANKED_SOLO_5x5" ? 420 : 440,
                  )}
                </p>
                <div className="flex items-center gap-3">
                  <RankMedal
                    tier={entry.emblemTier || entry.tier || "UNRANKED"}
                    alt={entry.tier || t("unranked")}
                    className="size-12 shrink-0 object-contain"
                  />
                  <div className="min-w-0">
                    <p className="text-base font-semibold capitalize">
                      {entry.tier.toLowerCase()}
                      {!apex && entry.rank ? ` ${entry.rank}` : ""}
                    </p>
                    <p className="mt-0.5 text-sm tabular-nums text-primary">
                      {entry.leaguePoints.toLocaleString()}{" "}
                      <span className="text-xs text-muted-foreground">LP</span>
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <p className="flex flex-wrap gap-2 tabular-nums">
                    <span className="text-emerald-300">
                      {entry.wins.toLocaleString()} W
                    </span>
                    <span className="text-muted-foreground">
                      {entry.losses.toLocaleString()} L
                    </span>
                  </p>
                  <Badge variant="subtle">{entry.winRate}% WR</Badge>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState
            title={t("noRankedData")}
            description={t("noRankedDataDesc")}
          />
        )}
      </CardContent>
    </Card>
  );
}
