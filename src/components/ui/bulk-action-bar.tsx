import { X } from "@phosphor-icons/react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { IconButton } from "./icon-button";

export type BulkActionBarProps = HTMLAttributes<HTMLDivElement> & {
  count: number;
  noun?: string;
  actions: ReactNode;
  onClear: () => void;
  busy?: boolean;
};

export function BulkActionBar({ count, noun = "row", actions, onClear, busy = false, className, ...props }: BulkActionBarProps) {
  if (count <= 0) return null;
  return (
    <div className={cn("whatiuse-bulk-action-bar", className)} role="region" aria-label="Bulk actions" aria-busy={busy || undefined} {...props}>
      <div className="whatiuse-bulk-action-bar__selection"><strong>{count}</strong><span>{noun}{count === 1 ? "" : "s"} selected</span></div>
      <div className="whatiuse-bulk-action-bar__actions">{actions}</div>
      <IconButton size="small" variant="ghost" aria-label="Clear selection" onClick={onClear}><X aria-hidden="true" /></IconButton>
      <span className="whatiuse-sr-only" aria-live="polite">{count} {noun}{count === 1 ? "" : "s"} selected</span>
    </div>
  );
}
