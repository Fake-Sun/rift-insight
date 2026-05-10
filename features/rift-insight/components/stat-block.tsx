import { MetricValue } from "@/features/rift-insight/components/metric-value";

export function StatBlock({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="flex h-[56px] min-w-0 flex-col items-center justify-center rounded-md border border-white/8 bg-slate-950/80 px-1.5 py-1 text-center shadow-sm">
      <span className="w-full truncate text-[9px] uppercase tracking-[0.08em] text-slate-500">{label}</span>
      <MetricValue value={value} variant="compact" className="mt-1 leading-none" />
      {detail ? <small className="mt-1 w-full truncate text-[9px] leading-none text-slate-500">{detail}</small> : null}
    </div>
  );
}
