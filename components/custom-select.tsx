"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SelectOption<T extends string> = {
  label: string;
  value: T;
  imageSrc?: string;
  imageAlt?: string;
};

export function CustomSelect<T extends string>({
  value,
  onChange,
  options,
  className,
  label,
}: {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  className?: string;
  label?: string;
}) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as T)}>
      <SelectTrigger className={cn("w-full", className)} aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent sideOffset={4} collisionPadding={12}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <span className="flex items-center gap-2 whitespace-nowrap">
              {option.imageSrc ? (
                <img
                  src={option.imageSrc}
                  alt=""
                  className="h-3 w-[18px] shrink-0 rounded-[2px] object-cover"
                />
              ) : null}
              {option.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
