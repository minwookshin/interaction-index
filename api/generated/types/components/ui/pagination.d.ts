import type { ComponentPropsWithRef } from "react";
export type PaginationProps = Omit<ComponentPropsWithRef<"nav">, "children"> & {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    className?: string;
    label?: string;
};
export declare function Pagination({ page, totalPages, onPageChange, siblingCount, className, label, ...props }: PaginationProps): import("react").JSX.Element;
