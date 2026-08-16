import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
export type RadioOption = {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
};
export type RadioGroupProps = Omit<RadioGroupPrimitive.Props<string>, "children"> & {
    label: string;
    description?: string;
    error?: string;
    options: readonly RadioOption[];
    orientation?: "vertical" | "horizontal";
};
export declare function RadioGroup({ className, label, description, error, options, orientation, ...props }: RadioGroupProps): import("react").JSX.Element;
