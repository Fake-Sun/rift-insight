"use client";

import { useEffect, useMemo, useState } from "react";
import { getTranslator } from "@/components/translations";
import { defaultProfile } from "@/features/rift-insight/constants";
import type { FetchProfileArgs, StatusState } from "@/features/rift-insight/types";
import type { Language, MatchRole, ProfileResponse, Region } from "@/lib/types";

const LANGUAGE_STORAGE_KEY = "opgg-language";
type ApiErrorPayload = {
  error: string;
  code?: string;
};

export function useRiftInsightState(initialLookup?: { gameName: string; tagLine: string; region: Region }) {
  const [language, setLanguage] = useState<Language>("en");
  const [gameName, setGameName] = useState(initialLookup?.gameName ?? defaultProfile.gameName);
  const [tagLine, setTagLine] = useState(initialLookup?.tagLine ?? defaultProfile.tagLine);
  const [region, setRegion] = useState<Region>(initialLookup?.region ?? defaultProfile.region);
  const [lane, setLane] = useState<"All" | MatchRole>("All");
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [status, setStatus] = useState<StatusState>({
    message: "",
    type: "info"
  });
  const [loading, setLoading] = useState(false);

  const t = useMemo(() => getTranslator(language), [language]);

  useEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === "en" || stored === "es-LATAM") {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    if (!profile && !loading) {
      setStatus({ message: t("waiting"), type: "info" });
    }
  }, [language, loading, profile, t]);

  useEffect(() => {
    if (!initialLookup) return;

    setGameName(initialLookup.gameName);
    setTagLine(initialLookup.tagLine);
    setRegion(initialLookup.region);
    void fetchProfile({ quick: initialLookup });
  }, [initialLookup?.gameName, initialLookup?.region, initialLookup?.tagLine]);

  const filteredMatches = useMemo(() => {
    if (!profile) return [];
    return lane === "All" ? profile.matches : profile.matches.filter((match) => match.role === lane);
  }, [lane, profile]);

  async function fetchProfile({ forceRefresh = false, quick }: FetchProfileArgs = {}) {
    const next = quick || { gameName, tagLine, region };

    if (quick) {
      setGameName(quick.gameName);
      setTagLine(quick.tagLine);
      setRegion(quick.region);
    }

    setLoading(true);
    setLane("All");
    setStatus({ message: forceRefresh ? t("refreshing") : t("loading"), type: "info" });

    try {
      const params = new URLSearchParams(next);
      if (forceRefresh) params.set("refresh", "1");

      const response = await fetch(`/api/profile?${params.toString()}`);
      const payload = (await response.json()) as ProfileResponse | ApiErrorPayload;

      if (!response.ok || "error" in payload) {
        const errorPayload = ("error" in payload ? payload : { error: "Failed to load profile." }) as ApiErrorPayload;
        let message = errorPayload.error;

        if (errorPayload.code === "RIOT_API_KEY_MISSING") {
          message = t("apiKeyMissing");
        } else if (errorPayload.code === "RIOT_API_FORBIDDEN" || errorPayload.code === "RIOT_API_UNAUTHORIZED") {
          message = t("apiKeyInvalid");
        } else if (errorPayload.code === "RIOT_API_RATE_LIMIT" || response.status === 429) {
          message = t("apiRateLimited");
        }

        throw new Error(message);
      }

      setProfile(payload);
      setStatus({
        message: `${forceRefresh ? t("refreshed") : t("loaded")} ${payload.profile.gameName}#${payload.profile.tagLine} ${t("from")} ${payload.profile.region}.`,
        type: "success"
      });
    } catch (error) {
      setProfile(null);
      setStatus({
        message: error instanceof Error ? error.message : t("profileUnavailable"),
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    filteredMatches,
    fetchProfile,
    gameName,
    lane,
    language,
    loading,
    profile,
    region,
    setGameName,
    setLane,
    setLanguage,
    setRegion,
    setTagLine,
    status,
    t,
    tagLine
  };
}
