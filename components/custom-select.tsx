"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption<T extends string> = {
  label: string;
  value: T;
};

export function CustomSelect<T extends string>({
  value,
  onChange,
  options,
  className
}: {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn("relative w-full", open && "z-[1100]", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={selectId}
        className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-left text-sm text-slate-50 shadow-sm transition-colors hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-300/50"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="min-w-0 truncate">{selected?.label}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          id={selectId}
          role="listbox"
          className="custom-select-menu absolute left-0 top-[calc(100%+0.375rem)] z-[1101] max-h-[min(24rem,calc(100vh-8rem))] w-full overflow-auto rounded-md border border-white/10 bg-slate-950 p-1 text-slate-50 shadow-xl"
        >
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2 rounded-sm px-2.5 py-2 text-left text-sm transition-colors hover:bg-white/8 focus:bg-white/8 focus:outline-none",
                  active ? "text-white" : "text-slate-300"
                )}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span className="grid h-4 w-4 shrink-0 place-items-center">
                  {active ? <Check className="h-4 w-4 text-sky-200" /> : null}
                </span>
                <span className="min-w-0 truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
