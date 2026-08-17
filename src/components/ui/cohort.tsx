import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type CohortRow = {
  id: string;
  label: string;
  size?: number;
  values: readonly (number | null)[];
};

export type CohortProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  periods: readonly string[];
  rows: readonly CohortRow[];
  formatter?: (value: number) => string;
  showSize?: boolean;
};

export function Cohort({ label, periods, rows, formatter = (value) => `${(value * 100).toFixed(value >= 0.1 ? 0 : 1)}%`, showSize = true, className, ...props }: CohortProps) {
  return (
    <div className={cn("teum-cohort", className)} role="region" aria-label={`${label} table`} tabIndex={0} {...props}>
      <table>
        <caption>{label}</caption>
        <thead><tr><th scope="col">Cohort</th>{showSize && <th scope="col">Users</th>}{periods.map((period) => <th scope="col" key={period}>{period}</th>)}</tr></thead>
        <tbody>{rows.map((row) => <tr key={row.id}><th scope="row">{row.label}</th>{showSize && <td>{row.size?.toLocaleString() ?? "—"}</td>}{periods.map((period, index) => {
          const value = row.values[index];
          const strength = typeof value === "number" ? Math.min(1, Math.max(0, value)) : 0;
          return <td key={period} data-empty={value === null || value === undefined || undefined} style={{ "--teum-cohort-strength": strength } as CSSProperties} aria-label={typeof value === "number" ? `${row.label}, ${period}, ${formatter(value)}` : `${row.label}, ${period}, no data`}>{typeof value === "number" ? formatter(value) : "—"}</td>;
        })}</tr>)}</tbody>
      </table>
    </div>
  );
}
