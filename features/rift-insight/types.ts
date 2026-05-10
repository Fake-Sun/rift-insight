import type { Language, Region } from "@/lib/types";

export type StatusState = {
  message: string;
  type: "info" | "success" | "error";
};

export type QuickProfile = {
  gameName: string;
  tagLine: string;
  region: Region;
};

export type FetchProfileArgs = {
  forceRefresh?: boolean;
  quick?: QuickProfile;
};

export type RiftInsightViewModel = {
  language: Language;
  gameName: string;
  tagLine: string;
  region: Region;
};
