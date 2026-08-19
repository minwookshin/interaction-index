import type { HTMLAttributes, ReactNode } from "react";
export type CursorPaginationProps = HTMLAttributes<HTMLElement> & {
    label?: string;
    hasPrevious: boolean;
    hasNext: boolean;
    onPrevious: () => void;
    onNext: () => void;
    range?: ReactNode;
    loading?: boolean;
};
export declare function CursorPagination({ label, hasPrevious, hasNext, onPrevious, onNext, range, loading, className, ...props }: CursorPaginationProps): import("react").JSX.Element;
