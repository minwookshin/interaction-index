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

export function Progress({ label, "aria-label": ariaLabel, showValue = true, size = "medium", className, value, min = 0, max = 100, style, ...props }: ProgressProps) {
  const range = max - min;
  const scale = typeof value === "number" && range > 0 ? Math.min(1, Math.max(0, (value - min) / range)) : 0.42;
  const progressStyle = { ...style, "--teum-progress-scale": scale } as CSSProperties;
  return (
    <ProgressPrimitive.Root className={cn("teum-progress", `teum-progress--${size}`, className)} value={value} min={min} max={max} aria-label={label ? undefined : ariaLabel ?? "Progress"} style={progressStyle} {...props}>
      {(label || showValue) && <div className="teum-progress__meta">{label ? <ProgressPrimitive.Label>{label}</ProgressPrimitive.Label> : <span />}{showValue && <ProgressPrimitive.Value />}</div>}
      <ProgressPrimitive.Track className="teum-progress__track">
        <ProgressPrimitive.Indicator className="teum-progress__indicator" />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
}
