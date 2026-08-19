import { type ReactNode } from "react";
export type HistogramBin = {
    id: string;
    label: string;
    start: number;
    end: number;
    value: number;
};
export type HistogramProps = {
    title: string;
    description?: string;
    data: readonly HistogramBin[];
    className?: string;
    height?: number;
    valueFormatter?: (value: number) => string;
    binFormatter?: (bin: HistogramBin) => string;
    activeIndex?: number | null;
    defaultActiveIndex?: number | null;
    onActiveIndexChange?: (index: number | null) => void;
    onBinActivate?: (bin: HistogramBin, index: number) => void;
    loading?: boolean;
    empty?: ReactNode;
    error?: ReactNode;
    showDataByDefault?: boolean;
};
export declare function Histogram({ title, description, data, className, height, valueFormatter, binFormatter, activeIndex, defaultActiveIndex, onActiveIndexChange, onBinActivate, loading, empty, error, showDataByDefault, }: HistogramProps): import("react").JSX.Element;
