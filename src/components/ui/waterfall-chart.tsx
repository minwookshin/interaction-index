import { useId, useMemo, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { createAnalyticsTicks, formatAnalyticsValue } from "../../lib/analytics";
import { cn } from "../../lib/cn";
import { AnalyticsFrame, AnalyticsInspection, analyticsClassNames, getLinearAnalyticsKeyIndex, useAnalyticsActiveIndex } from "./analytics-frame";

export type WaterfallDatum = {
  id: string;
  label: string;
  value: number;
  kind?: "change" | "subtotal" | "total";
};

export type WaterfallChartProps = {
  title: string;
  description?: string;
  data: readonly WaterfallDatum[];
  className?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
  activeIndex?: number | null;
  defaultActiveIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  onDatumActivate?: (datum: WaterfallDatum, index: number) => void;
  loading?: boolean;
  empty?: ReactNode;
  error?: ReactNode;
  showDataByDefault?: boolean;
};

type ResolvedWaterfallDatum = WaterfallDatum & {
  start: number;
  end: number;
  runningTotal: number;
};

const waterfallBox = { width: 640, height: 240, left: 54, right: 14, top: 16, bottom: 34 } as const;

function resolveWaterfall(data: readonly WaterfallDatum[]): readonly ResolvedWaterfallDatum[] {
  let running = 0;
  return data.map((datum) => {
    const kind = datum.kind ?? "change";
    if (kind === "change") {
      const start = running;
      running += datum.value;
      return { ...datum, kind, start, end: running, runningTotal: running };
    }
    running = datum.value;
    return { ...datum, kind, start: 0, end: datum.value, runningTotal: running };
  });
}

export function WaterfallChart({
  title,
  description,
  data,
  className,
  height = 240,
  valueFormatter = formatAnalyticsValue,
  activeIndex,
  defaultActiveIndex = null,
  onActiveIndexChange,
  onDatumActivate,
  loading = false,
  empty = "No changes for this range.",
  error,
  showDataByDefault = false,
}: WaterfallChartProps) {
  const id = useId();
  const resolved = useMemo(() => resolveWaterfall(data), [data]);
  const { activeIndex: active, setActiveIndex, scheduleActiveIndex, clearActiveIndex } = useAnalyticsActiveIndex({
    length: resolved.length,
    value: activeIndex,
    defaultValue: defaultActiveIndex,
    onChange: onActiveIndexChange,
  });
  const activeDatum = active === null ? null : resolved[active];
  const values = resolved.flatMap((datum) => [datum.start, datum.end, 0]);
  const minimum = Math.min(...values, 0);
  const maximum = Math.max(...values, 1);
  const padding = Math.max(1, (maximum - minimum) * .08);
  const domain: readonly [number, number] = [minimum - padding, maximum + padding];
  const ticks = createAnalyticsTicks(domain, 5);
  const plotWidth = waterfallBox.width - waterfallBox.left - waterfallBox.right;
  const plotHeight = waterfallBox.height - waterfallBox.top - waterfallBox.bottom;
  const bandWidth = plotWidth / Math.max(1, resolved.length);
  const yScale = (value: number) => waterfallBox.top + (1 - (value - domain[0]) / Math.max(Number.EPSILON, domain[1] - domain[0])) * plotHeight;
  const instructionsId = `${id}-instructions`;

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!resolved.length) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const left = rect.width * waterfallBox.left / waterfallBox.width;
    const right = rect.width * waterfallBox.right / waterfallBox.width;
    const usable = Math.max(1, rect.width - left - right);
    const ratio = Math.min(.999999, Math.max(0, (event.clientX - rect.left - left) / usable));
    scheduleActiveIndex(Math.floor(ratio * resolved.length));
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && activeDatum && active !== null && onDatumActivate) {
      event.preventDefault();
      onDatumActivate(activeDatum, active);
      return;
    }
    const next = getLinearAnalyticsKeyIndex(event.key, active, resolved.length);
    if (next === undefined) return;
    event.preventDefault();
    setActiveIndex(next);
  };

  const plot = (
    <div
      className={cn(analyticsClassNames.interactivePlot, "whatiuse-waterfall-chart__plot")}
      role="group"
      aria-roledescription="interactive waterfall chart"
      aria-label={`${title}. ${resolved.length} steps.`}
      aria-describedby={instructionsId}
      tabIndex={resolved.length && !loading && !error ? 0 : -1}
      onPointerMove={handlePointerMove}
      onPointerLeave={clearActiveIndex}
      onKeyDown={handleKeyDown}
      onClick={() => { if (activeDatum && active !== null) onDatumActivate?.(activeDatum, active); }}
    >
      <p id={instructionsId} className="whatiuse-sr-only">Use Left and Right Arrow keys to inspect steps. Use Home and End to jump. Press Escape to clear.{onDatumActivate ? " Press Enter to open the active step." : ""}</p>
      <svg viewBox={`0 0 ${waterfallBox.width} ${waterfallBox.height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <g className="whatiuse-waterfall-chart__grid">
          {ticks.map((tick) => {
            const y = yScale(tick);
            return <g key={tick}><line x1={waterfallBox.left} x2={waterfallBox.width - waterfallBox.right} y1={y} y2={y} /><text x={waterfallBox.left - 9} y={y}>{valueFormatter(tick)}</text></g>;
          })}
        </g>
        <g className="whatiuse-waterfall-chart__connectors">
          {resolved.slice(0, -1).map((datum, index) => {
            const next = resolved[index + 1];
            const y = yScale(datum.runningTotal);
            return <line key={`${datum.id}-${next.id}`} x1={waterfallBox.left + (index + .78) * bandWidth} x2={waterfallBox.left + (index + 1.22) * bandWidth} y1={y} y2={y} />;
          })}
        </g>
        <g className="whatiuse-waterfall-chart__bars">
          {resolved.map((datum, index) => {
            const startY = yScale(datum.start);
            const endY = yScale(datum.end);
            const y = Math.min(startY, endY);
            const barHeight = Math.max(2, Math.abs(startY - endY));
            return <rect key={datum.id} data-kind={datum.kind} data-direction={datum.end >= datum.start ? "up" : "down"} data-active={active === index || undefined} x={waterfallBox.left + (index + .22) * bandWidth} y={y} width={Math.max(3, bandWidth * .56)} height={barHeight} rx={2.5} />;
          })}
        </g>
        <g className="whatiuse-waterfall-chart__x-axis">
          {resolved.map((datum, index) => <text key={datum.id} x={waterfallBox.left + (index + .5) * bandWidth} y={waterfallBox.height - 10} textAnchor="middle">{datum.label}</text>)}
        </g>
      </svg>
    </div>
  );

  const table = (
    <table>
      <caption>{title} data</caption>
      <thead><tr><th scope="col">Step</th><th scope="col">Type</th><th scope="col">Value</th><th scope="col">Running total</th></tr></thead>
      <tbody>{resolved.map((datum) => <tr key={datum.id}><th scope="row">{datum.label}</th><td>{datum.kind}</td><td>{valueFormatter(datum.value)}</td><td>{valueFormatter(datum.runningTotal)}</td></tr>)}</tbody>
    </table>
  );
  const last = resolved.at(-1);
  const summary = last ? `${title} ends at ${valueFormatter(last.runningTotal)} after ${resolved.length} steps.` : `${title} has no data.`;
  const inspectedDatum = activeDatum ?? last ?? null;
  const inspection = inspectedDatum ? <AnalyticsInspection active={activeDatum !== null} label={activeDatum?.label ?? "Final"} items={[{ id: "value", label: inspectedDatum.kind === "change" ? "Change" : inspectedDatum.kind === "subtotal" ? "Subtotal" : "Total", value: valueFormatter(inspectedDatum.value) }, ...(inspectedDatum.kind === "change" ? [{ id: "running", label: "Running", value: valueFormatter(inspectedDatum.runningTotal) }] : [])]} /> : undefined;

  return <AnalyticsFrame className={cn("whatiuse-waterfall-chart", className)} title={title} description={description} height={height} summary={summary} plotLabel={`${title} waterfall chart`} plot={plot} table={table} loading={loading} empty={!resolved.length ? empty : undefined} error={error} activeDescription={activeDatum ? `${activeDatum.label}. ${activeDatum.kind}. ${valueFormatter(activeDatum.value)}. Running total ${valueFormatter(activeDatum.runningTotal)}.` : ""} inspection={inspection} showDataByDefault={showDataByDefault} />;
}
