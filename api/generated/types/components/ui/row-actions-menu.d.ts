import type { ReactNode } from "react";
export type RowAction = {
    id: string;
    label: string;
    icon?: ReactNode;
    disabled?: boolean;
    destructive?: boolean;
    separatorBefore?: boolean;
};
export type RowActionsMenuProps = {
    label: string;
    actions: readonly RowAction[];
    onAction: (action: RowAction) => void;
    className?: string;
};
export declare function RowActionsMenu({ label, actions, onAction, className }: RowActionsMenuProps): import("react").JSX.Element;
