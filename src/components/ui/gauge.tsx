import { type CSSProperties, type ReactNode } from "react";
import { formatAnalyticsValue } from "../../lib/analytics";
import { cn } from "../../lib/cn";
import { AnalyticsFrame } from "./analytics-frame";

export type GaugeMarker = {
  value: number;
  label: string;
};

export type GaugeProps = {
  title: string;
  description?: string;
  value: number;
  min?: number;
  max?: number;
  label?: string;
  marker?: GaugeMarker;
  className?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
  tone?: "neutral" | "danger";
  loading?: boolean;
  error?: ReactNode;
  showDataByDefault?: boolean;
};

// A true upper semicircle keeps the value, bounds, and optional marker in one
// compact reading zone. The previous 240-degree sweep crossed below its own
// labels at catalog density.
const gaugeBox = { width: 480, height: 220, centerX: 240, centerY: 156, radius: 108, start: 270, end: 450 } as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function polar(angle: number, radius: number = gaugeBox.radius) {
  const radians = (angle - 90) * Math.PI / 180;
  return { x: gaugeBox.centerX + radius * Math.cos(radians), y: gaugeBox.centerY + radius * Math.sin(radians) };
}

function arcPath(startAngle: number, endAngle: number, radius: number = gaugeBox.radius) {
  const start = polar(endAngle, radius);
  const end = polar(startAngle, radius);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

export function Gauge({
  title,
  description,
  value,
  min = 0,
  max = 100,
  label = "Current",
  marker,
  className,
  height = 240,
  valueFormatter = formatAnalyticsValue,
  tone = "neutral",
  loading = false,
  error,
  showDataByDefault = false,
}: GaugeProps) {
  const validMinimum = Number.isFinite(min) ? min : 0;
  const validMaximum = Number.isFinite(max) && max > validMinimum ? max : validMinimum + 1;
  const validValue = Number.isFinite(value) ? clamp(value, validMinimum, validMaximum) : validMinimum;
  const ratio = (validValue - validMinimum) / (validMaximum - validMinimum);
  const endAngle = gaugeBox.start + (gaugeBox.end - gaugeBox.start) * ratio;
  const markerRatio = marker ? (clamp(marker.value, validMinimum, validMaximum) - validMinimum) / (validMaximum - validMinimum) : null;
  const markerAngle = markerRatio === null ? null : gaugeBox.start + (gaugeBox.end - gaugeBox.start) * markerRatio;
  const markerInner = markerAngle === null ? null : polar(markerAngle, gaugeBox.radius - 11);
  const markerOuter = markerAngle === null ? null : polar(markerAngle, gaugeBox.radius + 11);
  const style = { "--whatiuse-gauge-progress": `${ratio}` } as CSSProperties;

  const plot = (
    <div
      className="whatiuse-gauge__plot"
      data-tone={tone}
      role="meter"
      aria-label={label}
      aria-valuemin={validMinimum}
      aria-valuemax={validMaximum}
      aria-valuenow={validValue}
      aria-valuetext={`${valueFormatter(validValue)} of ${valueFormatter(validMaximum)}`}
      style={style}
    >
      <svg viewBox={`0 0 ${gaugeBox.width} ${gaugeBox.height}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
        <path className="whatiuse-gauge__track" d={arcPath(gaugeBox.start, gaugeBox.end)} />
        {ratio > 0 && <path className="whatiuse-gauge__value" d={arcPath(gaugeBox.start, endAngle)} />}
        {markerInner && markerOuter && <line className="whatiuse-gauge__marker" x1={markerInner.x} y1={markerInner.y} x2={markerOuter.x} y2={markerOuter.y} />}
      </svg>
      <div className="whatiuse-gauge__value-label"><strong>{valueFormatter(validValue)}</strong><span>{label}</span></div>
      <span className="whatiuse-gauge__minimum">{valueFormatter(validMinimum)}</span>
      <span className="whatiuse-gauge__maximum">{valueFormatter(validMaximum)}</span>
      {marker && <span className="whatiuse-gauge__marker-label">{marker.label} · {valueFormatter(marker.value)}</span>}
    </div>
  );
  const table = (
    <table>
      <caption>{title} data</caption>
      <thead><tr><th scope="col">Measure</th><th scope="col">Value</th></tr></thead>
      <tbody>
        <tr><th scope="row">{label}</th><td>{valueFormatter(validValue)}</td></tr>
        <tr><th scope="row">Minimum</th><td>{valueFormatter(validMinimum)}</td></tr>
        <tr><th scope="row">Maximum</th><td>{valueFormatter(validMaximum)}</td></tr>
        {marker && <tr><th scope="row">{marker.label}</th><td>{valueFormatter(marker.value)}</td></tr>}
      </tbody>
    </table>
  );
  const markerSummary = marker ? ` ${marker.label} is ${valueFormatter(marker.value)}.` : "";
  return <AnalyticsFrame className={cn("whatiuse-gauge", className)} title={title} description={description} height={height} summary={`${label} is ${valueFormatter(validValue)} on a range from ${valueFormatter(validMinimum)} to ${valueFormatter(validMaximum)}.${markerSummary}`} plotLabel={`${title} gauge`} plot={plot} table={table} loading={loading} error={error} showDataByDefault={showDataByDefault} />;
}
