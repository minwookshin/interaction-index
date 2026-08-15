import { type ComponentPropsWithRef, type ReactNode } from "react";
export type TextFieldProps = Omit<ComponentPropsWithRef<"input">, "size"> & {
    label?: string;
    description?: string;
    error?: string;
    leading?: ReactNode;
    trailing?: ReactNode;
    fieldClassName?: string;
};
export declare function TextField({ id: providedId, label, description, error, leading, trailing, className, fieldClassName, ref, ...props }: TextFieldProps): import("react").JSX.Element;
