"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/radar-chart.css";
import { useId, useMemo, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { formatAnalyticsValue, type AnalyticsSeriesTone } from "../../lib/analytics";
import { cn } from "../../lib/cn";
import { AnalyticsFrame, AnalyticsInspection, analyticsClassNames, getLinearAnalyticsKeyIndex, useAnalyticsActiveIndex } from "./analytics-frame";

export type RadarAxis = {
  id: string;
  label: string;
  max: number;
};

export type RadarSeries = {
  id: string;
  label: string;
  values: Readonly<Record<string, number | null>>;
  tone?: AnalyticsSeriesTone;
};

export type RadarChartProps = {
  title: string;
  description?: string;
  axes: readonly RadarAxis[];
  series: readonly RadarSeries[];
  className?: string;
  height?: number;
  valueFormatter?: (value: number, axis: RadarAxis, series: RadarSeries) => string;
  activeAxisIndex?: number | null;
  defaultActiveAxisIndex?: number | null;
  onActiveAxisIndexChange?: (index: number | null) => void;
  onAxisActivate?: (axis: RadarAxis, index: number) => void;
  loading?: boolean;
  empty?: ReactNode;
  error?: ReactNode;
  showDataByDefault?: boolean;
};

const radarBox = { width: 640, height: 260, centerX: 320, centerY: 126, radius: 112 } as const;
const radarTones: readonly AnalyticsSeriesTone[] = ["primary", "secondary", "tertiary"];

function radarPoint(index: number, length: number, ratio = 1) {
  const angle = -Math.PI / 2 + index / Math.max(1, length) * Math.PI * 2;
  return {
    x: radarBox.centerX + Math.cos(angle) * radarBox.radius * ratio,
    y: radarBox.centerY + Math.sin(angle) * radarBox.radius * ratio,
  };
}

function radarPolygon(values: readonly number[]) {
  return values.map((ratio, index) => {
    const point = radarPoint(index, values.length, Math.min(1, Math.max(0, ratio)));
    return `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
  }).join(" ");
}

export function RadarChart({
  title,
  description,
  axes,
  series,
  className,
  height = 260,
  valueFormatter = (value) => formatAnalyticsValue(value),
  activeAxisIndex,
  defaultActiveAxisIndex = null,
  onActiveAxisIndexChange,
  onAxisActivate,
  loading = false,
  empty = "No dimensions for this comparison.",
  error,
  showDataByDefault = false,
}: RadarChartProps) {
  const id = useId();
  const validAxes = useMemo(() => axes.filter((axis) => Number.isFinite(axis.max) && axis.max > 0), [axes]);
  const { activeIndex: active, setActiveIndex, scheduleActiveIndex, clearActiveIndex } = useAnalyticsActiveIndex({
    length: validAxes.length,
    value: activeAxisIndex,
    defaultValue: defaultActiveAxisIndex,
    onChange: onActiveAxisIndexChange,
  });
  const activeAxis = active === null ? null : validAxes[active];
  const instructionsId = `${id}-instructions`;
  const renderedSeries = useMemo(() => series.map((item, seriesIndex) => ({
    ...item,
    tone: item.tone ?? radarTones[seriesIndex % radarTones.length],
    normalized: validAxes.map((axis) => {
      const value = item.values[axis.id];
      return typeof value === "number" && Number.isFinite(value) ? value / axis.max : 0;
    }),
  })), [series, validAxes]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!validAxes.length) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(1, rect.width) * radarBox.width;
    const y = (event.clientY - rect.top) / Math.max(1, rect.height) * radarBox.height;
    let angle = Math.atan2(y - radarBox.centerY, x - radarBox.centerX) + Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2;
    scheduleActiveIndex(Math.round(angle / (Math.PI * 2) * validAxes.length) % validAxes.length);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && activeAxis && active !== null && onAxisActivate) {
      event.preventDefault();
      onAxisActivate(activeAxis, active);
      return;
    }
    const next = getLinearAnalyticsKeyIndex(event.key, active, validAxes.length);
    if (next === undefined) return;
    event.preventDefault();
    setActiveIndex(next);
  };

  const plot = (
    <div
      className={cn(analyticsClassNames.interactivePlot, "whatiuse-radar-chart__plot")}
      role="group"
      aria-roledescription="interactive radar chart"
      aria-label={`${title}. ${validAxes.length} axes and ${renderedSeries.length} series.`}
      aria-describedby={instructionsId}
      tabIndex={validAxes.length && renderedSeries.length && !loading && !error ? 0 : -1}
      onPointerMove={handlePointerMove}
      onPointerLeave={clearActiveIndex}
      onKeyDown={handleKeyDown}
      onClick={() => { if (activeAxis && active !== null) onAxisActivate?.(activeAxis, active); }}
    >
      <p id={instructionsId} className="whatiuse-sr-only">Use Arrow keys to inspect dimensions. Use Home and End to jump. Press Escape to clear.{onAxisActivate ? " Press Enter to open the active dimension." : ""}</p>
      <svg viewBox={`0 0 ${radarBox.width} ${radarBox.height}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
        <g className="whatiuse-radar-chart__grid">
          {[.25, .5, .75, 1].map((ratio) => <polygon key={ratio} points={radarPolygon(validAxes.map(() => ratio))} />)}
          {validAxes.map((axis, index) => {
            const end = radarPoint(index, validAxes.length);
            const label = radarPoint(index, validAxes.length, 1.18);
            return <g key={axis.id} data-active={active === index || undefined}><line x1={radarBox.centerX} y1={radarBox.centerY} x2={end.x} y2={end.y} /><text x={label.x} y={label.y} textAnchor={Math.abs(label.x - radarBox.centerX) < 8 ? "middle" : label.x < radarBox.centerX ? "end" : "start"}>{axis.label}</text></g>;
          })}
        </g>
        <g className="whatiuse-radar-chart__series">
          {renderedSeries.map((item) => <polygon key={item.id} data-tone={item.tone} points={radarPolygon(item.normalized)} />)}
          {renderedSeries.flatMap((item) => item.normalized.map((ratio, index) => {
            const point = radarPoint(index, validAxes.length, ratio);
            return <circle key={`${item.id}-${validAxes[index]?.id}`} data-tone={item.tone} data-active={active === index || undefined} cx={point.x} cy={point.y} r={active === index ? 3.8 : 2.4} />;
          }))}
        </g>
      </svg>
    </div>
  );

  const table = (
    <table>
      <caption>{title} data</caption>
      <thead><tr><th scope="col">Dimension</th><th scope="col">Scale</th>{renderedSeries.map((item) => <th key={item.id} scope="col">{item.label}</th>)}</tr></thead>
      <tbody>{validAxes.map((axis) => <tr key={axis.id}><th scope="row">{axis.label}</th><td>{valueFormatter(axis.max, axis, renderedSeries[0] ?? { id: "scale", label: "Scale", values: {} })}</td>{renderedSeries.map((item) => { const value = item.values[axis.id]; return <td key={item.id}>{typeof value === "number" ? valueFormatter(value, axis, item) : "—"}</td>; })}</tr>)}</tbody>
    </table>
  );
  const summary = validAxes.length && renderedSeries.length ? `${title} compares ${renderedSeries.map((item) => item.label).join(", ")} across ${validAxes.length} dimensions.` : `${title} has no data.`;
  const activeDescription = activeAxis ? `${activeAxis.label}. ${renderedSeries.map((item) => { const value = item.values[activeAxis.id]; return `${item.label} ${typeof value === "number" ? valueFormatter(value, activeAxis, item) : "no value"}`; }).join(". ")}.` : "";
  const inspection = (
    <AnalyticsInspection
      active={activeAxis !== null}
      label={activeAxis?.label ?? `${validAxes.length} dimensions`}
      items={renderedSeries.map((item) => {
        const value = activeAxis ? item.values[activeAxis.id] : undefined;
        return {
          id: item.id,
          label: item.label,
          value: activeAxis ? (typeof value === "number" ? valueFormatter(value, activeAxis, item) : "—") : undefined,
          tone: item.tone,
        };
      })}
    />
  );

  return <AnalyticsFrame className={cn("whatiuse-radar-chart", className)} title={title} description={description} height={height} summary={summary} plotLabel={`${title} radar chart`} plot={plot} table={table} loading={loading} empty={!validAxes.length || !renderedSeries.length ? empty : undefined} error={error} activeDescription={activeDescription} inspection={inspection} showDataByDefault={showDataByDefault} />;
}
