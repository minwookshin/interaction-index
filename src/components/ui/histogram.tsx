import { useId, useMemo, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { createAnalyticsTicks, formatAnalyticsValue } from "../../lib/analytics";
import { cn } from "../../lib/cn";
import { AnalyticsFrame, AnalyticsInspection, getLinearAnalyticsKeyIndex, useAnalyticsActiveIndex } from "./analytics-frame";

export type HistogramBin = {
  id: string;
  label: string;
  start: number;
  end: number;
  value: number;
};

export type HistogramProps = {
  title: string;
  description?: string;
  data: readonly HistogramBin[];
  className?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
  binFormatter?: (bin: HistogramBin) => string;
  activeIndex?: number | null;
  defaultActiveIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  onBinActivate?: (bin: HistogramBin, index: number) => void;
  loading?: boolean;
  empty?: ReactNode;
  error?: ReactNode;
  showDataByDefault?: boolean;
};

const histogramBox = { width: 640, height: 240, left: 46, right: 12, top: 14, bottom: 30 } as const;

export function Histogram({
  title,
  description,
  data,
  className,
  height = 240,
  valueFormatter = formatAnalyticsValue,
  binFormatter = (bin) => bin.label,
  activeIndex,
  defaultActiveIndex = null,
  onActiveIndexChange,
  onBinActivate,
  loading = false,
  empty = "No values for this range.",
  error,
  showDataByDefault = false,
}: HistogramProps) {
  const id = useId();
  const { activeIndex: active, setActiveIndex, scheduleActiveIndex, clearActiveIndex } = useAnalyticsActiveIndex({
    length: data.length,
    value: activeIndex,
    defaultValue: defaultActiveIndex,
    onChange: onActiveIndexChange,
  });
  const maximum = Math.max(1, ...data.map((bin) => Math.max(0, bin.value)));
  const ticks = createAnalyticsTicks([0, maximum], 4);
  const plotWidth = histogramBox.width - histogramBox.left - histogramBox.right;
  const plotHeight = histogramBox.height - histogramBox.top - histogramBox.bottom;
  const bandWidth = plotWidth / Math.max(1, data.length);
  const labelIndexes = useMemo(() => data.length <= 7 ? data.map((_, index) => index) : [...new Set([0, Math.floor((data.length - 1) / 2), data.length - 1])], [data]);
  const activeBin = active === null ? null : data[active];
  const peak = data.reduce<HistogramBin | null>((current, bin) => !current || bin.value > current.value ? bin : current, null);
  const instructionsId = `${id}-instructions`;

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!data.length) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const left = rect.width * histogramBox.left / histogramBox.width;
    const right = rect.width * histogramBox.right / histogramBox.width;
    const usable = Math.max(1, rect.width - left - right);
    const ratio = Math.min(0.999999, Math.max(0, (event.clientX - rect.left - left) / usable));
    scheduleActiveIndex(Math.floor(ratio * data.length));
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && activeBin && active !== null && onBinActivate) {
      event.preventDefault();
      onBinActivate(activeBin, active);
      return;
    }
    const next = getLinearAnalyticsKeyIndex(event.key, active, data.length);
    if (next === undefined) return;
    event.preventDefault();
    setActiveIndex(next);
  };

  const plot = (
    <div
      className="whatiuse-histogram__plot"
      role="group"
      aria-roledescription="interactive histogram"
      aria-label={`${title}. ${data.length} bins.`}
      aria-describedby={instructionsId}
      tabIndex={data.length && !loading && !error ? 0 : -1}
      onPointerMove={handlePointerMove}
      onPointerLeave={clearActiveIndex}
      onKeyDown={handleKeyDown}
      onClick={() => { if (activeBin && active !== null) onBinActivate?.(activeBin, active); }}
    >
      <p id={instructionsId} className="whatiuse-sr-only">Use Left and Right Arrow keys to inspect bins. Use Home and End to jump. Press Escape to clear.{onBinActivate ? " Press Enter to open the active bin." : ""}</p>
      <svg viewBox={`0 0 ${histogramBox.width} ${histogramBox.height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <g className="whatiuse-histogram__grid">
          {ticks.map((tick) => {
            const y = histogramBox.top + (1 - tick / maximum) * plotHeight;
            return <g key={tick}><line x1={histogramBox.left} x2={histogramBox.width - histogramBox.right} y1={y} y2={y} /><text x={histogramBox.left - 9} y={y}>{valueFormatter(tick)}</text></g>;
          })}
        </g>
        <g className="whatiuse-histogram__bars">
          {data.map((bin, index) => {
            const heightValue = Math.max(1, Math.max(0, bin.value) / maximum * plotHeight);
            const x = histogramBox.left + index * bandWidth + 1;
            return <rect key={bin.id} data-active={active === index || undefined} x={x} y={histogramBox.top + plotHeight - heightValue} width={Math.max(1, bandWidth - 2)} height={heightValue} rx={2.5} />;
          })}
        </g>
        <g className="whatiuse-histogram__x-axis">
          {labelIndexes.map((index) => <text key={data[index]?.id ?? index} x={histogramBox.left + (index + .5) * bandWidth} y={histogramBox.height - 9} textAnchor="middle">{data[index]?.label}</text>)}
        </g>
      </svg>
    </div>
  );

  const table = (
    <table>
      <caption>{title} data</caption>
      <thead><tr><th scope="col">Bin</th><th scope="col">From</th><th scope="col">To</th><th scope="col">Count</th></tr></thead>
      <tbody>{data.map((bin) => <tr key={bin.id}><th scope="row">{binFormatter(bin)}</th><td>{bin.start}</td><td>{bin.end}</td><td>{valueFormatter(bin.value)}</td></tr>)}</tbody>
    </table>
  );

  return (
    <AnalyticsFrame
      className={cn("whatiuse-histogram", className)}
      title={title}
      description={description}
      height={height}
      summary={peak ? `${binFormatter(peak)} is the largest bin at ${valueFormatter(peak.value)}.` : `${title} has no data.`}
      plotLabel={`${title} histogram`}
      plot={plot}
      table={table}
      loading={loading}
      empty={!data.length ? empty : undefined}
      error={error}
      activeDescription={activeBin ? `${binFormatter(activeBin)}. ${valueFormatter(activeBin.value)}.` : ""}
      inspection={(activeBin ?? peak) ? <AnalyticsInspection active={activeBin !== null} label={activeBin ? binFormatter(activeBin) : "Peak"} items={[{ id: (activeBin ?? peak)!.id, label: activeBin ? "Count" : binFormatter((activeBin ?? peak)!), value: valueFormatter((activeBin ?? peak)!.value) }]} /> : undefined}
      showDataByDefault={showDataByDefault}
    />
  );
}
