"use client";

import "../../styles/teum-base.css";
import "../../styles/components/timeline.css";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type TimelineItem = {
  id: string;
  label: string;
  timestamp: ReactNode;
  description?: ReactNode;
  value?: ReactNode;
  tone?: "neutral" | "accent" | "danger";
};

export type TimelineProps = Omit<HTMLAttributes<HTMLOListElement>, "onSelect"> & {
  label: string;
  items: readonly TimelineItem[];
  activeId?: string;
  onSelect?: (item: TimelineItem) => void;
};

export function Timeline({ label, items, activeId, onSelect, className, ...props }: TimelineProps) {
  return (
    <ol className={cn("teum-timeline", className)} aria-label={label} {...props}>
      {items.map((item) => {
        const content = <>
          <span className="teum-timeline__marker" data-tone={item.tone ?? "neutral"} aria-hidden="true" />
          <span className="teum-timeline__content"><span><strong>{item.label}</strong><time>{item.timestamp}</time></span>{item.description && <small>{item.description}</small>}</span>
          {item.value && <b className="teum-timeline__value">{item.value}</b>}
        </>;
        return <li key={item.id}>{onSelect ? <button type="button" aria-pressed={item.id === activeId} onClick={() => onSelect(item)}>{content}</button> : <div>{content}</div>}</li>;
      })}
    </ol>
  );
}
