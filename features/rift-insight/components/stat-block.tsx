export function StatBlock({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center rounded-md bg-background/50 px-1 py-2 text-center">
      <span className="text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
      <strong className="mt-1 whitespace-nowrap text-base font-semibold leading-6 tabular-nums text-foreground sm:text-lg">
        {value}
      </strong>
      <span className="mt-0.5 whitespace-nowrap text-xs font-medium text-muted-foreground">
        {detail || "\u00a0"}
      </span>
    </div>
  );
}
