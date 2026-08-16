import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
export type ComboboxOption = {
    label: string;
    value: string;
    description?: string;
    disabled?: boolean;
};
export type ComboboxProps = Omit<ComboboxPrimitive.Root.Props<ComboboxOption>, "children" | "items" | "aria-label"> & {
    label?: string;
    "aria-label"?: string;
    description?: string;
    error?: string;
    placeholder?: string;
    options: readonly ComboboxOption[];
    className?: string;
    ref?: ComboboxPrimitive.Input.Props["ref"];
};
export declare function Combobox({ label, "aria-label": ariaLabel, description, error, placeholder, options, className, ref, ...props }: ComboboxProps): import("react").JSX.Element;
