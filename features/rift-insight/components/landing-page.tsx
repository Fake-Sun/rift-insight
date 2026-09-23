import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Crosshair,
  Eye,
  Layers3,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCopy, insightCopy } from "@/features/rift-insight/copy";
import type { Language } from "@/lib/types";

export function LandingPage({ language }: { language: Language }) {
  const c = getCopy(language);
  const features = [
    { icon: Layers3, title: c.featureOne, text: c.featureOneText },
    { icon: Crosshair, title: c.featureTwo, text: c.featureTwoText },
    { icon: TrendingUp, title: c.featureThree, text: c.featureThreeText },
  ];
  return (
    <div className="reveal">
      <section className="relative grid min-h-[580px] items-center gap-8 py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-16">
        <div className="relative z-10 max-w-2xl">
          <Badge
            variant="outline"
            className="mb-7 gap-2 rounded-full px-3 py-2 text-[10px] tracking-[0.16em]"
          >
            <span className="size-1.5 rounded-full bg-victory shadow-[0_0_10px_#21eea5]" />
            {c.eyebrow}
          </Badge>
          <h1 className="text-[clamp(2.8rem,5.7vw,5.8rem)] font-bold leading-[1.06] tracking-[-0.055em]">
            {c.title}
            <br />
            <span className="hero-title-accent">{c.titleAccent}</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {c.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => document.getElementById("riot-game-name")?.focus()}
            >
              {c.searchCta}
              <ArrowUpRight />
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href="#explore">
                {c.howItWorks}
                <ArrowDown />
              </a>
            </Button>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="size-3.5 text-primary" />
            {c.noLogin}
          </p>
        </div>

        <div
          className="relative mx-auto flex h-[380px] w-full max-w-[520px] items-center justify-center sm:h-[440px]"
          aria-label={c.preview}
        >
          <div className="hero-grid pointer-events-none absolute inset-0" />
          <div className="hero-orbit pointer-events-none absolute size-[300px] sm:size-[370px]" />
          <div className="hero-orbit pointer-events-none absolute size-[235px] border-dashed sm:size-[295px]" />
          <div className="hero-glow pointer-events-none absolute inset-0 rounded-full" />
          <Image
            src="/rift-insight-brand@2x.png"
            alt="Rift Insight"
            width={888}
            height={1432}
            priority
            className="relative h-[280px] w-auto object-contain drop-shadow-[0_20px_35px_#00000070] sm:h-[330px]"
          />
          <Card className="float-card absolute left-0 top-5 w-[160px] border-primary/40 bg-card/95 shadow-[0_12px_60px_#006aff26] sm:top-9 sm:w-[184px]">
            <CardContent className="p-4">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" />
                {c.score}
              </p>
              <p className="mt-2 font-heading text-4xl font-bold tracking-tight text-primary">
                82
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  / 100
                </span>
              </p>
              <div className="mt-3 flex items-end gap-1" aria-hidden="true">
                {[35, 55, 42, 64, 58, 78, 66, 82, 72, 95].map((height, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-[#1678ff] to-primary"
                    style={{ height: `${height / 3}px` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="float-card-delayed absolute bottom-10 right-0 max-w-[225px] border-victory/30 bg-card/95 shadow-[0_12px_45px_#00eab018] sm:bottom-14">
            <CardContent className="space-y-3 p-4">
              <p className="text-xs text-muted-foreground">{c.strengths}</p>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="rounded-md bg-victory/15 p-1.5 text-victory">
                  <Eye className="size-4" />
                </span>
                {insightCopy(language, "strongVision", 1.2).label}
              </div>
              <Badge variant="success">
                <TrendingUp className="size-3" />
                {insightCopy(language, "strongFarm", 8).label}
              </Badge>
            </CardContent>
          </Card>
          <p className="absolute bottom-0 text-[10px] font-medium tracking-[0.18em] text-muted-foreground">
            {c.preview}
          </p>
        </div>
      </section>

      <section
        id="explore"
        className="reveal-delayed grid gap-4 border-t border-border pt-8 md:grid-cols-3"
      >
        {features.map(({ icon: Icon, title, text }, index) => (
          <Card key={title} className="feature-card relative overflow-hidden">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <span className="feature-icon grid size-10 place-items-center rounded-lg border">
                  <Icon className="size-5" />
                </span>
                <span className="font-heading text-xs text-muted-foreground/50">
                  0{index + 1}
                </span>
              </div>
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {text}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
