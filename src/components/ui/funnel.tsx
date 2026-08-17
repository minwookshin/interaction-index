import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { formatAnalyticsValue } from "../../lib/analytics";
import { cn } from "../../lib/cn";

export type FunnelStage = {
  id: string;
  label: string;
  value: number;
  detail?: ReactNode;
};

export type FunnelProps = Omit<HTMLAttributes<HTMLOListElement>, "onSelect"> & {
  label: string;
  stages: readonly FunnelStage[];
  formatter?: (value: number, stage: FunnelStage) => string;
  selectedId?: string;
  onSelect?: (stage: FunnelStage) => void;
};

export function Funnel({ label, stages, formatter = (value) => formatAnalyticsValue(value), selectedId, onSelect, className, ...props }: FunnelProps) {
  const baseline = Math.max(1, stages[0]?.value ?? 0, ...stages.map((stage) => stage.value));
  return (
    <ol className={cn("teum-funnel", className)} aria-label={label} {...props}>
      {stages.map((stage, index) => {
        const previous = stages[index - 1]?.value;
        const conversion = index === 0 || !previous ? null : stage.value / previous * 100;
        const width = Math.max(0.08, Math.min(1, stage.value / baseline));
        const body = <>
          <span className="teum-funnel__heading"><strong>{stage.label}</strong><b>{formatter(stage.value, stage)}</b></span>
          <span className="teum-funnel__track" aria-hidden="true"><i style={{ "--teum-funnel-progress": width } as CSSProperties} /></span>
          <span className="teum-funnel__meta">{conversion === null ? "Entry" : `${conversion.toFixed(1)}% from previous`}{stage.detail && <small>{stage.detail}</small>}</span>
        </>;
        return <li key={stage.id}>{onSelect ? <button type="button" aria-pressed={stage.id === selectedId} onClick={() => onSelect(stage)}>{body}</button> : <div>{body}</div>}</li>;
      })}
    </ol>
  );
}
