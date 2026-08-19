import { useId, useMemo, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { createAnalyticsTicks, formatAnalyticsValue } from "../../lib/analytics";
import { cn } from "../../lib/cn";
import { AnalyticsFrame, AnalyticsInspection, analyticsClassNames, getLinearAnalyticsKeyIndex, useAnalyticsActiveIndex } from "./analytics-frame";

export type ScatterPoint = {
  id: string;
  label: string;
  x: number;
  y: number;
  series?: string;
  tone?: "primary" | "secondary" | "tertiary";
};

export type ScatterChartProps = {
  title: string;
  description?: string;
  data: readonly ScatterPoint[];
  xLabel: string;
  yLabel: string;
  className?: string;
  height?: number;
  xDomain?: readonly [number, number];
  yDomain?: readonly [number, number];
  xFormatter?: (value: number) => string;
  yFormatter?: (value: number) => string;
  activeIndex?: number | null;
  defaultActiveIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  onPointActivate?: (point: ScatterPoint, index: number) => void;
  loading?: boolean;
  empty?: ReactNode;
  error?: ReactNode;
  showDataByDefault?: boolean;
};

const scatterBox = { width: 640, height: 240, left: 52, right: 18, top: 16, bottom: 34 } as const;

function resolveDomain(values: readonly number[], supplied?: readonly [number, number]): readonly [number, number] {
  if (supplied) return supplied[0] === supplied[1] ? [supplied[0] - 1, supplied[1] + 1] : supplied;
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  if (!Number.isFinite(minimum) || !Number.isFinite(maximum)) return [0, 1];
  if (minimum === maximum) return [minimum - Math.max(1, Math.abs(minimum) * .1), maximum + Math.max(1, Math.abs(maximum) * .1)];
  const padding = (maximum - minimum) * .08;
  return [minimum - padding, maximum + padding];
}

export function ScatterChart({
  title,
  description,
  data,
  xLabel,
  yLabel,
  className,
  height = 240,
  xDomain,
  yDomain,
  xFormatter = formatAnalyticsValue,
  yFormatter = formatAnalyticsValue,
  activeIndex,
  defaultActiveIndex = null,
  onActiveIndexChange,
  onPointActivate,
  loading = false,
  empty = "No points for this range.",
  error,
  showDataByDefault = false,
}: ScatterChartProps) {
  const id = useId();
  const { activeIndex: active, setActiveIndex, scheduleActiveIndex, clearActiveIndex } = useAnalyticsActiveIndex({ length: data.length, value: activeIndex, defaultValue: defaultActiveIndex, onChange: onActiveIndexChange });
  const resolvedX = useMemo(() => resolveDomain(data.map((point) => point.x), xDomain), [data, xDomain]);
  const resolvedY = useMemo(() => resolveDomain(data.map((point) => point.y), yDomain), [data, yDomain]);
  const plotWidth = scatterBox.width - scatterBox.left - scatterBox.right;
  const plotHeight = scatterBox.height - scatterBox.top - scatterBox.bottom;
  const xScale = (value: number) => scatterBox.left + (value - resolvedX[0]) / Math.max(Number.EPSILON, resolvedX[1] - resolvedX[0]) * plotWidth;
  const yScale = (value: number) => scatterBox.top + (1 - (value - resolvedY[0]) / Math.max(Number.EPSILON, resolvedY[1] - resolvedY[0])) * plotHeight;
  const xTicks = createAnalyticsTicks(resolvedX, 5);
  const yTicks = createAnalyticsTicks(resolvedY, 5);
  const activePoint = active === null ? null : data[active];
  const instructionsId = `${id}-instructions`;

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!data.length) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const targetX = (event.clientX - rect.left) / Math.max(1, rect.width) * scatterBox.width;
    const targetY = (event.clientY - rect.top) / Math.max(1, rect.height) * scatterBox.height;
    let closest = 0;
    let distance = Number.POSITIVE_INFINITY;
    data.forEach((point, index) => {
      const dx = xScale(point.x) - targetX;
      const dy = yScale(point.y) - targetY;
      const nextDistance = dx * dx + dy * dy;
      if (nextDistance < distance) { distance = nextDistance; closest = index; }
    });
    scheduleActiveIndex(closest);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && activePoint && active !== null && onPointActivate) {
      event.preventDefault();
      onPointActivate(activePoint, active);
      return;
    }
    const next = getLinearAnalyticsKeyIndex(event.key, active, data.length);
    if (next === undefined) return;
    event.preventDefault();
    setActiveIndex(next);
  };

  const plot = (
    <div className={cn(analyticsClassNames.interactivePlot, "whatiuse-scatter-chart__plot")} role="group" aria-roledescription="interactive scatter plot" aria-label={`${title}. ${data.length} points.`} aria-describedby={instructionsId} tabIndex={data.length && !loading && !error ? 0 : -1} onPointerMove={handlePointerMove} onPointerLeave={clearActiveIndex} onKeyDown={handleKeyDown} onClick={() => { if (activePoint && active !== null) onPointActivate?.(activePoint, active); }}>
      <p id={instructionsId} className="whatiuse-sr-only">Use Arrow keys to inspect points in data order. Use Home and End to jump. Press Escape to clear.{onPointActivate ? " Press Enter to open the active point." : ""}</p>
      <svg viewBox={`0 0 ${scatterBox.width} ${scatterBox.height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <g className="whatiuse-scatter-chart__grid">
          {yTicks.map((tick) => { const y = yScale(tick); return <g key={`y-${tick}`}><line x1={scatterBox.left} x2={scatterBox.width - scatterBox.right} y1={y} y2={y} /><text x={scatterBox.left - 9} y={y}>{yFormatter(tick)}</text></g>; })}
          {xTicks.map((tick) => { const x = xScale(tick); return <g key={`x-${tick}`}><line x1={x} x2={x} y1={scatterBox.top} y2={scatterBox.height - scatterBox.bottom} /><text x={x} y={scatterBox.height - 12} textAnchor="middle">{xFormatter(tick)}</text></g>; })}
        </g>
        <g className="whatiuse-scatter-chart__points">
          {data.map((point, index) => <circle key={point.id} data-tone={point.tone ?? "primary"} data-active={active === index || undefined} cx={xScale(point.x)} cy={yScale(point.y)} r={active === index ? 6 : 4.5} />)}
        </g>
        <text className="whatiuse-scatter-chart__axis-label" x={scatterBox.left + plotWidth / 2} y={scatterBox.height - 2} textAnchor="middle">{xLabel}</text>
        <text className="whatiuse-scatter-chart__axis-label" x={10} y={scatterBox.top + plotHeight / 2} textAnchor="middle" transform={`rotate(-90 10 ${scatterBox.top + plotHeight / 2})`}>{yLabel}</text>
      </svg>
    </div>
  );
  const table = <table><caption>{title} data</caption><thead><tr><th scope="col">Point</th>{data.some((point) => point.series) && <th scope="col">Series</th>}<th scope="col">{xLabel}</th><th scope="col">{yLabel}</th></tr></thead><tbody>{data.map((point) => <tr key={point.id}><th scope="row">{point.label}</th>{data.some((item) => item.series) && <td>{point.series ?? "—"}</td>}<td>{xFormatter(point.x)}</td><td>{yFormatter(point.y)}</td></tr>)}</tbody></table>;
  const summary = data.length ? `${data.length} points. ${xLabel} ranges from ${xFormatter(Math.min(...data.map((point) => point.x)))} to ${xFormatter(Math.max(...data.map((point) => point.x)))}. ${yLabel} ranges from ${yFormatter(Math.min(...data.map((point) => point.y)))} to ${yFormatter(Math.max(...data.map((point) => point.y)))}.` : `${title} has no data.`;

  const xRange = data.length ? `${xFormatter(Math.min(...data.map((point) => point.x)))}–${xFormatter(Math.max(...data.map((point) => point.x)))}` : "—";
  const yRange = data.length ? `${yFormatter(Math.min(...data.map((point) => point.y)))}–${yFormatter(Math.max(...data.map((point) => point.y)))}` : "—";
  const inspection = <AnalyticsInspection active={activePoint !== null} label={activePoint?.label ?? `${data.length} points`} items={[{ id: "x", label: xLabel, value: activePoint ? xFormatter(activePoint.x) : xRange }, { id: "y", label: yLabel, value: activePoint ? yFormatter(activePoint.y) : yRange }]} />;
  return <AnalyticsFrame className={cn("whatiuse-scatter-chart", className)} title={title} description={description} height={height} summary={summary} plotLabel={`${title} scatter plot`} plot={plot} table={table} loading={loading} empty={!data.length ? empty : undefined} error={error} activeDescription={activePoint ? `${activePoint.label}. ${xLabel} ${xFormatter(activePoint.x)}. ${yLabel} ${yFormatter(activePoint.y)}.` : ""} inspection={inspection} showDataByDefault={showDataByDefault} />;
}
