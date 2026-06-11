import { cn } from "@/lib/utils";

function statValueSize(value: string) {
  const length = value.replace(/\s+/g, "").length;

  if (length <= 4) return "text-base";
  if (length <= 6) return "text-[15px]";
  return "text-sm";
}

export function StatBlock({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="flex h-[70px] min-w-0 flex-col items-center justify-center rounded-md border border-white/8 bg-slate-950 px-2 py-2 text-center shadow-sm">
      <span className="w-full truncate text-[10px] font-semibold uppercase leading-3 tracking-normal text-slate-300">{label}</span>
      <span
        className={cn(
          "mt-1 w-full truncate font-sans font-semibold leading-5 text-white antialiased tabular-nums",
          statValueSize(value)
        )}
      >
        {value}
      </span>
      {detail ? <small className="mt-1 w-full truncate text-[11px] font-medium leading-4 text-slate-300">{detail}</small> : null}
    </div>
  );
}
