import type { ComponentPropsWithRef, ReactNode } from "react";
export type BadgeProps = ComponentPropsWithRef<"span"> & {
    variant?: "neutral" | "strong" | "outline" | "success" | "warning" | "danger";
    leadingIcon?: ReactNode;
    removable?: boolean;
    onRemove?: () => void;
    removeLabel?: string;
};
export declare function Badge({ className, variant, leadingIcon, removable, onRemove, removeLabel, children, ...props }: BadgeProps): import("react").JSX.Element;
