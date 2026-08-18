"use client";

import "../../styles/teum-base.css";
import "../../styles/components/heatmap.css";
import {
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { formatAnalyticsValue } from "../../lib/analytics";
import { cn } from "../../lib/cn";

export type HeatmapRow = {
  id: string;
  label: string;
  values: readonly (number | null)[];
};

export type HeatmapCell = {
  rowId: string;
  columnIndex: number;
};

export type HeatmapProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  title: string;
  description?: string;
  columns: readonly string[];
  rows: readonly HeatmapRow[];
  domain?: readonly [number, number];
  valueFormatter?: (value: number) => string;
  activeCell?: HeatmapCell | null;
  defaultActiveCell?: HeatmapCell | null;
  onActiveCellChange?: (cell: HeatmapCell | null) => void;
  onCellActivate?: (cell: HeatmapCell, value: number | null) => void;
  loading?: boolean;
  empty?: ReactNode;
  error?: ReactNode;
};

function sameCell(a: HeatmapCell | null, b: HeatmapCell | null) {
  return a?.rowId === b?.rowId && a?.columnIndex === b?.columnIndex;
}

export function Heatmap({
  title,
  description,
  columns,
  rows,
  domain,
  valueFormatter = (value) => formatAnalyticsValue(value),
  activeCell,
  defaultActiveCell = null,
  onActiveCellChange,
  onCellActivate,
  loading = false,
  empty = "No data for this range.",
  error,
  className,
  ...props
}: HeatmapProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [internalCell, setInternalCell] = useState<HeatmapCell | null>(defaultActiveCell);
  const controlled = activeCell !== undefined;
  const currentCell = controlled ? activeCell : internalCell;
  const setCurrentCell = (cell: HeatmapCell | null) => {
    if (!controlled) setInternalCell(cell);
    onActiveCellChange?.(cell);
  };
  const values = useMemo(() => rows.flatMap((row) => row.values).filter((value): value is number => typeof value === "number" && Number.isFinite(value)), [rows]);
  const resolvedDomain = useMemo<readonly [number, number]>(() => {
    if (domain && domain[0] < domain[1]) return domain;
    if (!values.length) return [0, 1];
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    return minimum === maximum ? [Math.min(0, minimum), maximum || 1] : [minimum, maximum];
  }, [domain, values]);
  const activeRowIndex = currentCell ? rows.findIndex((row) => row.id === currentCell.rowId) : -1;
  const activeValue = activeRowIndex >= 0 && currentCell ? rows[activeRowIndex]?.values[currentCell.columnIndex] ?? null : null;
  const activeLabel = activeRowIndex >= 0 && currentCell ? `${rows[activeRowIndex].label}, ${columns[currentCell.columnIndex]}` : null;

  const focusCell = (rowIndex: number, columnIndex: number) => {
    const next = { rowId: rows[rowIndex].id, columnIndex };
    setCurrentCell(next);
    rootRef.current?.querySelector<HTMLElement>(`[data-heatmap-row="${rowIndex}"][data-heatmap-column="${columnIndex}"]`)?.focus();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, rowIndex: number, columnIndex: number) => {
    let nextRow = rowIndex;
    let nextColumn = columnIndex;
    if (event.key === "ArrowLeft") nextColumn = Math.max(0, columnIndex - 1);
    else if (event.key === "ArrowRight") nextColumn = Math.min(columns.length - 1, columnIndex + 1);
    else if (event.key === "ArrowUp") nextRow = Math.max(0, rowIndex - 1);
    else if (event.key === "ArrowDown") nextRow = Math.min(rows.length - 1, rowIndex + 1);
    else if (event.key === "Home") nextColumn = 0;
    else if (event.key === "End") nextColumn = columns.length - 1;
    else if (event.key === "Escape") {
      event.preventDefault();
      setCurrentCell(null);
      return;
    } else if (event.key === "Enter") {
      event.preventDefault();
      onCellActivate?.({ rowId: rows[rowIndex].id, columnIndex }, rows[rowIndex].values[columnIndex] ?? null);
      return;
    } else return;
    event.preventDefault();
    focusCell(nextRow, nextColumn);
  };

  return (
    <div ref={rootRef} className={cn("teum-heatmap", className)} role="region" aria-labelledby={`${id}-title`} {...props}>
      <header className="teum-heatmap__header">
        <div><h3 id={`${id}-title`}>{title}</h3>{description && <p>{description}</p>}</div>
        <output aria-live="polite">{activeLabel ? <><span>{activeLabel}</span><strong>{typeof activeValue === "number" ? valueFormatter(activeValue) : "No data"}</strong></> : <><span>Range</span><strong>{valueFormatter(resolvedDomain[0])} to {valueFormatter(resolvedDomain[1])}</strong></>}</output>
      </header>
      <div className="teum-heatmap__stage">
        {loading ? <div className="teum-heatmap__state" role="status"><span aria-hidden="true" />Loading heatmap</div> : error ? <div className="teum-heatmap__state teum-heatmap__state--error" role="alert">{error}</div> : !rows.length || !columns.length ? <div className="teum-heatmap__state">{empty}</div> : <table>
          <caption className="teum-sr-only">{title} data</caption>
          <thead><tr><th scope="col">Series</th>{columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead>
          <tbody>{rows.map((row, rowIndex) => <tr key={row.id}><th scope="row">{row.label}</th>{columns.map((column, columnIndex) => {
            const value = row.values[columnIndex] ?? null;
            const strength = typeof value === "number" ? Math.min(1, Math.max(0, (value - resolvedDomain[0]) / Math.max(Number.EPSILON, resolvedDomain[1] - resolvedDomain[0]))) : 0;
            const cell = { rowId: row.id, columnIndex };
            const selected = sameCell(currentCell, cell);
            const isFallbackTabStop = !currentCell && rowIndex === 0 && columnIndex === 0;
            return <td key={column} data-empty={value === null || undefined}><button
              type="button"
              data-heatmap-row={rowIndex}
              data-heatmap-column={columnIndex}
              data-selected={selected || undefined}
              aria-pressed={selected}
              aria-label={`${row.label}, ${column}, ${typeof value === "number" ? valueFormatter(value) : "no data"}`}
              tabIndex={selected || isFallbackTabStop ? 0 : -1}
              style={{ "--teum-heatmap-strength": strength } as CSSProperties}
              onFocus={() => setCurrentCell(cell)}
              onPointerEnter={() => setCurrentCell(cell)}
              onKeyDown={(event) => handleKeyDown(event, rowIndex, columnIndex)}
              onClick={() => onCellActivate?.(cell, value)}
            ><span>{typeof value === "number" ? valueFormatter(value) : "No data"}</span></button></td>;
          })}</tr>)}</tbody>
        </table>}
      </div>
    </div>
  );
}
