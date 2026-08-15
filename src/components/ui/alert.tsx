import { Info, WarningCircle, X } from "@phosphor-icons/react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { IconButton } from "./icon-button";

export type AlertProps = Omit<ComponentPropsWithRef<"div">, "title"> & {
  variant?: "neutral" | "critical";
  title: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  live?: "polite" | "assertive";
  dismissLabel?: string;
  onDismiss?: () => void;
};

export function Alert({
  variant = "neutral",
  title,
  icon,
  action,
  live,
  dismissLabel = "Dismiss notification",
  onDismiss,
  className,
  children,
  role,
  ...props
}: AlertProps) {
  const fallbackIcon = variant === "critical" ? <WarningCircle weight="fill" /> : <Info weight="fill" />;

  return (
    <div
      className={cn("teum-alert", className)}
      data-variant={variant}
      role={role ?? (live === "assertive" ? "alert" : live === "polite" ? "status" : undefined)}
      aria-live={live}
      {...props}
    >
      <span className="teum-alert__icon" aria-hidden="true">{icon ?? fallbackIcon}</span>
      <span className="teum-alert__content">
        <strong>{title}</strong>
        {children && <span>{children}</span>}
      </span>
      {action && <span className="teum-alert__action">{action}</span>}
      {onDismiss && <IconButton className="teum-alert__dismiss" variant="ghost" size="small" aria-label={dismissLabel} onClick={onDismiss}><X /></IconButton>}
    </div>
  );
}
