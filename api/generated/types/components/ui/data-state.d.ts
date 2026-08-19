import type { HTMLAttributes, ReactNode } from "react";
export type DataStateProps = HTMLAttributes<HTMLDivElement> & {
    state: "loading" | "empty" | "error";
    title?: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
};
export declare function DataState({ state, title, description, action, className, ...props }: DataStateProps): import("react").JSX.Element;
