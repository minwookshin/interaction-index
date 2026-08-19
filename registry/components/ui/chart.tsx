"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/chart.css";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  clampAnalyticsIndex,
  createAnalyticsAreaPath,
  createAnalyticsPath,
  createAnalyticsTicks,
  describeAnalyticsDatum,
  formatAnalyticsValue,
  getAnalyticsBandPosition,
  getAnalyticsDomain,
  getAnalyticsPointPosition,
  getStackedAnalyticsDomain,
  summarizeAnalyticsSeries,
  type AnalyticsDatum,
  type AnalyticsSeries,
} from "../../lib/analytics";
import { cn } from "../../lib/cn";
import { AnalyticsInspection } from "./analytics-frame";

export type ChartAnnotation = {
  id: string;
  index: number;
  label: string;
  tone?: "neutral" | "danger";
};

export type ChartType = "line" | "area" | "bar" | "stacked-bar";

export type ChartProps = {
  title: string;
  description?: string;
  data: readonly AnalyticsDatum[];
  series: readonly AnalyticsSeries[];
  className?: string;
  height?: number;
  includeZero?: boolean;
  domain?: readonly [number, number];
  type?: ChartType;
  /** @deprecated Use type="area". */
  area?: boolean;
  annotations?: readonly ChartAnnotation[];
  valueFormatter?: (value: number, series: AnalyticsSeries) => string;
  activeIndex?: number | null;
  defaultActiveIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  visibleSeries?: readonly string[];
  defaultVisibleSeries?: readonly string[];
  onVisibleSeriesChange?: (ids: readonly string[]) => void;
  onDatumActivate?: (datum: AnalyticsDatum, index: number) => void;
  loading?: boolean;
  empty?: ReactNode;
  error?: ReactNode;
  showLegend?: boolean;
  showDataByDefault?: boolean;
  showGrid?: boolean;
};

const chartBox = { width: 640, height: 264, left: 58, right: 16, top: 18, bottom: 34 } as const;

function uniqueTickIndexes(length: number) {
  if (length <= 1) return [0];
  return [...new Set([0, Math.round((length - 1) * 0.25), Math.round((length - 1) * 0.5), Math.round((length - 1) * 0.75), length - 1])];
}

function useControllableValue<T>({ value, defaultValue, onChange }: { value: T | undefined; defaultValue: T; onChange?: (next: T) => void }) {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;
  const set = (next: T) => {
    if (!controlled) setInternal(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

export function Chart({
  title,
  description,
  data,
  series,
  className,
  height = 264,
  includeZero = false,
  domain,
  type,
  area = false,
  annotations = [],
  valueFormatter = (value) => formatAnalyticsValue(value),
  activeIndex,
  defaultActiveIndex = null,
  onActiveIndexChange,
  visibleSeries,
  defaultVisibleSeries,
  onVisibleSeriesChange,
  onDatumActivate,
  loading = false,
  empty = "No data for this range.",
  error,
  showLegend = true,
  showDataByDefault = false,
  showGrid = true,
}: ChartProps) {
  const id = useId();
  const [currentIndex, setCurrentIndex] = useControllableValue<number | null>({
    value: activeIndex,
    defaultValue: clampAnalyticsIndex(defaultActiveIndex, data.length),
    onChange: onActiveIndexChange,
  });
  const initialSeries = defaultVisibleSeries ?? series.map((item) => item.id);
  const [currentVisibleSeries, setCurrentVisibleSeries] = useControllableValue<readonly string[]>({
    value: visibleSeries,
    defaultValue: initialSeries,
    onChange: onVisibleSeriesChange,
  });
  const [showData, setShowData] = useState(showDataByDefault);
  const seriesIds = useMemo(() => series.map((item) => item.id), [series]);
  const seriesIdSet = useMemo(() => new Set(seriesIds), [seriesIds]);
  const resolvedVisibleSeries = useMemo(() => {
    if (visibleSeries !== undefined) return currentVisibleSeries;
    const retained = currentVisibleSeries.filter((seriesId) => seriesIdSet.has(seriesId));
    return retained.length > 0 ? retained : seriesIds;
  }, [currentVisibleSeries, seriesIdSet, seriesIds, visibleSeries]);
  const resolvedVisibleSeriesSet = useMemo(() => new Set(resolvedVisibleSeries), [resolvedVisibleSeries]);
  const visible = useMemo(() => series.filter((item) => resolvedVisibleSeriesSet.has(item.id)), [resolvedVisibleSeriesSet, series]);
  const chartType = type ?? (area ? "area" : "line");
  const usesBands = chartType === "bar" || chartType === "stacked-bar";
  const resolvedDomain = useMemo(
    () => chartType === "stacked-bar"
      ? getStackedAnalyticsDomain(data, visible.map((item) => item.id), { includeZero: true, domain })
      : getAnalyticsDomain(data, visible.map((item) => item.id), { includeZero: usesBands || includeZero, domain }),
    [chartType, data, domain, includeZero, usesBands, visible],
  );
  const plotBox = chartBox;
  const ticks = createAnalyticsTicks(resolvedDomain, 5);
  const active = clampAnalyticsIndex(currentIndex, data.length);
  const activeDatum = active === null ? null : data[active];
  const inspectedDatum = activeDatum ?? data.at(-1) ?? null;
  const instructionsId = `${id}-instructions`;
  const summaryId = `${id}-summary`;
  const tableId = `${id}-table`;
  const chartStyle = { "--whatiuse-chart-height": `${height}px` } as CSSProperties;
  const xTicks = uniqueTickIndexes(data.length);
  const pointerFrame = useRef<number | null>(null);
  const pendingPointerIndex = useRef<number | null | undefined>(undefined);
  const lastCommittedIndex = useRef(active);

  useEffect(() => {
    lastCommittedIndex.current = active;
  }, [active]);

  useEffect(() => () => {
    if (pointerFrame.current !== null) window.cancelAnimationFrame(pointerFrame.current);
  }, []);

  const moveTo = (next: number | null) => {
    const clamped = clampAnalyticsIndex(next, data.length);
    if (lastCommittedIndex.current === clamped) return;
    lastCommittedIndex.current = clamped;
    setCurrentIndex(clamped);
  };
  const schedulePointerMove = (next: number | null) => {
    const clamped = clampAnalyticsIndex(next, data.length);
    if (pendingPointerIndex.current === clamped) return;
    pendingPointerIndex.current = clamped;
    if (pointerFrame.current !== null) return;
    pointerFrame.current = window.requestAnimationFrame(() => {
      pointerFrame.current = null;
      const pending = pendingPointerIndex.current;
      pendingPointerIndex.current = undefined;
      if (pending !== undefined) moveTo(pending);
    });
  };
  const clearPointerMove = () => {
    if (pointerFrame.current !== null) window.cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = null;
    pendingPointerIndex.current = undefined;
    moveTo(null);
  };
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!data.length) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const left = rect.width * plotBox.left / plotBox.width;
    const right = rect.width * plotBox.right / plotBox.width;
    const plotWidth = Math.max(1, rect.width - left - right);
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left - left) / plotWidth));
    schedulePointerMove(usesBands ? Math.min(data.length - 1, Math.floor(ratio * data.length)) : Math.round(ratio * (data.length - 1)));
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!data.length) return;
    const startingIndex = active ?? data.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = startingIndex - 1;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next = startingIndex + 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = data.length - 1;
    if (event.key === "Escape") next = null;
    if (event.key === "Enter" && activeDatum && active !== null && onDatumActivate) {
      event.preventDefault();
      onDatumActivate(activeDatum, active);
      return;
    }
    if (next !== null || event.key === "Escape") {
      event.preventDefault();
      moveTo(next);
    }
  };
  const toggleSeries = (seriesId: string) => {
    if (resolvedVisibleSeries.includes(seriesId)) {
      if (resolvedVisibleSeries.length === 1) return;
      setCurrentVisibleSeries(resolvedVisibleSeries.filter((id) => id !== seriesId));
      return;
    }
    setCurrentVisibleSeries(series.filter((item) => resolvedVisibleSeries.includes(item.id) || item.id === seriesId).map((item) => item.id));
  };

  return (
    <figure className={cn("whatiuse-chart", className)} data-chart-type={chartType} style={chartStyle} aria-labelledby={`${id}-title`} aria-describedby={summaryId}>
      <figcaption className="whatiuse-chart__header">
        <div><h3 id={`${id}-title`}>{title}</h3>{description && <p>{description}</p>}</div>
        <button type="button" className="whatiuse-chart__data-toggle" aria-pressed={showData} aria-controls={tableId} onClick={() => setShowData((current) => !current)}>{showData ? "View chart" : "View data"}</button>
      </figcaption>
      {showLegend && series.length > 0 && <div className="whatiuse-chart__legend" aria-label={`${title} series`}>
        {series.map((item) => {
          const selected = resolvedVisibleSeries.includes(item.id);
          return <button type="button" key={item.id} data-tone={item.tone ?? "primary"} data-line-style={item.lineStyle ?? "solid"} aria-pressed={selected} aria-disabled={selected && resolvedVisibleSeries.length === 1 || undefined} onClick={() => toggleSeries(item.id)}><span aria-hidden="true" />{item.label}</button>;
        })}
      </div>}
      <p id={summaryId} className="whatiuse-sr-only">{visible.map((item) => summarizeAnalyticsSeries(data, item, valueFormatter)).join(" ")}</p>
      <p id={instructionsId} className="whatiuse-sr-only">Use Left and Right Arrow keys to inspect values. Use Home and End to jump. Press Escape to clear.{onDatumActivate ? " Press Enter to open the active value." : ""}</p>
      <div className="whatiuse-chart__stage" data-view={showData ? "table" : "chart"}>
      <div
        className="whatiuse-chart__plot"
        hidden={showData}
        role="group"
        aria-roledescription="interactive chart"
        aria-label={`${title}. ${data.length} data points.`}
        aria-describedby={instructionsId}
        tabIndex={data.length && !loading && !error ? 0 : -1}
        onPointerMove={handlePointerMove}
        onPointerLeave={clearPointerMove}
        onKeyDown={handleKeyDown}
        onClick={() => { if (activeDatum && active !== null) onDatumActivate?.(activeDatum, active); }}
      >
        {loading ? <div className="whatiuse-chart__loading" role="status"><span aria-hidden="true" />Loading chart</div> : error ? <div className="whatiuse-chart__error" role="alert">{error}</div> : !data.length || !visible.length ? <div className="whatiuse-chart__empty">{empty}</div> : <>
          <svg viewBox={`0 0 ${plotBox.width} ${plotBox.height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
            {showGrid && <g className="whatiuse-chart__grid">
              {ticks.map((tick) => {
                const ratio = (tick - resolvedDomain[0]) / Math.max(Number.EPSILON, resolvedDomain[1] - resolvedDomain[0]);
                const y = plotBox.top + (1 - ratio) * (plotBox.height - plotBox.top - plotBox.bottom);
                return <g key={tick}><line x1={plotBox.left} x2={plotBox.width - plotBox.right} y1={y} y2={y} /><text x={plotBox.left - 10} y={y}>{valueFormatter(tick, visible[0])}</text></g>;
              })}
            </g>}
            <g className="whatiuse-chart__x-axis">
              {xTicks.map((index) => {
                const point = usesBands ? null : getAnalyticsPointPosition(data, index, visible[0].id, resolvedDomain, plotBox);
                const x = usesBands
                  ? getAnalyticsBandPosition(data.length, index, plotBox).center
                  : point?.x ?? plotBox.left + (data.length <= 1 ? 0.5 : index / (data.length - 1)) * (plotBox.width - plotBox.left - plotBox.right);
                return <text key={data[index]?.id ?? index} x={x} y={plotBox.height - 8} textAnchor={usesBands ? "middle" : index === 0 ? "start" : index === data.length - 1 ? "end" : "middle"}>{data[index]?.label}</text>;
              })}
            </g>
            {chartType === "area" && visible[0] && <path className="whatiuse-chart__area" data-tone={visible[0].tone ?? "primary"} d={createAnalyticsAreaPath(data, visible[0].id, resolvedDomain, plotBox)} />}
            <g className="whatiuse-chart__annotations">
              {annotations.map((annotation) => {
                const point = getAnalyticsPointPosition(data, Math.min(data.length - 1, Math.max(0, annotation.index)), visible[0].id, resolvedDomain, plotBox);
                if (!point) return null;
                return <g key={annotation.id} data-tone={annotation.tone ?? "neutral"}><line x1={point.x} x2={point.x} y1={plotBox.top} y2={plotBox.height - plotBox.bottom} /><text x={point.x + 5} y={plotBox.top + 9}>{annotation.label}</text></g>;
              })}
            </g>
            {usesBands ? <g className="whatiuse-chart__bars">
              {data.flatMap((datum, datumIndex) => {
                const band = getAnalyticsBandPosition(data.length, datumIndex, plotBox);
                const groupWidth = Math.min(band.width * .72, 48);
                let positive = 0;
                let negative = 0;
                return visible.flatMap((item, seriesIndex) => {
                  const value = datum.values[item.id];
                  if (typeof value !== "number" || !Number.isFinite(value)) return [];
                  let startValue = 0;
                  let endValue = value;
                  let x = band.center - groupWidth / 2;
                  let width = groupWidth;
                  if (chartType === "stacked-bar") {
                    startValue = value >= 0 ? positive : negative;
                    endValue = startValue + value;
                    if (value >= 0) positive = endValue;
                    else negative = endValue;
                  } else {
                    width = Math.max(2, groupWidth / Math.max(1, visible.length) - 2);
                    x = band.center - groupWidth / 2 + seriesIndex * (groupWidth / Math.max(1, visible.length)) + 1;
                  }
                  const plotHeight = plotBox.height - plotBox.top - plotBox.bottom;
                  const scaleY = (next: number) => plotBox.top + (1 - (next - resolvedDomain[0]) / Math.max(Number.EPSILON, resolvedDomain[1] - resolvedDomain[0])) * plotHeight;
                  const y1 = scaleY(startValue);
                  const y2 = scaleY(endValue);
                  return <rect key={`${datum.id}-${item.id}`} data-tone={item.tone ?? "primary"} x={x} y={Math.min(y1, y2)} width={width} height={Math.max(1, Math.abs(y2 - y1))} rx={Math.min(4, width / 2)} />;
                });
              })}
            </g> : <g className="whatiuse-chart__series">
              {visible.map((item) => <path key={item.id} data-tone={item.tone ?? "primary"} data-line-style={item.lineStyle ?? "solid"} d={createAnalyticsPath(data, item.id, resolvedDomain, plotBox)} pathLength={1} />)}
            </g>}
            {activeDatum && active !== null && <g className="whatiuse-chart__active">
              {(() => {
                if (usesBands) {
                  const band = getAnalyticsBandPosition(data.length, active, plotBox);
                  return <rect className="whatiuse-chart__active-band" x={band.start + 1} y={plotBox.top} width={Math.max(1, band.width - 2)} height={plotBox.height - plotBox.top - plotBox.bottom} rx={5} />;
                }
                const first = getAnalyticsPointPosition(data, active, visible[0].id, resolvedDomain, plotBox);
                return first ? <line x1={first.x} x2={first.x} y1={plotBox.top} y2={plotBox.height - plotBox.bottom} /> : null;
              })()}
              {!usesBands && visible.map((item) => {
                const point = getAnalyticsPointPosition(data, active, item.id, resolvedDomain, plotBox);
                return point ? <circle key={item.id} data-tone={item.tone ?? "primary"} cx={point.x} cy={point.y} r={3.5} /> : null;
              })}
            </g>}
          </svg>
        </>}
      </div>
      <div id={tableId} className={cn("whatiuse-chart__table", !showData && "whatiuse-chart__table--visually-hidden")}>
        <table>
          <caption>{title} data</caption>
          <thead><tr><th scope="col">Period</th>{visible.map((item) => <th scope="col" key={item.id}>{item.label}</th>)}</tr></thead>
          <tbody>{data.map((datum) => <tr key={datum.id}><th scope="row">{datum.label}</th>{visible.map((item) => <td key={item.id}>{typeof datum.values[item.id] === "number" ? valueFormatter(datum.values[item.id] as number, item) : "No data"}</td>)}</tr>)}</tbody>
        </table>
      </div>
      </div>
      {inspectedDatum && visible.length > 0 && (
        <AnalyticsInspection
          active={activeDatum !== null}
          label={inspectedDatum.label}
          items={visible.map((item) => {
            const value = inspectedDatum.values[item.id];
            return {
              id: item.id,
              label: item.label,
              value: typeof value === "number" ? valueFormatter(value, item) : "—",
              tone: item.tone ?? "primary",
            };
          })}
        />
      )}
      <span className="whatiuse-sr-only" aria-live="polite" aria-atomic="true">{activeDatum ? describeAnalyticsDatum(activeDatum, visible, valueFormatter) : ""}</span>
    </figure>
  );
}
