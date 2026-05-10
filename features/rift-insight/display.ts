import type { MatchRole } from "@/lib/types";

export const laneOptions: Array<"All" | MatchRole> = ["All", "TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];

export const roleSymbols: Record<string, string> = {
  TOP: "T",
  JUNGLE: "J",
  MIDDLE: "M",
  BOTTOM: "A",
  UTILITY: "S",
  UNKNOWN: "?"
};
