import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type DataResultSummaryProps = Omit<HTMLAttributes<HTMLOutputElement>, "children"> & {
  total: number;
  filtered?: number;
  selected?: number;
  noun?: string;
  detail?: ReactNode;
};

export function DataResultSummary({ total, filtered, selected = 0, noun = "result", detail, className, ...props }: DataResultSummaryProps) {
  const shown = filtered ?? total;
  const pluralNoun = shown === 1 ? noun : `${noun}s`;
  return (
    <output className={cn("whatiuse-data-result-summary", className)} {...props}>
      <span><strong>{shown.toLocaleString()}</strong> {pluralNoun}</span>
      {filtered !== undefined && filtered !== total && <span>of {total.toLocaleString()}</span>}
      {selected > 0 && <span className="whatiuse-data-result-summary__selected">{selected.toLocaleString()} selected</span>}
      {detail && <span className="whatiuse-data-result-summary__detail">{detail}</span>}
    </output>
  );
}
