import type { HTMLAttributes, ReactNode } from "react";
export type DataResultSummaryProps = Omit<HTMLAttributes<HTMLOutputElement>, "children"> & {
    total: number;
    filtered?: number;
    selected?: number;
    noun?: string;
    detail?: ReactNode;
};
export declare function DataResultSummary({ total, filtered, selected, noun, detail, className, ...props }: DataResultSummaryProps): import("react").JSX.Element;
