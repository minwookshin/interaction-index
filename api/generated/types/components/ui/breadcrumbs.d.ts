import type { ComponentPropsWithRef, ReactNode } from "react";
export type BreadcrumbItem = {
    label: string;
    href?: string;
    icon?: ReactNode;
};
export type BreadcrumbsProps = ComponentPropsWithRef<"nav"> & {
    items: readonly BreadcrumbItem[];
    maxItems?: number;
    label?: string;
};
export declare function Breadcrumbs({ items, maxItems, label, className, ...props }: BreadcrumbsProps): import("react").JSX.Element;
