import type { HTMLAttributes } from "react";
import { type SavedViewsProps } from "./data-toolbar";
export type SavedViewMenuProps = SavedViewsProps & {
    className?: string;
};
export declare function SavedViewMenu({ className, ...props }: SavedViewMenuProps): import("react").JSX.Element;
export type SavedViewMenuContainerProps = HTMLAttributes<HTMLSpanElement>;
