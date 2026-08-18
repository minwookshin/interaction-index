import { type ReactNode } from "react";
import { type AnalyticsDatum, type AnalyticsSeries } from "../../lib/analytics";
export type ChartAnnotation = {
    id: string;
    index: number;
    label: string;
    tone?: "neutral" | "danger";
};
export type ChartType = "line" | "area" | "bar" | "stacked-bar";
export type ChartProps = {
    title: string;
    description?: string;
    data: readonly AnalyticsDatum[];
    series: readonly AnalyticsSeries[];
    className?: string;
    height?: number;
    includeZero?: boolean;
    domain?: readonly [number, number];
    type?: ChartType;
    /** @deprecated Use type="area". */
    area?: boolean;
    annotations?: readonly ChartAnnotation[];
    valueFormatter?: (value: number, series: AnalyticsSeries) => string;
    activeIndex?: number | null;
    defaultActiveIndex?: number | null;
    onActiveIndexChange?: (index: number | null) => void;
    visibleSeries?: readonly string[];
    defaultVisibleSeries?: readonly string[];
    onVisibleSeriesChange?: (ids: readonly string[]) => void;
    onDatumActivate?: (datum: AnalyticsDatum, index: number) => void;
    loading?: boolean;
    empty?: ReactNode;
    error?: ReactNode;
    showLegend?: boolean;
    showDataByDefault?: boolean;
    showGrid?: boolean;
};
export declare function Chart({ title, description, data, series, className, height, includeZero, domain, type, area, annotations, valueFormatter, activeIndex, defaultActiveIndex, onActiveIndexChange, visibleSeries, defaultVisibleSeries, onVisibleSeriesChange, onDatumActivate, loading, empty, error, showLegend, showDataByDefault, showGrid, }: ChartProps): import("react").JSX.Element;
