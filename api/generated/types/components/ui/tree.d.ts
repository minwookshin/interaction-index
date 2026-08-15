import { type Key, type TreeProps as AriaTreeProps } from "react-aria-components";
import type { ReactNode } from "react";
export type TreeNode = {
    id: Key;
    label: string;
    description?: string;
    icon?: ReactNode;
    children?: readonly TreeNode[];
    disabled?: boolean;
};
export type TreeProps = Omit<AriaTreeProps<TreeNode>, "children" | "className" | "items"> & {
    items: readonly TreeNode[];
    className?: string;
};
export declare function Tree({ items, className, selectionMode, ...props }: TreeProps): import("react").JSX.Element;
