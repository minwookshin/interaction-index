import { Select as SelectPrimitive } from "@base-ui/react/select";
import type { ReactNode } from "react";
export type ContextSwitcherOption = {
    value: string;
    label: string;
    description: string;
    icon: ReactNode;
    disabled?: boolean;
};
export type ContextSwitcherProps = Omit<SelectPrimitive.Root.Props<string>, "children" | "items"> & {
    options: readonly ContextSwitcherOption[];
    "aria-label": string;
    placeholder?: string;
    className?: string;
    ref?: SelectPrimitive.Trigger.Props["ref"];
};
export declare function ContextSwitcher({ options, value, defaultValue, onValueChange, open, defaultOpen, onOpenChange, "aria-label": ariaLabel, disabled, highlightItemOnHover, placeholder, className, ref, ...rootProps }: ContextSwitcherProps): import("react").JSX.Element;
