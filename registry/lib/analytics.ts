export type AnalyticsValue = number | null;

export type AnalyticsDatum = {
  id: string;
  label: string;
  values: Readonly<Record<string, AnalyticsValue>>;
};

export type AnalyticsSeriesTone = "primary" | "secondary" | "tertiary";

export type AnalyticsSeries = {
  id: string;
  label: string;
  tone?: AnalyticsSeriesTone;
  lineStyle?: "solid" | "dashed" | "dotted";
};

export type AnalyticsDomainOptions = {
  includeZero?: boolean;
  paddingRatio?: number;
  domain?: readonly [number, number];
};

export type AnalyticsPlotBox = {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type AnalyticsPointPosition = {
  x: number;
  y: number;
  value: number;
};

function finiteValues(data: readonly AnalyticsDatum[], seriesIds: readonly string[]) {
  return data.flatMap((datum) => seriesIds.map((seriesId) => datum.values[seriesId]))
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
}

export function getAnalyticsDomain(
  data: readonly AnalyticsDatum[],
  seriesIds: readonly string[],
  { includeZero = false, paddingRatio = 0.08, domain }: AnalyticsDomainOptions = {},
): readonly [number, number] {
  if (domain && domain.length === 2 && Number.isFinite(domain[0]) && Number.isFinite(domain[1]) && domain[0] < domain[1]) {
    return domain;
  }

  const values = finiteValues(data, seriesIds);
  if (!values.length) return [0, 1];

  let minimum = Math.min(...values);
  let maximum = Math.max(...values);
  if (includeZero) {
    minimum = Math.min(0, minimum);
    maximum = Math.max(0, maximum);
  }
  if (minimum === maximum) {
    const fallback = Math.max(Math.abs(minimum) * 0.1, 1);
    return [minimum - fallback, maximum + fallback];
  }

  const padding = (maximum - minimum) * Math.max(0, paddingRatio);
  return [minimum - padding, maximum + padding];
}

function niceStep(range: number, tickCount: number) {
  const rough = Math.abs(range) / Math.max(1, tickCount - 1);
  if (!rough || !Number.isFinite(rough)) return 1;
  const power = 10 ** Math.floor(Math.log10(rough));
  const fraction = rough / power;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * power;
}

export function createAnalyticsTicks(domain: readonly [number, number], tickCount = 5): readonly number[] {
  const [minimum, maximum] = domain;
  const step = niceStep(maximum - minimum, tickCount);
  const first = Math.ceil(minimum / step) * step;
  const ticks: number[] = [];
  for (let value = first; value <= maximum + step * 0.001; value += step) {
    ticks.push(Number(value.toPrecision(12)));
    if (ticks.length > 20) break;
  }
  if (!ticks.length) return [minimum, maximum];
  return ticks;
}

export function getAnalyticsPointPosition(
  data: readonly AnalyticsDatum[],
  index: number,
  seriesId: string,
  domain: readonly [number, number],
  box: AnalyticsPlotBox,
): AnalyticsPointPosition | null {
  const value = data[index]?.values[seriesId];
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const plotWidth = Math.max(1, box.width - box.left - box.right);
  const plotHeight = Math.max(1, box.height - box.top - box.bottom);
  const x = box.left + (data.length <= 1 ? plotWidth / 2 : index / (data.length - 1) * plotWidth);
  const ratio = (value - domain[0]) / Math.max(Number.EPSILON, domain[1] - domain[0]);
  const y = box.top + (1 - ratio) * plotHeight;
  return { x, y, value };
}

export function createAnalyticsPath(
  data: readonly AnalyticsDatum[],
  seriesId: string,
  domain: readonly [number, number],
  box: AnalyticsPlotBox,
) {
  const commands: string[] = [];
  let drawing = false;
  data.forEach((_datum, index) => {
    const point = getAnalyticsPointPosition(data, index, seriesId, domain, box);
    if (!point) {
      drawing = false;
      return;
    }
    commands.push(`${drawing ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`);
    drawing = true;
  });
  return commands.join(" ");
}

export function createAnalyticsAreaPath(
  data: readonly AnalyticsDatum[],
  seriesId: string,
  domain: readonly [number, number],
  box: AnalyticsPlotBox,
) {
  const points = data.map((_datum, index) => getAnalyticsPointPosition(data, index, seriesId, domain, box));
  if (points.some((point) => !point)) return "";
  const present = points.filter((point): point is AnalyticsPointPosition => Boolean(point));
  if (!present.length) return "";
  const baseline = box.height - box.bottom;
  return `M${present[0].x.toFixed(2)},${baseline.toFixed(2)} ${present.map((point) => `L${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ")} L${present.at(-1)!.x.toFixed(2)},${baseline.toFixed(2)} Z`;
}

export function clampAnalyticsIndex(index: number | null | undefined, length: number) {
  if (!length) return null;
  if (index === null || index === undefined || !Number.isFinite(index)) return null;
  return Math.min(length - 1, Math.max(0, Math.round(index)));
}

export function getPercentChange(current: number, previous: number): number | null {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) return null;
  return (current - previous) / Math.abs(previous) * 100;
}

export function formatAnalyticsValue(value: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat(undefined, {
    notation: Math.abs(value) >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 1,
    ...options,
  }).format(value);
}

export function describeAnalyticsDatum(
  datum: AnalyticsDatum,
  series: readonly AnalyticsSeries[],
  valueFormatter: (value: number, series: AnalyticsSeries) => string = (value) => formatAnalyticsValue(value),
) {
  const values = series.flatMap((item) => {
    const value = datum.values[item.id];
    return typeof value === "number" && Number.isFinite(value) ? [`${item.label} ${valueFormatter(value, item)}`] : [];
  });
  return `${datum.label}. ${values.join(", ") || "No value"}.`;
}

export function summarizeAnalyticsSeries(
  data: readonly AnalyticsDatum[],
  series: AnalyticsSeries,
  valueFormatter: (value: number, series: AnalyticsSeries) => string = (value) => formatAnalyticsValue(value),
) {
  const values = data.map((datum) => datum.values[series.id]).filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (!values.length) return `${series.label} has no values.`;
  const first = values[0];
  const last = values.at(-1)!;
  const direction = last === first ? "unchanged" : last > first ? "increased" : "decreased";
  return `${series.label} ${direction} from ${valueFormatter(first, series)} to ${valueFormatter(last, series)}.`;
}
