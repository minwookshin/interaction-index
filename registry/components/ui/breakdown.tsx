"use client";

import "../../styles/teum-base.css";
import "../../styles/components/breakdown.css";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { formatAnalyticsValue } from "../../lib/analytics";
import { cn } from "../../lib/cn";

export type BreakdownItem = {
  id: string;
  label: string;
  value: number;
  detail?: ReactNode;
  tone?: "primary" | "secondary" | "tertiary";
};

export type BreakdownProps = Omit<HTMLAttributes<HTMLOListElement>, "onSelect"> & {
  label: string;
  items: readonly BreakdownItem[];
  formatter?: (value: number, item: BreakdownItem) => string;
  max?: number;
  selectedId?: string;
  onSelect?: (item: BreakdownItem) => void;
};

export function Breakdown({ label, items, formatter = (value) => formatAnalyticsValue(value), max, selectedId, onSelect, className, ...props }: BreakdownProps) {
  const maximum = Math.max(1, max ?? Math.max(0, ...items.map((item) => item.value)));
  return (
    <ol className={cn("teum-breakdown", className)} aria-label={label} {...props}>
      {items.map((item) => {
        const ratio = Math.min(1, Math.max(0, item.value / maximum));
        const content = <>
          <span className="teum-breakdown__label">{item.label}</span>
          <span className="teum-breakdown__bar" aria-hidden="true"><span data-tone={item.tone ?? "primary"} style={{ "--teum-breakdown-progress": ratio } as CSSProperties} /></span>
          <strong>{formatter(item.value, item)}</strong>
          {item.detail && <small>{item.detail}</small>}
        </>;
        return <li key={item.id}>{onSelect ? <button type="button" aria-pressed={item.id === selectedId} onClick={() => onSelect(item)}>{content}</button> : <div>{content}</div>}</li>;
      })}
    </ol>
  );
}
