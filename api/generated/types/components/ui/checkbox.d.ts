import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
export type CheckboxProps = CheckboxPrimitive.Root.Props & {
    label?: string;
    description?: string;
};
export declare function Checkbox({ className, label, description, id: providedId, "aria-describedby": ariaDescribedBy, "aria-labelledby": ariaLabelledBy, ...props }: CheckboxProps): import("react").JSX.Element;
