import type { FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, LoaderCircle, Search } from "lucide-react";
import { CustomSelect } from "@/components/custom-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTranslator } from "@/components/translations";
import {
  defaultProfile,
  languageOptions,
  regionOptions,
} from "@/features/rift-insight/constants";
import { getCopy } from "@/features/rift-insight/copy";
import type { Language, Region } from "@/lib/types";

type SiteHeaderProps = {
  gameName: string;
  tagLine: string;
  region: Region;
  language: Language;
  loading: boolean;
  onGameName: (value: string) => void;
  onTagLine: (value: string) => void;
  onRegion: (value: Region) => void;
  onLanguage: (value: Language) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onTestAccount?: () => void;
};

const searchInputClass =
  "h-7 rounded-none border-0 bg-transparent p-0 text-sm shadow-none placeholder:text-muted-foreground/65 focus-visible:outline-none focus-visible:ring-0";

export function SiteHeader({
  gameName,
  tagLine,
  region,
  language,
  loading,
  onGameName,
  onTagLine,
  onRegion,
  onLanguage,
  onSubmit,
  onTestAccount,
}: SiteHeaderProps) {
  const t = getTranslator(language);
  const c = getCopy(language);
  return (
    <header className="relative z-50 border-b border-border bg-background/85">
      <div className="mx-auto grid max-w-[1720px] grid-cols-[1fr_auto] items-center gap-x-7 gap-y-4 px-4 py-4 sm:px-6 lg:grid-cols-[auto_minmax(0,640px)_1fr] lg:gap-x-12 lg:px-8">
        <Link
          href="/"
          aria-label={`Rift Insight - ${c.home}`}
          className="w-fit rounded-md"
        >
          <Image
            src="/rift-insight-brand@2x.png"
            alt="Rift Insight"
            width={888}
            height={1432}
            priority
            className="h-[72px] w-auto object-contain sm:h-[82px]"
          />
        </Link>
        <form
          aria-label={t("riotId")}
          className="order-3 min-w-0 space-y-1.5 max-lg:col-span-2 lg:order-none"
          onSubmit={onSubmit}
        >
          <div className="group/search grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(56px,0.5fr)_auto_auto] items-center gap-1 rounded-2xl border border-input bg-gradient-to-b from-secondary/55 to-card/80 p-1.5 shadow-[0_6px_24px_-12px_#00000080,inset_0_1px_0_#ffffff04] transition-[border-color,box-shadow] duration-300 hover:border-primary/25 focus-within:border-primary/45 focus-within:shadow-[0_0_0_3px_#70e1d50a,0_8px_28px_-14px_#70e1d535] sm:gap-2 sm:rounded-full sm:pl-2">
            <label className="flex min-w-0 items-center gap-3 rounded-lg py-1 pl-2 sm:pl-3">
              <Search
                className="hidden size-[18px] shrink-0 text-muted-foreground/70 transition-colors group-focus-within/search:text-primary sm:block"
                aria-hidden="true"
              />
              <span className="grid min-w-0 flex-1">
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {t("riotId")}
                </span>
                <Input
                  id="riot-game-name"
                  aria-label={t("gameName")}
                  value={gameName}
                  onChange={(e) => onGameName(e.target.value)}
                  placeholder={c.searchNamePlaceholder}
                  className={searchInputClass}
                  required
                  maxLength={32}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                />
              </span>
            </label>
            <label className="grid min-w-0 border-l border-input pl-2 sm:pl-4">
              <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                {c.searchTagPlaceholder}
              </span>
              <span className="flex min-w-0 items-center gap-1">
                <span className="text-sm text-primary/80" aria-hidden="true">
                  #
                </span>
                <Input
                  id="riot-tag-line"
                  aria-label={t("tagLine")}
                  value={tagLine}
                  onChange={(e) => onTagLine(e.target.value.replace(/^#/, ""))}
                  placeholder={c.searchTagPlaceholder}
                  className={searchInputClass}
                  required
                  maxLength={16}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                />
              </span>
            </label>
            <div className="w-[68px] border-l border-input pl-1 sm:w-[86px] sm:pl-2">
              <CustomSelect
                label={t("server")}
                value={region}
                onChange={onRegion}
                options={regionOptions}
                className="h-10 rounded-full border-0 bg-transparent px-2 text-xs shadow-none hover:bg-primary/5 focus:ring-1 focus:ring-primary/40 sm:text-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              aria-label={c.search}
              className="size-10 shrink-0 rounded-xl p-0 sm:h-11 sm:w-auto sm:gap-2 sm:rounded-full sm:px-4"
            >
              <span className="hidden sm:inline">{c.search}</span>
              {loading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <ArrowRight />
              )}
            </Button>
          </div>
          {onTestAccount ? (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 pl-3 sm:pl-5">
              <span className="text-xs text-muted-foreground/75">
                {c.testAccountHint}
              </span>
              <Button
                type="button"
                variant="ghost"
                disabled={loading}
                onClick={onTestAccount}
                title={`${defaultProfile.gameName}#${defaultProfile.tagLine} / ${defaultProfile.region}`}
                className="h-7 gap-1.5 rounded-full px-2 text-xs font-medium text-primary/85 hover:bg-primary/8 hover:text-primary [&_svg]:size-3"
              >
                {c.testAccount}
                <ArrowUpRight aria-hidden="true" />
              </Button>
              <span className="hidden text-[11px] text-muted-foreground/60 sm:inline">
                {defaultProfile.gameName}#{defaultProfile.tagLine}
              </span>
            </div>
          ) : null}
        </form>
        <div className="w-[170px] justify-self-end">
          <CustomSelect
            label={t("language")}
            value={language}
            onChange={onLanguage}
            options={languageOptions}
          />
        </div>
      </div>
    </header>
  );
}
