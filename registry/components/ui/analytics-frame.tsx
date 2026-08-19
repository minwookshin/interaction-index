"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/analytics-frame.css";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { clampAnalyticsIndex } from "../../lib/analytics";
import { cn } from "../../lib/cn";

export const analyticsClassNames = {
  interactivePlot: "whatiuse-analytics-interactive-plot",
} as const;

export type AnalyticsFrameProps = {
  title: string;
  description?: string;
  summary: string;
  plotLabel: string;
  plot: ReactNode;
  table: ReactNode;
  className?: string;
  height?: number;
  loading?: boolean;
  empty?: ReactNode;
  error?: ReactNode;
  activeDescription?: string;
  inspection?: ReactNode;
  showDataByDefault?: boolean;
};

export type AnalyticsInspectionItem = {
  id: string;
  label: ReactNode;
  value?: ReactNode;
  tone?: string;
};

export type AnalyticsInspectionProps = {
  label: ReactNode;
  items?: readonly AnalyticsInspectionItem[];
  active?: boolean;
  className?: string;
};

export function AnalyticsInspection({ label, items = [], active = false, className }: AnalyticsInspectionProps) {
  return (
    <div className={cn("whatiuse-analytics-inspection", className)} data-active={active || undefined} aria-hidden="true">
      <strong>{label}</strong>
      {items.length > 0 && (
        <span className="whatiuse-analytics-inspection__items">
          {items.map((item) => (
            <span key={item.id} className="whatiuse-analytics-inspection__item" data-tone={item.tone}>
              {item.tone && <i />}
              <span>{item.label}</span>
              {item.value !== undefined && <b>{item.value}</b>}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}

export function AnalyticsFrame({
  title,
  description,
  summary,
  plotLabel,
  plot,
  table,
  className,
  height = 240,
  loading = false,
  empty,
  error,
  activeDescription = "",
  inspection,
  showDataByDefault = false,
}: AnalyticsFrameProps) {
  const id = useId();
  const [showData, setShowData] = useState(showDataByDefault);
  const tableId = `${id}-table`;
  const summaryId = `${id}-summary`;
  const style = { "--whatiuse-analytics-height": `${height}px` } as CSSProperties;
  const hasState = loading || Boolean(error) || Boolean(empty);
  return (
    <figure className={cn("whatiuse-analytics-frame", className)} style={style} aria-labelledby={`${id}-title`} aria-describedby={summaryId}>
      <figcaption className="whatiuse-analytics-frame__header">
        <div><h3 id={`${id}-title`}>{title}</h3>{description && <p>{description}</p>}</div>
        <button type="button" className="whatiuse-analytics-frame__data-toggle" aria-pressed={showData} aria-controls={tableId} disabled={hasState} onClick={() => setShowData((current) => !current)}>{showData ? "View chart" : "View data"}</button>
      </figcaption>
      <p id={summaryId} className="whatiuse-sr-only">{summary}</p>
      <div className="whatiuse-analytics-frame__stage" data-view={showData ? "table" : "chart"}>
        {hasState ? (
          <div className="whatiuse-analytics-frame__state" role={error ? "alert" : "status"}>
            {loading && <span aria-hidden="true" />}
            {error ?? empty ?? "Loading chart"}
          </div>
        ) : (
          <>
            <div className="whatiuse-analytics-frame__plot" hidden={showData} aria-label={plotLabel}>{plot}</div>
            <div id={tableId} className={cn("whatiuse-analytics-frame__table", !showData && "whatiuse-chart__table--visually-hidden")}>{table}</div>
          </>
        )}
      </div>
      {inspection && <div className="whatiuse-analytics-frame__inspection">{inspection}</div>}
      <span className="whatiuse-sr-only" aria-live="polite" aria-atomic="true">{activeDescription}</span>
    </figure>
  );
}

export type AnalyticsActiveIndexOptions = {
  length: number;
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (index: number | null) => void;
};

export function useAnalyticsActiveIndex({ length, value, defaultValue = null, onChange }: AnalyticsActiveIndexOptions) {
  const [internal, setInternal] = useState<number | null>(() => clampAnalyticsIndex(defaultValue, length));
  const current = clampAnalyticsIndex(value === undefined ? internal : value, length);
  const lastCommitted = useRef(current);
  const pending = useRef<number | null | undefined>(undefined);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    lastCommitted.current = current;
  }, [current]);

  useEffect(() => () => {
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
  }, []);

  const set = useCallback((next: number | null) => {
    const clamped = clampAnalyticsIndex(next, length);
    if (lastCommitted.current === clamped) return;
    lastCommitted.current = clamped;
    if (value === undefined) setInternal(clamped);
    onChange?.(clamped);
  }, [length, onChange, value]);

  const schedule = useCallback((next: number | null) => {
    const clamped = clampAnalyticsIndex(next, length);
    if (pending.current === clamped) return;
    pending.current = clamped;
    if (frame.current !== null) return;
    frame.current = window.requestAnimationFrame(() => {
      frame.current = null;
      const nextIndex = pending.current;
      pending.current = undefined;
      if (nextIndex !== undefined) set(nextIndex);
    });
  }, [length, set]);

  const clear = useCallback(() => {
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    frame.current = null;
    pending.current = undefined;
    set(null);
  }, [set]);

  return { activeIndex: current, setActiveIndex: set, scheduleActiveIndex: schedule, clearActiveIndex: clear } as const;
}

export function getLinearAnalyticsKeyIndex(key: string, activeIndex: number | null, length: number): number | null | undefined {
  if (length <= 0) return undefined;
  if (key === "ArrowLeft" || key === "ArrowDown") return activeIndex === null ? length - 1 : activeIndex - 1;
  if (key === "ArrowRight" || key === "ArrowUp") return activeIndex === null ? 0 : activeIndex + 1;
  if (key === "Home") return 0;
  if (key === "End") return length - 1;
  if (key === "Escape") return null;
  return undefined;
}
