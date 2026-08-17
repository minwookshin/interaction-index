import type { HTMLAttributes, ReactNode } from "react";
export type MetricTrend = {
    label: string;
    value?: ReactNode;
    direction?: "up" | "down" | "flat";
    sentiment?: "positive" | "negative" | "neutral";
};
export type MetricProps = HTMLAttributes<HTMLDivElement> & {
    label: string;
    value: ReactNode;
    trend?: MetricTrend;
    context?: ReactNode;
    visual?: ReactNode;
    loading?: boolean;
};
export declare function Metric({ label, value, trend, context, visual, loading, className, ...props }: MetricProps): import("react").JSX.Element;
