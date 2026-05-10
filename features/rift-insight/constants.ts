import type { SelectOption } from "@/components/custom-select";
import type { Language, Region } from "@/lib/types";
import type { QuickProfile } from "@/features/rift-insight/types";

export const rankMedalUrls: Record<string, string> = {
  UNRANKED: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/unranked.svg",
  IRON: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/iron.svg",
  BRONZE: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/bronze.svg",
  SILVER: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/silver.svg",
  GOLD: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/gold.svg",
  PLATINUM: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/platinum.svg",
  EMERALD: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/emerald.svg",
  DIAMOND: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/diamond.svg",
  MASTER: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/master.svg",
  GRANDMASTER: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/grandmaster.svg",
  CHALLENGER: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/challenger.svg"
};

export const defaultProfile = {
  gameName: "Fake Sun",
  tagLine: "Kite",
  region: "LA2" as const
};

export const quickProfiles: QuickProfile[] = [
  defaultProfile,
  { gameName: "Faker", tagLine: "KR1", region: "KR" },
  { gameName: "Keria", tagLine: "KR1", region: "KR" },
  { gameName: "Canyon", tagLine: "KR1", region: "KR" }
];

export const regionOptions: SelectOption<Region>[] = [
  "NA1",
  "EUW1",
  "EUN1",
  "KR",
  "JP1",
  "BR1",
  "LA1",
  "LA2",
  "OC1",
  "TR1",
  "RU"
].map((value) => ({
  value: value as Region,
  label: value
}));

export const languageOptions: SelectOption<Language>[] = [
  { value: "en", label: "English" },
  { value: "es-LATAM", label: "Español LATAM" }
];
