import type { HTMLAttributes, ReactNode } from "react";
export type PropertyListItem = {
    id: string;
    label: ReactNode;
    value: ReactNode;
    description?: ReactNode;
};
export type PropertyListProps = HTMLAttributes<HTMLDListElement> & {
    items: readonly PropertyListItem[];
    columns?: 1 | 2;
};
export declare function PropertyList({ items, columns, className, ...props }: PropertyListProps): import("react").JSX.Element;
