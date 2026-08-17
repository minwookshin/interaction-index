import type { HTMLAttributes, ReactNode } from "react";
import { formatAnalyticsValue } from "../../lib/analytics";
import { cn } from "../../lib/cn";

export type GoalProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  label: string;
  value: number;
  target: number;
  formatter?: (value: number) => string;
  description?: ReactNode;
};

export function Goal({ label, value, target, formatter = formatAnalyticsValue, description, className, ...props }: GoalProps) {
  const ratio = target > 0 ? Math.max(0, value / target) : 0;
  const progress = Math.min(1, ratio);
  const goalStyle = { "--teum-goal-progress": progress } as React.CSSProperties;
  return (
    <div className={cn("teum-goal", className)} style={goalStyle} {...props}>
      <div className="teum-goal__heading"><span>{label}</span><strong>{Math.round(ratio * 100)}%</strong></div>
      <div className="teum-goal__track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={target} aria-valuenow={Math.min(target, Math.max(0, value))} aria-valuetext={`${formatter(value)} of ${formatter(target)}`}>
        <span className="teum-goal__indicator" />
      </div>
      <div className="teum-goal__meta"><span>{formatter(value)}</span><span>Target {formatter(target)}</span></div>
      {description && <div className="teum-goal__description">{description}</div>}
    </div>
  );
}
