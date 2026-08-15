import { X } from "@phosphor-icons/react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type BadgeProps = ComponentPropsWithRef<"span"> & {
  variant?: "neutral" | "strong" | "outline" | "success" | "warning" | "danger";
  leadingIcon?: ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  removeLabel?: string;
};

export function Badge({
  className,
  variant = "neutral",
  leadingIcon,
  removable,
  onRemove,
  removeLabel = "Remove",
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn("teum-badge", `teum-badge--${variant}`, className)} {...props}>
      {leadingIcon && <span className="teum-badge__icon" aria-hidden="true">{leadingIcon}</span>}
      <span className="teum-badge__label">{children}</span>
      {removable && (
        <button type="button" className="teum-badge__remove" aria-label={removeLabel} onClick={onRemove}>
          <X aria-hidden="true" />
        </button>
      )}
    </span>
  );
}
