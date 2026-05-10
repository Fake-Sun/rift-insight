import { cn } from "@/lib/utils";

function sizeClassForValue(value: string | number, variant: "hero" | "compact" = "hero") {
  const normalized = String(value).replace(/\s+/g, "");
  const length = normalized.length;

  if (variant === "compact") {
    if (length <= 4) return "text-[11px]";
    if (length <= 6) return "text-[10px]";
    return "text-[9px]";
  }

  if (length <= 4) return "text-3xl";
  if (length <= 6) return "text-[1.65rem]";
  if (length <= 8) return "text-[1.35rem]";
  return "text-xl";
}

export function MetricValue({
  value,
  variant = "hero",
  className
}: {
  value: string | number;
  variant?: "hero" | "compact";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "block w-full truncate font-[family:var(--font-space-grotesk)] font-semibold tabular-nums tracking-tight text-white",
        sizeClassForValue(value, variant),
        className
      )}
    >
      {value}
    </span>
  );
}
