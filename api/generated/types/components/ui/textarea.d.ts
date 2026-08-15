import { type ComponentPropsWithRef } from "react";
export type TextareaProps = ComponentPropsWithRef<"textarea"> & {
    label?: string;
    description?: string;
    error?: string;
    showCount?: boolean;
};
export declare function Textarea({ id: providedId, label, description, error, showCount, maxLength, className, value, defaultValue, onChange, ref, ...props }: TextareaProps): import("react").JSX.Element;
