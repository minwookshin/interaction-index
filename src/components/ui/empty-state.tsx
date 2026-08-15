import { Package } from "@phosphor-icons/react";
import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export type EmptyStateProps = Omit<ComponentPropsWithRef<"div">, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  size?: "compact" | "default";
};

export function EmptyState({
  title,
  description,
  icon = <Package />,
  primaryAction,
  secondaryAction,
  size = "default",
  className,
  ...props
}: EmptyStateProps) {
  const generatedId = useId();
  const titleId = props["aria-labelledby"] ?? `${generatedId}-title`;
  const descriptionId = description ? `${generatedId}-description` : undefined;

  return (
    <div className={cn("teum-empty-state", className)} data-size={size} aria-labelledby={titleId} aria-describedby={descriptionId} {...props}>
      <span className="teum-empty-state__icon" aria-hidden="true">{icon}</span>
      <div className="teum-empty-state__copy">
        <strong id={titleId}>{title}</strong>
        {description && <p id={descriptionId}>{description}</p>}
      </div>
      {(primaryAction || secondaryAction) && <div className="teum-empty-state__actions">{primaryAction}{secondaryAction}</div>}
    </div>
  );
}
