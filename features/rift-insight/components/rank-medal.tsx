import { rankMedalUrls } from "@/features/rift-insight/constants";

export function RankMedal({
  tier,
  alt,
  className
}: {
  tier: string;
  alt: string;
  className?: string;
}) {
  if (!tier) return null;

  const src = rankMedalUrls[tier.toUpperCase()] || rankMedalUrls.UNRANKED;

  return (
    <img
      className={className || "h-8 w-8 shrink-0 object-contain"}
      src={src}
      alt={alt}
      onError={(event) => {
        const target = event.currentTarget;
        if (target.dataset.fallbackApplied === "true") {
          target.style.display = "none";
          return;
        }
        target.dataset.fallbackApplied = "true";
        target.src = rankMedalUrls.UNRANKED;
      }}
    />
  );
}
