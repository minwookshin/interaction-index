import type { HTMLAttributes } from "react";
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
export declare function Cohort({ label, periods, rows, formatter, showSize, className, ...props }: CohortProps): import("react").JSX.Element;
