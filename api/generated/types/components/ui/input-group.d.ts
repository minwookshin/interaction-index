import { type ComponentPropsWithRef } from "react";
import { type ButtonProps } from "./button";
export type InputGroupProps = ComponentPropsWithRef<"div"> & {
    invalid?: boolean;
    disabled?: boolean;
};
export declare function InputGroup({ className, invalid, disabled, ...props }: InputGroupProps): import("react").JSX.Element;
export type InputGroupInputProps = ComponentPropsWithRef<"input">;
export declare function InputGroupInput({ className, disabled, "aria-invalid": ariaInvalid, ...props }: InputGroupInputProps): import("react").JSX.Element;
export type InputGroupAddonProps = ComponentPropsWithRef<"span"> & {
    side?: "start" | "end";
};
export declare function InputGroupAddon({ className, side, ...props }: InputGroupAddonProps): import("react").JSX.Element;
export type InputGroupButtonProps = ButtonProps;
export declare function InputGroupButton({ className, variant, size, disabled, ...props }: InputGroupButtonProps): import("react").JSX.Element;
