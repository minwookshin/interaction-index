import type { HTMLAttributes, ReactNode } from "react";
export type TimelineItem = {
    id: string;
    label: string;
    timestamp: ReactNode;
    description?: ReactNode;
    value?: ReactNode;
    tone?: "neutral" | "accent" | "danger";
};
export type TimelineProps = Omit<HTMLAttributes<HTMLOListElement>, "onSelect"> & {
    label: string;
    items: readonly TimelineItem[];
    activeId?: string;
    onSelect?: (item: TimelineItem) => void;
};
export declare function Timeline({ label, items, activeId, onSelect, className, ...props }: TimelineProps): import("react").JSX.Element;
