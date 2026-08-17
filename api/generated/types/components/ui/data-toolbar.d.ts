import type { HTMLAttributes, ReactNode } from "react";
export type DataToolbarProps = HTMLAttributes<HTMLDivElement> & {
    label: string;
    start?: ReactNode;
    end?: ReactNode;
};
export declare function DataToolbar({ label, start, end, className, ...props }: DataToolbarProps): import("react").JSX.Element;
export type SavedView = {
    id: string;
    label: string;
    description?: string;
    count?: number;
    scope?: "system" | "personal";
};
export type SavedViewsProps = {
    views: readonly SavedView[];
    value: string;
    onValueChange: (value: string) => void;
    onSaveCurrent?: () => void;
    onUpdateCurrent?: () => void;
    onDeleteCurrent?: () => void;
    label?: string;
};
export declare function SavedViews({ views, value, onValueChange, onSaveCurrent, onUpdateCurrent, onDeleteCurrent, label }: SavedViewsProps): import("react").JSX.Element;
export type ColumnManagerColumn = {
    id: string;
    label: string;
    visible: boolean;
    required?: boolean;
};
export type ColumnManagerProps = {
    columns: readonly ColumnManagerColumn[];
    onVisibilityChange: (id: string, visible: boolean) => void;
    onResetSizing?: () => void;
    label?: string;
};
export declare function ColumnManager({ columns, onVisibilityChange, onResetSizing, label }: ColumnManagerProps): import("react").JSX.Element;
