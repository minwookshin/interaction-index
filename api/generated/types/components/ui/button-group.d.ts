import type { ComponentPropsWithRef } from "react";
export type ButtonGroupProps = ComponentPropsWithRef<"div"> & {
    orientation?: "horizontal" | "vertical";
    attached?: boolean;
};
export declare function ButtonGroup({ className, orientation, attached, role, ...props }: ButtonGroupProps): import("react").JSX.Element;
export type ButtonGroupSeparatorProps = ComponentPropsWithRef<"span"> & {
    orientation?: "horizontal" | "vertical";
};
export declare function ButtonGroupSeparator({ className, orientation, ...props }: ButtonGroupSeparatorProps): import("react").JSX.Element;
