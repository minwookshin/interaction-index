import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type AuditLogItem = {
  id: string;
  actor: ReactNode;
  action: ReactNode;
  timestamp: ReactNode;
  metadata?: ReactNode;
  tone?: "neutral" | "danger";
};

export type AuditLogProps = Omit<HTMLAttributes<HTMLOListElement>, "onSelect"> & {
  label: string;
  items: readonly AuditLogItem[];
  activeId?: string;
  onSelect?: (item: AuditLogItem) => void;
};

export function AuditLog({ label, items, activeId, onSelect, className, ...props }: AuditLogProps) {
  return (
    <ol className={cn("whatiuse-audit-log", className)} aria-label={label} {...props}>
      {items.map((item) => {
        const content = (
          <>
            <span className="whatiuse-audit-log__event"><strong>{item.actor}</strong> <span>{item.action}</span></span>
            <time>{item.timestamp}</time>
            {item.metadata && <small>{item.metadata}</small>}
          </>
        );
        return (
          <li key={item.id} data-tone={item.tone ?? "neutral"}>
            {onSelect ? <button type="button" aria-pressed={activeId === item.id} onClick={() => onSelect(item)}>{content}</button> : <div>{content}</div>}
          </li>
        );
      })}
    </ol>
  );
}
