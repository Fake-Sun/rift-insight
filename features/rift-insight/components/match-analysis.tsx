import { Check, Lightbulb, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getCopy,
  insightCopy,
  metricLabels,
} from "@/features/rift-insight/copy";
import { cn } from "@/lib/utils";
import type { MatchAnalysis as Analysis } from "@/lib/match-analysis";
import type { Language } from "@/lib/types";

export function InsightBadges({
  analysis,
  language,
  compact = false,
  limit,
}: {
  analysis?: Analysis;
  language: Language;
  compact?: boolean;
  limit?: number;
}) {
  if (!analysis || analysis.score === null) return null;
  return (
    <div
      className={compact ? "contents" : "flex flex-wrap items-center gap-1.5"}
    >
      {analysis.insights
        .slice(0, limit ?? (compact ? 2 : undefined))
        .map((insight) => (
          <Badge
            key={insight.id}
            variant={insight.tone === "positive" ? "success" : "warning"}
            className={
              compact ? "rounded-sm px-1.5 py-0.5 text-[10px]" : undefined
            }
          >
            <span aria-hidden="true">
              {insight.tone === "positive" ? (
                <Check className="size-3" />
              ) : (
                <Lightbulb className="size-3" />
              )}
            </span>
            {insightCopy(language, insight.id, insight.value).label}
          </Badge>
        ))}
    </div>
  );
}

export function ScoreBadge({
  score,
  language,
  compact = false,
}: {
  score: number;
  language: Language;
  compact?: boolean;
}) {
  const c = getCopy(language);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium tabular-nums",
        compact && "gap-1 rounded-sm px-1.5 py-0.5 text-[10px]",
        score >= 70
          ? "border-primary/35 bg-primary/20 text-primary"
          : score >= 45
            ? "border-border bg-muted text-foreground"
            : "border-amber-200/20 bg-amber-200/5 text-amber-200",
      )}
      title={`${c.score}: ${score} ${c.outOf}`}
    >
      <Sparkles
        className={compact ? "size-2.5" : "size-3"}
        aria-hidden="true"
      />
      <span className="sr-only">{c.score} </span>
      <strong>{score}</strong>
      <span className="opacity-60">/ 100</span>
    </span>
  );
}

export function MatchAnalysisDetails({
  analysis,
  language,
}: {
  analysis?: Analysis;
  language: Language;
}) {
  const c = getCopy(language);
  if (!analysis || analysis.score === null)
    return (
      <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        {c[analysis?.reason ?? "insufficientData"]}
      </p>
    );
  return (
    <section className="space-y-4 rounded-lg border border-primary/15 bg-primary/[0.025] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h5 className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-primary" />
          {c.analysis}
        </h5>
        <ScoreBadge score={analysis.score} language={language} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 @min-[650px]:grid-cols-5">
        {analysis.breakdown.map((entry) => (
          <div key={entry.metric}>
            <div className="mb-2 flex justify-between gap-2 text-xs">
              <span className="text-muted-foreground">
                {metricLabels[language][entry.metric]}
              </span>
              <span className="tabular-nums">{entry.score}</span>
            </div>
            <div
              role="meter"
              aria-label={metricLabels[language][entry.metric]}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={entry.score}
              className="h-1 rounded-full bg-secondary"
            >
              <div
                className="h-full rounded-full bg-primary/70"
                style={{ width: `${entry.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {analysis.insights.map((insight) => {
          const text = insightCopy(language, insight.id, insight.value);
          return (
            <div key={insight.id} className="rounded-md bg-background/45 p-3">
              <p
                className={cn(
                  "mb-1 text-sm font-semibold",
                  insight.tone === "positive"
                    ? "text-emerald-300"
                    : "text-amber-200",
                )}
              >
                {text.label}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {text.description}
              </p>
            </div>
          );
        })}
        {!analysis.insights.length ? (
          <p className="text-sm text-muted-foreground">{c.balanced}</p>
        ) : null}
      </div>
      <p className="border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
        {c.method} {c.methodLimits}
      </p>
    </section>
  );
}
