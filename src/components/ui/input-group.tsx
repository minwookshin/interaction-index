import { createContext, useContext, type ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";
import { Button, type ButtonProps } from "./button";

export type InputGroupProps = ComponentPropsWithRef<"div"> & {
  invalid?: boolean;
  disabled?: boolean;
};

type InputGroupContextValue = {
  invalid: boolean;
  disabled: boolean;
};

const InputGroupContext = createContext<InputGroupContextValue>({ invalid: false, disabled: false });

export function InputGroup({ className, invalid, disabled, ...props }: InputGroupProps) {
  return (
    <InputGroupContext.Provider value={{ invalid: Boolean(invalid), disabled: Boolean(disabled) }}>
      <div
        className={cn("teum-input-group", className)}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        {...props}
      />
    </InputGroupContext.Provider>
  );
}

export type InputGroupInputProps = ComponentPropsWithRef<"input">;

export function InputGroupInput({ className, disabled, "aria-invalid": ariaInvalid, ...props }: InputGroupInputProps) {
  const group = useContext(InputGroupContext);
  return (
    <input
      className={cn("teum-input-group__input", className)}
      disabled={disabled ?? group.disabled}
      aria-invalid={ariaInvalid ?? (group.invalid || undefined)}
      {...props}
    />
  );
}

export type InputGroupAddonProps = ComponentPropsWithRef<"span"> & {
  side?: "start" | "end";
};

export function InputGroupAddon({ className, side = "start", ...props }: InputGroupAddonProps) {
  return <span className={cn("teum-input-group__addon", className)} data-side={side} {...props} />;
}

export type InputGroupButtonProps = ButtonProps;

export function InputGroupButton({ className, variant = "ghost", size = "small", disabled, ...props }: InputGroupButtonProps) {
  const group = useContext(InputGroupContext);
  return <Button className={cn("teum-input-group__button", className)} variant={variant} size={size} disabled={disabled ?? group.disabled} {...props} />;
}
