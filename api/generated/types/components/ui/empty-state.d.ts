import { type ComponentPropsWithRef, type ReactNode } from "react";
export type EmptyStateProps = Omit<ComponentPropsWithRef<"div">, "title"> & {
    title: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    primaryAction?: ReactNode;
    secondaryAction?: ReactNode;
    size?: "compact" | "default";
};
export declare function EmptyState({ title, description, icon, primaryAction, secondaryAction, size, className, ...props }: EmptyStateProps): import("react").JSX.Element;
