import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
export type SwitchProps = SwitchPrimitive.Root.Props & {
    label?: string;
    description?: string;
};
export declare function Switch({ className, label, description, id: providedId, "aria-describedby": ariaDescribedBy, "aria-labelledby": ariaLabelledBy, ...props }: SwitchProps): import("react").JSX.Element;
