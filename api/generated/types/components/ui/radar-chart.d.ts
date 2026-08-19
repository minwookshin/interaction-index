import { type ReactNode } from "react";
import { type AnalyticsSeriesTone } from "../../lib/analytics";
export type RadarAxis = {
    id: string;
    label: string;
    max: number;
};
export type RadarSeries = {
    id: string;
    label: string;
    values: Readonly<Record<string, number | null>>;
    tone?: AnalyticsSeriesTone;
};
export type RadarChartProps = {
    title: string;
    description?: string;
    axes: readonly RadarAxis[];
    series: readonly RadarSeries[];
    className?: string;
    height?: number;
    valueFormatter?: (value: number, axis: RadarAxis, series: RadarSeries) => string;
    activeAxisIndex?: number | null;
    defaultActiveAxisIndex?: number | null;
    onActiveAxisIndexChange?: (index: number | null) => void;
    onAxisActivate?: (axis: RadarAxis, index: number) => void;
    loading?: boolean;
    empty?: ReactNode;
    error?: ReactNode;
    showDataByDefault?: boolean;
};
export declare function RadarChart({ title, description, axes, series, className, height, valueFormatter, activeAxisIndex, defaultActiveAxisIndex, onActiveAxisIndexChange, onAxisActivate, loading, empty, error, showDataByDefault, }: RadarChartProps): import("react").JSX.Element;
