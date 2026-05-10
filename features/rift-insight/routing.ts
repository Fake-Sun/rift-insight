import type { Region } from "@/lib/types";

type Lookup = {
  gameName: string;
  tagLine: string;
  region: Region;
};

function slugifyPart(value: string) {
  return encodeURIComponent(value.trim().toLowerCase().replace(/\s+/g, "-"));
}

function unslugifyPart(value: string) {
  return decodeURIComponent(value).replace(/-/g, " ").trim();
}

export function buildProfileSlug(gameName: string, tagLine: string) {
  return `${slugifyPart(gameName)}~${slugifyPart(tagLine)}`;
}

export function parseProfileSlug(profile: string) {
  const [rawGameName, rawTagLine] = profile.split("~");
  if (!rawGameName || !rawTagLine) {
    return null;
  }

  return {
    gameName: unslugifyPart(rawGameName),
    tagLine: unslugifyPart(rawTagLine)
  };
}

export function buildProfileHref({ gameName, tagLine, region }: Lookup) {
  const slug = buildProfileSlug(gameName, tagLine);
  if (region === "LA2") {
    return `/${slug}`;
  }

  return `/${slug}?region=${region}`;
}
