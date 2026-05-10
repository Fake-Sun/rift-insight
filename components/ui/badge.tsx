import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md border px-2 py-0.5 text-[11px] font-medium leading-none tracking-wide",
  {
    variants: {
      variant: {
        default: "border-slate-700 bg-slate-900 text-slate-100",
        secondary: "border-slate-700 bg-slate-900 text-slate-100",
        success: "border-emerald-300/20 bg-emerald-400/14 text-emerald-100",
        destructive: "border-rose-300/20 bg-rose-400/14 text-rose-100",
        subtle: "border-white/10 bg-white/5 text-slate-200"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
