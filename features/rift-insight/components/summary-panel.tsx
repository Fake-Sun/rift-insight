import { Card, CardContent } from "@/components/ui/card";
import { MetricValue } from "@/features/rift-insight/components/metric-value";
import { Skeleton } from "@/components/ui/skeleton";
import { getTranslator } from "@/components/translations";
import type { Language, ProfileResponse } from "@/lib/types";

export function SummaryPanel({ profile, language }: { profile: ProfileResponse | null; language: Language }) {
  const t = getTranslator(language);

  if (!profile) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-3 p-5">
              <Skeleton className="h-4 w-16 bg-white/8" />
              <Skeleton className="h-9 w-24 bg-white/8" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    { label: t("matches"), value: profile.summary.totalGames },
    { label: "KDA", value: profile.summary.kdaRatio },
    { label: "Avg CS", value: profile.summary.averageCs },
    { label: "Avg KP", value: profile.summary.averageKillParticipation },
    { label: t("vision"), value: profile.summary.averageVision }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="space-y-2 p-5">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <MetricValue value={stat.value} className="mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
