"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/metric.css";
import { ArrowDownRight, ArrowUpRight, Minus } from "@phosphor-icons/react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type MetricTrend = {
  label: string;
  value?: ReactNode;
  direction?: "up" | "down" | "flat";
  sentiment?: "positive" | "negative" | "neutral";
};

export type MetricProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: ReactNode;
  trend?: MetricTrend;
  context?: ReactNode;
  visual?: ReactNode;
  loading?: boolean;
};

export function Metric({ label, value, trend, context, visual, loading = false, className, ...props }: MetricProps) {
  const TrendIcon = trend?.direction === "up" ? ArrowUpRight : trend?.direction === "down" ? ArrowDownRight : Minus;
  return (
    <div className={cn("whatiuse-metric", className)} role="group" aria-label={label} aria-busy={loading || undefined} {...props}>
      <div className="whatiuse-metric__body">
        <span className="whatiuse-metric__label">{label}</span>
        <strong className="whatiuse-metric__value">{loading ? <span className="whatiuse-metric__placeholder" aria-hidden="true" /> : value}</strong>
        {(trend || context) && <div className="whatiuse-metric__meta">
          {trend && <span className="whatiuse-metric__trend" data-direction={trend.direction ?? "flat"} data-sentiment={trend.sentiment ?? "neutral"}>
            <TrendIcon aria-hidden="true" />
            {trend.value && <strong>{trend.value}</strong>}
            <span>{trend.label}</span>
          </span>}
          {context && <span className="whatiuse-metric__context">{context}</span>}
        </div>}
      </div>
      {visual && <div className="whatiuse-metric__visual" aria-hidden="true">{visual}</div>}
      {loading && <span className="whatiuse-sr-only">Loading {label}</span>}
    </div>
  );
}
