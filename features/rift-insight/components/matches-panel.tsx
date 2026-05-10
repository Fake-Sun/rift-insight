import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTranslator, laneLabel } from "@/components/translations";
import { EmptyState } from "@/features/rift-insight/components/empty-state";
import { MatchCard } from "@/features/rift-insight/components/match-card";
import { SectionLabel } from "@/features/rift-insight/components/section-label";
import { laneOptions } from "@/features/rift-insight/display";
import type { Language, MatchRole, ProfileResponse } from "@/lib/types";

type MatchesPanelProps = {
  profile: ProfileResponse | null;
  language: Language;
  lane: "All" | MatchRole;
  onLaneChange: (lane: "All" | MatchRole) => void;
  filteredMatches: ProfileResponse["matches"];
};

export function MatchesPanel({
  profile,
  language,
  lane,
  onLaneChange,
  filteredMatches
}: MatchesPanelProps) {
  const t = getTranslator(language);
  const laneMatches = lane === "All" ? profile?.matches ?? [] : filteredMatches;

  return (
    <Card>
      <CardHeader className="space-y-4 p-5">
        <div className="space-y-1">
          <SectionLabel>{t("recentMatches")}</SectionLabel>
          <CardTitle className="text-2xl text-white">{t("liveTimeline")}</CardTitle>
        </div>
        <Tabs value={lane} onValueChange={(value) => onLaneChange(value as "All" | MatchRole)} className="w-full">
          <TabsList className="w-full justify-start">
            {laneOptions.map((entry) => (
              <TabsTrigger key={entry} value={entry}>
                {laneLabel(language, entry)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <Tabs value={lane} onValueChange={(value) => onLaneChange(value as "All" | MatchRole)}>
          <TabsContent value={lane} className="mt-0">
            <div className="grid gap-3">
              {profile ? laneMatches.length ? laneMatches.map((match) => (
                <MatchCard key={match.matchId} language={language} match={match} />
              )) : <EmptyState title={t("noMatchesLane")} description={t("noMatchesLaneDesc")} /> : null}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
