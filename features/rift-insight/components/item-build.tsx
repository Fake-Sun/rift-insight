import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { MatchItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ItemBuild({
  items,
  small = false,
  compact = false,
  className,
}: {
  items: MatchItem[];
  small?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap",
        compact ? "gap-[3px]" : "gap-1",
        className,
      )}
    >
      {items.map((item, index) =>
        item.icon ? (
          <Avatar
            key={`${item.id}-${index}`}
            className={cn(
              "rounded-sm ring-1 ring-white/10",
              small ? "size-5" : compact ? "size-[26px]" : "size-7",
            )}
          >
            <AvatarImage src={item.icon} alt={`Item ${item.id}`} />
            <AvatarFallback className="rounded-md bg-secondary text-[9px]">
              {index + 1}
            </AvatarFallback>
          </Avatar>
        ) : (
          <span
            key={`empty-${index}`}
            className={cn(
              "rounded-sm border border-input bg-black/20",
              small ? "size-5" : compact ? "size-[26px]" : "size-7",
            )}
            aria-hidden="true"
          />
        ),
      )}
    </div>
  );
}
