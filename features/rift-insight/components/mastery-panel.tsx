import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslator } from "@/components/translations";
import { EmptyState } from "@/features/rift-insight/components/empty-state";
import { SectionLabel } from "@/features/rift-insight/components/section-label";
import type { Language, ProfileResponse } from "@/lib/types";

export function MasteryPanel({ profile, language }: { profile: ProfileResponse | null; language: Language }) {
  const t = getTranslator(language);

  return (
    <Card>
      <CardHeader className="space-y-1 p-5">
        <div className="space-y-1">
          <SectionLabel>{t("championMastery")}</SectionLabel>
          <CardTitle className="text-2xl text-white">{t("topMasteryPicks")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="grid gap-3">
          {profile?.mastery.length ? (
            profile.mastery.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-11 w-11 rounded-xl border border-white/10">
                    <AvatarImage src={entry.icon || undefined} alt={entry.name} />
                    <AvatarFallback className="rounded-xl bg-sky-400/15 text-sm font-semibold text-white">
                      {entry.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{entry.name}</p>
                    <p className="text-sm text-slate-400">{entry.points.toLocaleString()} mastery points</p>
                  </div>
                </div>
                <Badge variant="subtle" className="min-w-14 justify-center px-3 py-1.5 text-amber-200">Lv {entry.level}</Badge>
              </div>
            ))
          ) : (
            <EmptyState title={t("noMasteryData")} description={t("noMasteryDataDesc")} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
