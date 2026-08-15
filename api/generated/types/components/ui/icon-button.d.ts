import type { ReactNode } from "react";
import { type ButtonProps } from "./button";
export type IconButtonProps = Omit<ButtonProps, "children" | "leadingIcon" | "trailingIcon"> & {
    children?: ReactNode;
    "aria-label": string;
    tooltip?: string;
};
export declare function IconButton({ children, className, tooltip, ...props }: IconButtonProps): import("react").JSX.Element;
