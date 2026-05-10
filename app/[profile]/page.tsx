import { notFound } from "next/navigation";
import { RiftInsightFeature } from "@/features/rift-insight";
import { parseProfileSlug } from "@/features/rift-insight/routing";
import type { Region } from "@/lib/types";

const validRegions = new Set<Region>(["NA1", "EUW1", "EUN1", "KR", "JP1", "BR1", "LA1", "LA2", "OC1", "TR1", "RU"]);

export default async function ProfilePage({
  params,
  searchParams
}: {
  params: Promise<{ profile: string }>;
  searchParams: Promise<{ region?: string }>;
}) {
  const { profile } = await params;
  const { region } = await searchParams;

  const parsed = parseProfileSlug(profile);
  if (!parsed) {
    notFound();
  }

  const selectedRegion = region && validRegions.has(region as Region) ? (region as Region) : "LA2";

  return (
    <RiftInsightFeature
      initialLookup={{
        gameName: parsed.gameName,
        tagLine: parsed.tagLine,
        region: selectedRegion
      }}
    />
  );
}
