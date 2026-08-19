import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export type ButtonGroupProps = ComponentPropsWithRef<"div"> & {
  orientation?: "horizontal" | "vertical";
  attached?: boolean;
};

export function ButtonGroup({ className, orientation = "horizontal", attached = false, role = "group", ...props }: ButtonGroupProps) {
  return (
    <div
      className={cn("whatiuse-button-group", className)}
      role={role}
      data-orientation={orientation}
      data-attached={attached || undefined}
      {...props}
    />
  );
}

export type ButtonGroupSeparatorProps = ComponentPropsWithRef<"span"> & {
  orientation?: "horizontal" | "vertical";
};

export function ButtonGroupSeparator({ className, orientation = "vertical", ...props }: ButtonGroupSeparatorProps) {
  return <span className={cn("whatiuse-button-group__separator", className)} role="separator" aria-orientation={orientation} {...props} />;
}
