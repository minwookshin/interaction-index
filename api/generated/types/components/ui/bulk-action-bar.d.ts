import type { HTMLAttributes, ReactNode } from "react";
export type BulkActionBarProps = HTMLAttributes<HTMLDivElement> & {
    count: number;
    noun?: string;
    actions: ReactNode;
    onClear: () => void;
    busy?: boolean;
};
export declare function BulkActionBar({ count, noun, actions, onClear, busy, className, ...props }: BulkActionBarProps): import("react").JSX.Element | null;
