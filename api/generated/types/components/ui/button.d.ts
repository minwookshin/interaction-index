import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";
export declare const buttonVariants: (props?: ({
    variant?: "primary" | "secondary" | "ghost" | "quiet" | null | undefined;
    size?: "small" | "medium" | "large" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    loadingLabel?: ReactNode;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
};
export declare function Button({ className, variant, size, loading, loadingLabel, leadingIcon, trailingIcon, disabled, focusableWhenDisabled, children, type, ...props }: ButtonProps): import("react").JSX.Element;
