"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/button.css";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

export const buttonVariants = cva("whatiuse-button", {
  variants: {
    variant: {
      primary: "whatiuse-button--primary",
      secondary: "whatiuse-button--secondary",
      ghost: "whatiuse-button--ghost",
      quiet: "whatiuse-button--quiet",
    },
    size: {
      small: "whatiuse-button--small",
      medium: "whatiuse-button--medium",
      large: "whatiuse-button--large",
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
    loadingLabel?: ReactNode;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
  };

export function Button({
  className,
  variant,
  size,
  loading = false,
  loadingLabel,
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
      <span className="whatiuse-button__content">
        {leadingIcon && <span className="whatiuse-button__icon whatiuse-button__icon--leading">{leadingIcon}</span>}
        <span>{children}</span>
        {trailingIcon && <span className="whatiuse-button__icon whatiuse-button__icon--trailing">{trailingIcon}</span>}
      </span>
      <span className="whatiuse-button__loader" aria-hidden="true" data-visible={loading || undefined}>
        <span className="whatiuse-spinner" />
        {loadingLabel && <span className="whatiuse-button__loading-label">{loadingLabel}</span>}
      </span>
    </ButtonPrimitive>
  );
}
