import type { ComponentPropsWithRef, ReactNode } from "react";
export type AlertProps = Omit<ComponentPropsWithRef<"div">, "title"> & {
    variant?: "neutral" | "critical";
    title: ReactNode;
    icon?: ReactNode;
    action?: ReactNode;
    live?: "polite" | "assertive";
    dismissLabel?: string;
    onDismiss?: () => void;
};
export declare function Alert({ variant, title, icon, action, live, dismissLabel, onDismiss, className, children, role, ...props }: AlertProps): import("react").JSX.Element;
