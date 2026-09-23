import { useId, useState } from "react";
import { ChevronDown, Clock3, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getTranslator,
  laneLabel,
  queueLabelFor,
} from "@/components/translations";
import { ItemBuild } from "./item-build";
import {
  InsightBadges,
  MatchAnalysisDetails,
  ScoreBadge,
} from "./match-analysis";
import { MatchParticipants } from "./match-participants";
import { MatchRoster } from "./match-roster";
import { StatBlock } from "./stat-block";
import { getCopy } from "@/features/rift-insight/copy";
import { cn } from "@/lib/utils";
import type { Language, ProfileResponse, Region } from "@/lib/types";
import styles from "./match-card.module.css";

export function MatchCard({
  language,
  match,
  region,
  puuid,
}: {
  language: Language;
  match: ProfileResponse["matches"][number];
  region: Region;
  puuid: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const t = getTranslator(language);
  const c = getCopy(language);
  const multiKills = [
    "",
    "",
    c.doubleKill,
    c.tripleKill,
    c.quadraKill,
    c.pentaKill,
  ];
  const date = new Date(match.gameEndTimestamp);
  return (
    <Card className={cn(styles.card, match.win ? styles.win : styles.loss)}>
      <article>
        <div className={styles.compact}>
          <div className={styles.result}>
            <p className={styles.queue}>
              {queueLabelFor(language, match.queueId)}
            </p>
            <strong className={styles.outcome}>
              {match.win ? c.victory : c.defeat}
            </strong>
          </div>
          <div className={styles.champion}>
            <h4>{match.championName}</h4>
            <div className={styles.portrait}>
              <Avatar className={styles.championIcon}>
                <AvatarImage
                  src={match.championIcon || undefined}
                  alt={match.championName}
                />
                <AvatarFallback>
                  {match.championName.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5">
                {match.spells.map((spell) => (
                  <Avatar key={spell.name} className="size-[21px] rounded-sm">
                    <AvatarImage
                      src={spell.icon}
                      alt={spell.name}
                      title={spell.name}
                    />
                    <AvatarFallback className="rounded-sm text-[10px]">
                      {spell.name[0]}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.kda}>
            <p>
              {match.kills}
              <span> / </span>
              <span className="text-defeat">{match.deaths}</span>
              <span> / </span>
              {match.assists}
            </p>
            <span>
              <strong>{match.kda}</strong> KDA
            </span>
            <span className={styles.role}>
              {laneLabel(language, match.role)}
            </span>
          </div>
          <dl className={styles.metrics}>
            <div>
              <dt>CS/min</dt>
              <dd>{match.csPerMinute}</dd>
            </div>
            <div>
              <dt>KP</dt>
              <dd>{match.killParticipation}%</dd>
            </div>
            <div>
              <dt>DPM</dt>
              <dd>{match.damagePerMinute.toLocaleString()}</dd>
            </div>
          </dl>
          <dl className={`${styles.metrics} ${styles.extraMetrics}`}>
            <div>
              <dt>GPM</dt>
              <dd>{match.goldPerMinute.toLocaleString()}</dd>
            </div>
            <div>
              <dt>DTPM</dt>
              <dd>{match.takenPerMinute.toLocaleString()}</dd>
            </div>
          </dl>
          <div className={styles.build} aria-label={c.build}>
            <ItemBuild
              items={match.items}
              compact
              className={styles.itemGrid}
            />
          </div>
          <div className={styles.roster}>
            <MatchRoster
              participants={match.participants ?? []}
              language={language}
              puuid={puuid}
            />
          </div>
          <div className={styles.meta}>
            <span>
              <Clock3 size={11} aria-hidden="true" />
              {match.duration}
            </span>
            <span aria-hidden="true">·</span>
            <time
              dateTime={date.toISOString()}
              title={date.toLocaleString(language === "en" ? "en-US" : "es-AR")}
            >
              {date.toLocaleDateString(language === "en" ? "en-US" : "es-AR", {
                month: "short",
                day: "numeric",
              })}
            </time>
            <span className={styles.metaStat}>{match.cs} CS</span>
            <span
              className={styles.metaStat}
              title={c.vision}
              aria-label={`${c.vision}: ${match.visionScore}`}
            >
              <Eye size={12} aria-hidden="true" />
              {match.visionScore}
            </span>
          </div>
          <div className={styles.feedback}>
            {typeof match.analysis?.score === "number" ? (
              <ScoreBadge
                score={match.analysis.score}
                language={language}
                compact
              />
            ) : null}
            {match.largestMultiKill >= 2 ? (
              <Badge
                variant="warning"
                className="rounded-sm px-1.5 py-0.5 text-[10px]"
              >
                {multiKills[Math.min(5, match.largestMultiKill)]}
              </Badge>
            ) : null}
            <InsightBadges
              analysis={match.analysis}
              language={language}
              compact
              limit={1}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={styles.detailsButton}
            aria-expanded={expanded}
            aria-label={expanded ? t("hideDetails") : t("showDetails")}
            title={expanded ? t("hideDetails") : t("showDetails")}
            aria-controls={detailsId}
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronDown
              className={cn("transition-transform", expanded && "rotate-180")}
            />
          </Button>
        </div>
        {expanded ? (
          <div
            id={detailsId}
            className="@container space-y-4 border-t border-border bg-background/70 p-3 sm:p-4"
          >
            <div className="grid grid-cols-3 gap-1.5 @min-[480px]:grid-cols-5">
              <StatBlock
                label="CS/min"
                value={match.csPerMinute}
                detail={`${match.cs} CS`}
              />
              <StatBlock label="KP" value={`${match.killParticipation}%`} />
              <StatBlock
                label="DPM"
                value={match.damagePerMinute.toLocaleString()}
                detail={match.damage}
              />
              <StatBlock
                label="DTPM"
                value={match.takenPerMinute.toLocaleString()}
                detail={match.totalDamageTaken}
              />
              <StatBlock
                label="GPM"
                value={match.goldPerMinute.toLocaleString()}
                detail={match.gold}
              />
            </div>
            {match.participants?.length ? (
              <MatchParticipants
                participants={match.participants}
                region={region}
                language={language}
                puuid={puuid}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {c.insufficientData}
              </p>
            )}
            <MatchAnalysisDetails
              analysis={match.analysis}
              language={language}
            />
          </div>
        ) : null}
      </article>
    </Card>
  );
}
