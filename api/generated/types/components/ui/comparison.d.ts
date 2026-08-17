import type { HTMLAttributes } from "react";
export type ComparisonProps = HTMLAttributes<HTMLDListElement> & {
    label: string;
    current: number;
    previous: number;
    currentLabel?: string;
    previousLabel?: string;
    formatter?: (value: number) => string;
    positiveDirection?: "up" | "down" | "neutral";
};
export declare function Comparison({ label, current, previous, currentLabel, previousLabel, formatter, positiveDirection, className, ...props }: ComparisonProps): import("react").JSX.Element;
