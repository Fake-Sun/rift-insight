import { cn } from "@/lib/utils";

function sizeClassForValue(value: string | number, variant: "hero" | "compact" = "hero") {
  const normalized = String(value).replace(/\s+/g, "");
  const length = normalized.length;

  if (variant === "compact") {
    if (length <= 4) return "text-sm";
    if (length <= 6) return "text-[13px]";
    return "text-xs";
  }

  if (length <= 4) return "text-3xl";
  if (length <= 6) return "text-[1.65rem]";
  if (length <= 8) return "text-[1.35rem]";
  return "text-xl";
}

function fontClassForVariant(variant: "hero" | "compact") {
  if (variant === "compact") {
    return "font-sans font-semibold tracking-normal";
  }

  return "font-[family:var(--font-space-grotesk)] font-semibold tracking-tight";
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
        "block w-full truncate tabular-nums text-white antialiased",
        fontClassForVariant(variant),
        sizeClassForValue(value, variant),
        className
      )}
    >
      {value}
    </span>
  );
}
