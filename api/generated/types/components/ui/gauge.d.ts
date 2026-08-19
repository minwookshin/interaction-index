import { type ReactNode } from "react";
export type GaugeMarker = {
    value: number;
    label: string;
};
export type GaugeProps = {
    title: string;
    description?: string;
    value: number;
    min?: number;
    max?: number;
    label?: string;
    marker?: GaugeMarker;
    className?: string;
    height?: number;
    valueFormatter?: (value: number) => string;
    tone?: "neutral" | "danger";
    loading?: boolean;
    error?: ReactNode;
    showDataByDefault?: boolean;
};
export declare function Gauge({ title, description, value, min, max, label, marker, className, height, valueFormatter, tone, loading, error, showDataByDefault, }: GaugeProps): import("react").JSX.Element;
