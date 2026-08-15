import { Select as SelectPrimitive } from "@base-ui/react/select";
export type SelectOption = {
    label: string;
    value: string;
    disabled?: boolean;
};
export type SelectProps = Omit<SelectPrimitive.Root.Props<string>, "children" | "items" | "aria-label"> & {
    label?: string;
    "aria-label"?: string;
    description?: string;
    error?: string;
    placeholder?: string;
    options: readonly SelectOption[];
    className?: string;
    ref?: SelectPrimitive.Trigger.Props["ref"];
};
export declare function Select({ label, "aria-label": ariaLabel, description, error, placeholder, options, className, ref, ...props }: SelectProps): import("react").JSX.Element;
