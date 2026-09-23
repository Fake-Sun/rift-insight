import { Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslator } from "@/components/translations";
import { EmptyState } from "@/features/rift-insight/components/empty-state";
import { getCopy } from "@/features/rift-insight/copy";
import type { Language, ProfileResponse } from "@/lib/types";

export function MasteryPanel({
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
          <Medal className="size-4 text-primary" />
          {c.mastery}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="divide-y divide-border">
          {profile?.mastery.length ? (
            profile.mastery.map((entry) => (
              <div
                key={entry.id}
                className="grid grid-cols-[32px_minmax(0,1fr)] items-center gap-2 py-2.5 first:pt-0 last:pb-0"
              >
                <Avatar className="size-8 rounded-full">
                  <AvatarImage src={entry.icon || undefined} alt={entry.name} />
                  <AvatarFallback className="rounded-md text-xs">
                    {entry.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <p className="text-sm font-semibold">{entry.name}</p>
                    <Badge variant="subtle" className="text-[10px]">
                      Lv {entry.level.toLocaleString()}
                    </Badge>
                  </div>
                  <p
                    title={c.masteryPoints}
                    className="mt-1 text-xs tabular-nums text-muted-foreground"
                  >
                    {entry.points.toLocaleString(
                      language === "en" ? "en-US" : "es-AR",
                    )}{" "}
                    <span className="text-muted-foreground/70">pts</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title={t("noMasteryData")}
              description={t("noMasteryDataDesc")}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
