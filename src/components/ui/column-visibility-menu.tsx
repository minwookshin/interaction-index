import { cn } from "../../lib/cn";
import { ColumnManager, type ColumnManagerProps } from "./data-toolbar";

export type ColumnVisibilityMenuProps = ColumnManagerProps & {
  className?: string;
};

export function ColumnVisibilityMenu({ className, ...props }: ColumnVisibilityMenuProps) {
  return (
    <span className={cn("whatiuse-column-visibility-menu", className)}>
      <ColumnManager {...props} />
    </span>
  );
}
