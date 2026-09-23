import { Card } from "@/components/ui/card";
import { getTranslator } from "@/components/translations";
import { getCopy } from "@/features/rift-insight/copy";
import type { Language, ProfileResponse } from "@/lib/types";

export function SummaryPanel({
  profile,
  language,
}: {
  profile: ProfileResponse | null;
  language: Language;
}) {
  if (!profile) return null;
  const t = getTranslator(language);
  const c = getCopy(language);
  const matches = profile.matches;
  const wins = matches.filter((match) => match.win).length;
  const winRate = matches.length
    ? Math.round((wins / matches.length) * 100)
    : 0;
  const scores = matches.flatMap((match) =>
    typeof match.analysis?.score === "number" ? [match.analysis.score] : [],
  );
  const averageScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : "--";
  return (
    <Card className="@container rounded-md border-primary/20 bg-gradient-to-r from-primary/8 via-card to-card shadow-[inset_0_1px_0_#20ddff12]">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 p-4 @min-[800px]:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="grid size-16 shrink-0 place-items-center rounded-full"
            style={{
              background: matches.length
                ? `conic-gradient(var(--victory) ${winRate}%, var(--defeat) ${winRate}%)`
                : "var(--color-secondary)",
            }}
          >
            <div
              className="grid size-[52px] place-items-center rounded-full bg-card text-base font-semibold tabular-nums"
              aria-label={`${t("winRate")}: ${winRate}%`}
            >
              {winRate}%
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold">
              {matches.length} {c.sample}
            </h2>
            <p className="mt-1 text-sm tabular-nums">
              <span className="text-victory">
                {wins} {c.victories}
              </span>
              <span className="mx-2 text-muted-foreground">/</span>
              <span className="text-defeat">
                {matches.length - wins} {c.defeats}
              </span>
            </p>
          </div>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-xs text-muted-foreground">KDA</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {profile.summary.kdaRatio}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                : 1
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{c.averageScore}</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-primary">
              {averageScore}
              <span className="text-xs font-normal text-muted-foreground">
                {" "}
                / 100
              </span>
            </p>
          </div>
        </div>
        <dl className="grid w-full grid-cols-3 gap-4 border-t border-border pt-3 @min-[800px]:w-auto @min-[800px]:border-l @min-[800px]:border-t-0 @min-[800px]:pl-5 @min-[800px]:pt-0">
          {[
            [c.avgCs, profile.summary.averageCs],
            [c.avgKp, profile.summary.averageKillParticipation],
            [c.avgVision, profile.summary.averageVision],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-base font-semibold tabular-nums">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Card>
  );
}
