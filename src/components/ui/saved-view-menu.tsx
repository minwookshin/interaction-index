import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { SavedViews, type SavedViewsProps } from "./data-toolbar";

export type SavedViewMenuProps = SavedViewsProps & {
  className?: string;
};

export function SavedViewMenu({ className, ...props }: SavedViewMenuProps) {
  return (
    <span className={cn("whatiuse-saved-view-menu", className)}>
      <SavedViews {...props} />
    </span>
  );
}

export type SavedViewMenuContainerProps = HTMLAttributes<HTMLSpanElement>;
