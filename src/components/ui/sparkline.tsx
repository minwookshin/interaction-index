import type { CSSProperties, SVGProps } from "react";
import { cn } from "../../lib/cn";
import {
  createAnalyticsAreaPath,
  createAnalyticsPath,
  getAnalyticsDomain,
  type AnalyticsSeriesTone,
} from "../../lib/analytics";

export type SparklineProps = Omit<SVGProps<SVGSVGElement>, "children" | "width" | "height" | "fill" | "values"> & {
  values: readonly (number | null)[];
  label?: string;
  width?: number;
  height?: number;
  tone?: AnalyticsSeriesTone;
  fill?: boolean;
  decorative?: boolean;
};

export function Sparkline({
  values,
  label = "Trend",
  width = 112,
  height = 32,
  tone = "primary",
  fill = false,
  decorative = false,
  className,
  style,
  ...props
}: SparklineProps) {
  const data = values.map((value, index) => ({ id: String(index), label: String(index + 1), values: { value } }));
  const domain = getAnalyticsDomain(data, ["value"], { paddingRatio: 0.12 });
  const box = { width, height, left: 1.5, right: 1.5, top: 2, bottom: 2 };
  const path = createAnalyticsPath(data, "value", domain, box);
  const areaPath = fill ? createAnalyticsAreaPath(data, "value", domain, box) : "";
  const sparklineStyle = { ...style, "--whatiuse-sparkline-width": `${width}px`, "--whatiuse-sparkline-height": `${height}px` } as CSSProperties;

  return (
    <svg
      className={cn("whatiuse-sparkline", className)}
      data-tone={tone}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      width={width}
      height={height}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      focusable="false"
      style={sparklineStyle}
      {...props}
    >
      {areaPath && <path className="whatiuse-sparkline__area" d={areaPath} />}
      {path ? <path className="whatiuse-sparkline__line" d={path} pathLength={1} /> : <line className="whatiuse-sparkline__empty" x1="0" x2={width} y1={height / 2} y2={height / 2} />}
    </svg>
  );
}
