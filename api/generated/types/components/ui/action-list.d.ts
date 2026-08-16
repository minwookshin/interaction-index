import { type ReactNode } from "react";
import type { BehaviorContract } from "../../lib/behavior-contract";
export declare const actionListContract: BehaviorContract;
export type ActionListItem = {
    id: string;
    label: string;
    description?: string;
    icon?: ReactNode;
    shortcut?: string;
    disabled?: boolean;
    loading?: boolean;
    variant?: "default" | "danger";
    inactiveReason?: string;
};
export type ActionListProps = {
    items: readonly ActionListItem[];
    onAction: (item: ActionListItem) => void;
    placeholder?: string;
    emptyMessage?: string;
    className?: string;
    autoFocus?: boolean;
    defaultQuery?: string;
};
export declare function ActionList({ items, onAction, placeholder, emptyMessage, className, autoFocus, defaultQuery }: ActionListProps): import("react").JSX.Element;
