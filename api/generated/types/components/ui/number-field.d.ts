import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { type ReactNode } from "react";
export type NumberFieldProps = Omit<NumberFieldPrimitive.Root.Props, "children" | "className" | "id"> & {
    id?: string;
    label?: string;
    description?: string;
    error?: string;
    suffix?: ReactNode;
    className?: string;
    inputClassName?: string;
    inputProps?: Omit<NumberFieldPrimitive.Input.Props, "id" | "className" | "aria-describedby" | "aria-invalid">;
};
export declare function NumberField({ id: providedId, label, description, error, suffix, className, inputClassName, inputProps, ...props }: NumberFieldProps): import("react").JSX.Element;
