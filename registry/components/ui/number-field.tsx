"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/number-field.css";
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { Minus, Plus } from "@phosphor-icons/react";
import { useId, type ReactNode } from "react";
import { cn } from "../../lib/cn";

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

export function NumberField({
  id: providedId,
  label,
  description,
  error,
  suffix,
  className,
  inputClassName,
  inputProps,
  ...props
}: NumberFieldProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const accessibleLabel = label ?? inputProps?.["aria-label"] ?? "Value";

  return (
    <NumberFieldPrimitive.Root id={id} className={cn("whatiuse-number-field", className)} data-invalid={Boolean(error) || undefined} {...props}>
      {label && <label className="whatiuse-field__label" htmlFor={id}>{label}</label>}
      <NumberFieldPrimitive.Group className="whatiuse-number-field__group">
        <NumberFieldPrimitive.Decrement className="whatiuse-number-field__step" aria-label={`Decrease ${accessibleLabel}`}><Minus /></NumberFieldPrimitive.Decrement>
        <NumberFieldPrimitive.Input className={cn("whatiuse-number-field__input", inputClassName)} aria-invalid={Boolean(error) || undefined} aria-describedby={describedBy} {...inputProps} />
        {suffix && <span className="whatiuse-number-field__suffix" aria-hidden="true">{suffix}</span>}
        <NumberFieldPrimitive.Increment className="whatiuse-number-field__step" aria-label={`Increase ${accessibleLabel}`}><Plus /></NumberFieldPrimitive.Increment>
      </NumberFieldPrimitive.Group>
      {description && <div id={descriptionId} className="whatiuse-field__description">{description}</div>}
      {error && <div id={errorId} className="whatiuse-field__error">{error}</div>}
    </NumberFieldPrimitive.Root>
  );
}
