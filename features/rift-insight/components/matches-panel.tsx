import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTranslator, laneLabel } from "@/components/translations";
import { EmptyState } from "@/features/rift-insight/components/empty-state";
import { MatchCard } from "@/features/rift-insight/components/match-card";
import { getCopy } from "@/features/rift-insight/copy";
import { laneOptions } from "@/features/rift-insight/display";
import type { Language, MatchRole, ProfileResponse, Region } from "@/lib/types";

type Props = {
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
  filteredMatches,
}: Props) {
  const t = getTranslator(language);
  const c = getCopy(language);
  return (
    <section id="match-history" className="min-w-0 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight">
          {c.history}
          <span className="ml-2 align-middle text-xs font-normal text-muted-foreground">
            {filteredMatches.length}
          </span>
        </h2>
        <span className="text-xs text-muted-foreground">{c.latest}</span>
      </div>
      <Tabs
        value={lane}
        onValueChange={(value) => onLaneChange(value as "All" | MatchRole)}
      >
        <TabsList
          aria-label={c.history}
          className="mb-3 w-full justify-start rounded-md border border-border bg-card"
        >
          {laneOptions.map((entry) => (
            <TabsTrigger key={entry} value={entry} className="px-2.5 text-xs">
              {laneLabel(language, entry)}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={lane} className="mt-0">
          <div className="grid gap-2">
            {profile && filteredMatches.length ? (
              filteredMatches.map((match) => (
                <MatchCard
                  key={match.matchId}
                  language={language}
                  match={match}
                  region={profile.profile.region as Region}
                  puuid={profile.profile.puuid}
                />
              ))
            ) : (
              <EmptyState
                title={t("noMatchesLane")}
                description={t("noMatchesLaneDesc")}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
