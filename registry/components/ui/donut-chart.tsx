"use client";

import "../../styles/teum-base.css";
import "../../styles/components/donut-chart.css";
import {
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { formatAnalyticsValue, type AnalyticsSeriesTone } from "../../lib/analytics";
import { cn } from "../../lib/cn";

export type DonutChartDatum = {
  id: string;
  label: string;
  value: number;
  tone?: AnalyticsSeriesTone;
};

export type DonutChartProps = {
  title: string;
  description?: string;
  data: readonly DonutChartDatum[];
  className?: string;
  valueFormatter?: (value: number, datum: DonutChartDatum) => string;
  centerLabel?: string;
  centerValue?: ReactNode;
  activeId?: string | null;
  defaultActiveId?: string | null;
  onActiveIdChange?: (id: string | null) => void;
  onDatumActivate?: (datum: DonutChartDatum) => void;
  loading?: boolean;
  empty?: ReactNode;
  error?: ReactNode;
  showDataByDefault?: boolean;
};

function useControllableId(value: string | null | undefined, defaultValue: string | null, onChange?: (id: string | null) => void) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value === undefined ? internal : value;
  const set = (next: string | null) => {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

export function DonutChart({
  title,
  description,
  data,
  className,
  valueFormatter = (value) => formatAnalyticsValue(value),
  centerLabel = "Total",
  centerValue,
  activeId,
  defaultActiveId = null,
  onActiveIdChange,
  onDatumActivate,
  loading = false,
  empty = "No data for this range.",
  error,
  showDataByDefault = false,
}: DonutChartProps) {
  const id = useId();
  const [currentId, setCurrentId] = useControllableId(activeId, defaultActiveId, onActiveIdChange);
  const [showData, setShowData] = useState(showDataByDefault);
  const validData = useMemo(() => data.filter((datum) => Number.isFinite(datum.value) && datum.value > 0), [data]);
  const total = validData.reduce((sum, datum) => sum + datum.value, 0);
  const activeIndex = validData.findIndex((datum) => datum.id === currentId);
  const activeDatum = activeIndex >= 0 ? validData[activeIndex] : null;
  const radius = 74;
  const circumference = 2 * Math.PI * radius;
  const gap = validData.length > 1 ? 3.25 : 0;
  const tableId = `${id}-table`;
  const summaryId = `${id}-summary`;
  const instructionsId = `${id}-instructions`;

  const moveTo = (index: number | null) => {
    if (index === null || !validData.length) {
      setCurrentId(null);
      return;
    }
    const resolved = Math.min(validData.length - 1, Math.max(0, index));
    setCurrentId(validData[resolved].id);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!validData.length) return;
    const startingIndex = activeIndex >= 0 ? activeIndex : 0;
    let next: number | null | undefined;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = Math.max(0, startingIndex - 1);
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next = Math.min(validData.length - 1, startingIndex + 1);
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = validData.length - 1;
    if (event.key === "Escape") next = null;
    if (event.key === "Enter" && activeDatum && onDatumActivate) {
      event.preventDefault();
      onDatumActivate(activeDatum);
      return;
    }
    if (next !== undefined) {
      event.preventDefault();
      moveTo(next);
    }
  };

  let offset = 0;
  return (
    <figure className={cn("teum-donut-chart", className)} aria-labelledby={`${id}-title`} aria-describedby={summaryId}>
      <figcaption className="teum-donut-chart__header">
        <div><h3 id={`${id}-title`}>{title}</h3>{description && <p>{description}</p>}</div>
        <button type="button" className="teum-donut-chart__data-toggle" aria-expanded={showData} aria-controls={tableId} onClick={() => setShowData((current) => !current)}>{showData ? "Hide data" : "View data"}</button>
      </figcaption>
      <p id={summaryId} className="teum-sr-only">{validData.map((datum) => `${datum.label} ${valueFormatter(datum.value, datum)}`).join(", ") || "No values."}</p>
      <p id={instructionsId} className="teum-sr-only">Use Arrow keys to inspect segments. Use Home and End to jump. Press Escape to clear.{onDatumActivate ? " Press Enter to open the active segment." : ""}</p>
      <div className="teum-donut-chart__content">
        <div
          className="teum-donut-chart__plot"
          role="group"
          aria-roledescription="interactive donut chart"
          aria-label={`${title}. ${validData.length} segments.`}
          aria-describedby={instructionsId}
          tabIndex={validData.length && !loading && !error ? 0 : -1}
          onKeyDown={handleKeyDown}
          onPointerLeave={() => moveTo(null)}
        >
          {loading ? <div className="teum-donut-chart__state" role="status"><span aria-hidden="true" />Loading chart</div> : error ? <div className="teum-donut-chart__state teum-donut-chart__state--error" role="alert">{error}</div> : !validData.length ? <div className="teum-donut-chart__state">{empty}</div> : <>
            <svg viewBox="0 0 220 220" aria-hidden="true" focusable="false">
              <circle className="teum-donut-chart__track" cx="110" cy="110" r={radius} />
              {validData.map((datum, index) => {
                const segment = datum.value / total * circumference;
                const dash = Math.max(0, segment - gap);
                const dashOffset = -offset;
                offset += segment;
                return <circle
                  key={datum.id}
                  className="teum-donut-chart__segment"
                  data-tone={datum.tone ?? (["primary", "secondary", "tertiary"] as const)[index % 3]}
                  data-active={activeDatum ? datum.id === activeDatum.id : undefined}
                  data-muted={activeDatum && datum.id !== activeDatum.id ? true : undefined}
                  cx="110"
                  cy="110"
                  r={radius}
                  pathLength={circumference}
                  strokeDasharray={`${dash} ${Math.max(0, circumference - dash)}`}
                  strokeDashoffset={dashOffset}
                  onPointerEnter={() => setCurrentId(datum.id)}
                  onClick={() => onDatumActivate?.(datum)}
                />;
              })}
            </svg>
            <div className="teum-donut-chart__center">
              <strong>{activeDatum ? valueFormatter(activeDatum.value, activeDatum) : centerValue ?? valueFormatter(total, { id: "total", label: centerLabel, value: total })}</strong>
              <span>{activeDatum?.label ?? centerLabel}</span>
            </div>
          </>}
        </div>
        <div className="teum-donut-chart__legend" aria-label={`${title} segments`}>
          {validData.map((datum, index) => {
            const selected = datum.id === activeDatum?.id;
            const tone = datum.tone ?? (["primary", "secondary", "tertiary"] as const)[index % 3];
            return <button key={datum.id} type="button" data-tone={tone} aria-pressed={selected} onPointerEnter={() => setCurrentId(datum.id)} onFocus={() => setCurrentId(datum.id)} onClick={() => onDatumActivate?.(datum)}><i aria-hidden="true" /><span>{datum.label}</span><strong>{valueFormatter(datum.value, datum)}</strong><small>{total ? `${(datum.value / total * 100).toFixed(1)}%` : "0%"}</small></button>;
          })}
        </div>
      </div>
      <span className="teum-sr-only" aria-live="polite" aria-atomic="true">{activeDatum ? `${activeDatum.label}. ${valueFormatter(activeDatum.value, activeDatum)}. ${(activeDatum.value / total * 100).toFixed(1)} percent.` : ""}</span>
      <div id={tableId} className={cn("teum-chart__table", !showData && "teum-chart__table--visually-hidden")}>
        <table><caption>{title} data</caption><thead><tr><th scope="col">Segment</th><th scope="col">Value</th><th scope="col">Share</th></tr></thead><tbody>{validData.map((datum) => <tr key={datum.id}><th scope="row">{datum.label}</th><td>{valueFormatter(datum.value, datum)}</td><td>{total ? `${(datum.value / total * 100).toFixed(1)}%` : "0%"}</td></tr>)}</tbody></table>
      </div>
    </figure>
  );
}
