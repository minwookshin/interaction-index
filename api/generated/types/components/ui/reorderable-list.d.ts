import { type GridListProps, type Key } from "react-aria-components";
export type ReorderableItem = {
    id: Key;
    label: string;
    description?: string;
    disabled?: boolean;
};
export type ReorderableListProps = Omit<GridListProps<ReorderableItem>, "children" | "className" | "dragAndDropHooks" | "items"> & {
    items?: readonly ReorderableItem[];
    defaultItems?: readonly ReorderableItem[];
    onItemsChange?: (items: ReorderableItem[]) => void;
    className?: string;
};
export declare function ReorderableList({ items: controlledItems, defaultItems, onItemsChange, className, layout, ...props }: ReorderableListProps): import("react").JSX.Element;
