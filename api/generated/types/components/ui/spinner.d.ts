import type { ComponentPropsWithRef } from "react";
export type SpinnerProps = ComponentPropsWithRef<"span"> & {
    size?: "small" | "medium" | "large";
    label?: string;
};
export declare function Spinner({ className, size, label, ...props }: SpinnerProps): import("react").JSX.Element;
