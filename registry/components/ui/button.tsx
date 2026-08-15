import "../../styles/teum-base.css";
import "../../styles/components/button.css";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

export const buttonVariants = cva("teum-button", {
  variants: {
    variant: {
      primary: "teum-button--primary",
      secondary: "teum-button--secondary",
      ghost: "teum-button--ghost",
      quiet: "teum-button--quiet",
    },
    size: {
      small: "teum-button--small",
      medium: "teum-button--medium",
      large: "teum-button--large",
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
      <span className="teum-button__content">
        {leadingIcon && <span className="teum-button__icon teum-button__icon--leading">{leadingIcon}</span>}
        <span>{children}</span>
        {trailingIcon && <span className="teum-button__icon teum-button__icon--trailing">{trailingIcon}</span>}
      </span>
      {loading && (
        <span className="teum-button__loader" aria-hidden="true">
          <span className="teum-spinner" />
        </span>
      )}
    </ButtonPrimitive>
  );
}
