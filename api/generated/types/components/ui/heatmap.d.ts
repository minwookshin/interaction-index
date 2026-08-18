import { type HTMLAttributes, type ReactNode } from "react";
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
export declare function Heatmap({ title, description, columns, rows, domain, valueFormatter, activeCell, defaultActiveCell, onActiveCellChange, onCellActivate, loading, empty, error, className, ...props }: HeatmapProps): import("react").JSX.Element;
