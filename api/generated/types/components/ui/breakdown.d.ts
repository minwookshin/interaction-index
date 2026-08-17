import type { HTMLAttributes, ReactNode } from "react";
export type BreakdownItem = {
    id: string;
    label: string;
    value: number;
    detail?: ReactNode;
    tone?: "primary" | "secondary" | "tertiary";
};
export type BreakdownProps = Omit<HTMLAttributes<HTMLOListElement>, "onSelect"> & {
    label: string;
    items: readonly BreakdownItem[];
    formatter?: (value: number, item: BreakdownItem) => string;
    max?: number;
    selectedId?: string;
    onSelect?: (item: BreakdownItem) => void;
};
export declare function Breakdown({ label, items, formatter, max, selectedId, onSelect, className, ...props }: BreakdownProps): import("react").JSX.Element;
