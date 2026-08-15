import "../../styles/index-base.css";
import "../../styles/components/progress.css";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import type { CSSProperties } from "react";
import { cn } from "../../lib/cn";

export type ProgressProps = Omit<ProgressPrimitive.Root.Props, "children"> & {
  label?: string;
  "aria-label"?: string;
  showValue?: boolean;
  size?: "small" | "medium";
  className?: string;
};

export function Progress({ label, "aria-label": ariaLabel, showValue = true, size = "medium", className, value, max = 100, style, ...props }: ProgressProps) {
  const scale = typeof value === "number" ? Math.min(1, Math.max(0, value / max)) : 0.42;
  const progressStyle = { ...style, "--ix-progress-scale": scale } as CSSProperties;
  return (
    <ProgressPrimitive.Root className={cn("ix-progress", `ix-progress--${size}`, className)} value={value} max={max} aria-label={label ? undefined : ariaLabel ?? "Progress"} style={progressStyle} {...props}>
      {(label || showValue) && <div className="ix-progress__meta">{label ? <ProgressPrimitive.Label>{label}</ProgressPrimitive.Label> : <span />}{showValue && <ProgressPrimitive.Value />}</div>}
      <ProgressPrimitive.Track className="ix-progress__track">
        <ProgressPrimitive.Indicator className="ix-progress__indicator" />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
}
