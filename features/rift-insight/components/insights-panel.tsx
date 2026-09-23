import { Compass, Lightbulb, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslator, laneLabel } from "@/components/translations";
import { EmptyState } from "@/features/rift-insight/components/empty-state";
import { getCopy, insightCopy } from "@/features/rift-insight/copy";
import type { InsightId } from "@/lib/match-analysis";
import type { Language, MatchRole, ProfileResponse } from "@/lib/types";

export function InsightsPanel({
  profile,
  language,
}: {
  profile: ProfileResponse | null;
  language: Language;
}) {
  const c = getCopy(language);
  const t = getTranslator(language);
  const scored =
    profile?.matches.filter(
      (match) => typeof match.analysis?.score === "number",
    ) ?? [];
  const counts = new Map<InsightId, number>();
  scored.forEach((match) =>
    match.analysis?.insights
      .filter((insight) => insight.tone === "improve")
      .forEach((insight) =>
        counts.set(insight.id, (counts.get(insight.id) ?? 0) + 1),
      ),
  );
  const focus = [...counts].sort((a, b) => b[1] - a[1]).slice(0, 2);
  const roleCounts = new Map<MatchRole, number>();
  profile?.matches.forEach((match) =>
    roleCounts.set(match.role, (roleCounts.get(match.role) ?? 0) + 1),
  );
  const primaryRole = [...roleCounts].sort((a, b) => b[1] - a[1])[0]?.[0];
  return (
    <aside className="grid min-w-0 content-start gap-4 md:grid-cols-2 lg:grid-cols-1">
      <Card
        id="performance"
        className="rounded-md border-primary/25 bg-gradient-to-br from-primary/10 to-card shadow-none"
      >
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-primary" />
            {c.analysis}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0">
          <p className="text-xs text-muted-foreground">
            {scored.length} {c.scoredGames}
          </p>
          {focus.length ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">{c.improve}</p>
              {focus.map(([id, count]) => (
                <div
                  key={id}
                  className="flex items-center justify-between gap-2 rounded-md border border-highlight/25 bg-highlight/10 p-2.5"
                >
                  <span className="flex items-center gap-2 text-xs text-highlight">
                    <Lightbulb className="size-3.5 shrink-0" />
                    {insightCopy(language, id, 0).label}
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {count}/{scored.length}
                  </span>
                </div>
              ))}
              <p className="text-xs leading-5 text-muted-foreground">
                {c.improvementHint}
              </p>
            </div>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              {scored.length ? c.balanced : c.insufficientData}
            </p>
          )}
          <details className="border-t border-border pt-3">
            <summary className="cursor-pointer text-xs font-medium text-primary">
              {c.methodTitle}
            </summary>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              {c.method} {c.methodLimits}
            </p>
          </details>
        </CardContent>
      </Card>
      <Card id="champions" className="rounded-md shadow-none">
        <CardHeader className="p-4">
          <CardTitle className="text-base">{c.picks}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="divide-y divide-border">
            {profile?.championStats.length ? (
              profile.championStats.map((entry) => (
                <div
                  key={entry.name}
                  className="grid grid-cols-[36px_minmax(0,1fr)] gap-3 py-3 first:pt-1 last:pb-0"
                >
                  <Avatar className="size-9 rounded-md">
                    <AvatarImage
                      src={entry.icon || undefined}
                      alt={entry.name}
                    />
                    <AvatarFallback className="rounded-md text-xs">
                      {entry.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex flex-wrap justify-between gap-1">
                      <strong className="text-sm font-semibold">
                        {entry.name}
                      </strong>
                      <span className="text-xs font-semibold tabular-nums text-primary">
                        {entry.winRate}%
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {entry.games} {t("games")}{" "}
                      <span className="px-1 text-muted-foreground/40">/</span>{" "}
                      {entry.averageKda} KDA
                    </p>
                    <div className="mt-2 h-1 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary/65"
                        style={{ width: `${entry.winRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title={t("noChampionBreakdown")}
                description={t("noChampionBreakdownDesc")}
              />
            )}
          </div>
        </CardContent>
      </Card>
      <Card id="meta" className="rounded-md shadow-none">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Compass className="size-4 text-muted-foreground" />
            {c.snapshot}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          <div className="flex justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{c.region}</span>
            <span>{profile?.profile.region ?? "--"}</span>
          </div>
          <div className="flex justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{c.primaryRole}</span>
            <span>{primaryRole ? laneLabel(language, primaryRole) : "--"}</span>
          </div>
          <div className="flex justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{t("matches")}</span>
            <span>{profile?.matches.length ?? 0}</span>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
