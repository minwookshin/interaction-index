import { type ReactNode } from "react";
export type WaterfallDatum = {
    id: string;
    label: string;
    value: number;
    kind?: "change" | "subtotal" | "total";
};
export type WaterfallChartProps = {
    title: string;
    description?: string;
    data: readonly WaterfallDatum[];
    className?: string;
    height?: number;
    valueFormatter?: (value: number) => string;
    activeIndex?: number | null;
    defaultActiveIndex?: number | null;
    onActiveIndexChange?: (index: number | null) => void;
    onDatumActivate?: (datum: WaterfallDatum, index: number) => void;
    loading?: boolean;
    empty?: ReactNode;
    error?: ReactNode;
    showDataByDefault?: boolean;
};
export declare function WaterfallChart({ title, description, data, className, height, valueFormatter, activeIndex, defaultActiveIndex, onActiveIndexChange, onDatumActivate, loading, empty, error, showDataByDefault, }: WaterfallChartProps): import("react").JSX.Element;
