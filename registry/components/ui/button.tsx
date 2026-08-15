import "../../styles/index-base.css";
import "../../styles/components/button.css";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

export const buttonVariants = cva("ix-button", {
  variants: {
    variant: {
      primary: "ix-button--primary",
      secondary: "ix-button--secondary",
      ghost: "ix-button--ghost",
      quiet: "ix-button--quiet",
    },
    size: {
      small: "ix-button--small",
      medium: "ix-button--medium",
      large: "ix-button--large",
    },
  },
  defaultVariants: {
    variant: "secondary",
    size: "medium",
  },
});

export type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
  };

export function Button({
  className,
  variant,
  size,
  loading = false,
  leadingIcon,
  trailingIcon,
  disabled,
  focusableWhenDisabled,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      type={type}
      data-slot="button"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      focusableWhenDisabled={loading || focusableWhenDisabled}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      <span className="ix-button__content">
        {leadingIcon && <span className="ix-button__icon ix-button__icon--leading">{leadingIcon}</span>}
        <span>{children}</span>
        {trailingIcon && <span className="ix-button__icon ix-button__icon--trailing">{trailingIcon}</span>}
      </span>
      {loading && (
        <span className="ix-button__loader" aria-hidden="true">
          <span className="ix-spinner" />
        </span>
      )}
    </ButtonPrimitive>
  );
}
