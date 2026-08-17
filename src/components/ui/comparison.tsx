import { ArrowDown, ArrowUp, Minus } from "@phosphor-icons/react";
import type { HTMLAttributes } from "react";
import { formatAnalyticsValue, getPercentChange } from "../../lib/analytics";
import { cn } from "../../lib/cn";

export type ComparisonProps = HTMLAttributes<HTMLDListElement> & {
  label: string;
  current: number;
  previous: number;
  currentLabel?: string;
  previousLabel?: string;
  formatter?: (value: number) => string;
  positiveDirection?: "up" | "down" | "neutral";
};

export function Comparison({
  label,
  current,
  previous,
  currentLabel = "Current",
  previousLabel = "Previous",
  formatter = formatAnalyticsValue,
  positiveDirection = "neutral",
  className,
  ...props
}: ComparisonProps) {
  const change = getPercentChange(current, previous);
  const direction = current === previous ? "flat" : current > previous ? "up" : "down";
  const sentiment = positiveDirection === "neutral" || direction === "flat" ? "neutral" : direction === positiveDirection ? "positive" : "negative";
  const DirectionIcon = direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : Minus;
  const changeLabel = change === null ? "No comparable change" : `${Math.abs(change).toFixed(1)}% ${direction === "up" ? "increase" : direction === "down" ? "decrease" : "change"}`;
  return (
    <dl className={cn("teum-comparison", className)} aria-label={label} {...props}>
      <div className="teum-comparison__primary"><dt>{currentLabel}</dt><dd>{formatter(current)}</dd></div>
      <div className="teum-comparison__secondary"><dt>{previousLabel}</dt><dd>{formatter(previous)}</dd></div>
      <div className="teum-comparison__change" data-direction={direction} data-sentiment={sentiment}>
        <dt>Change</dt>
        <dd><DirectionIcon aria-hidden="true" />{change === null ? "—" : `${Math.abs(change).toFixed(1)}%`}<span className="teum-sr-only">{changeLabel}</span></dd>
      </div>
    </dl>
  );
}
