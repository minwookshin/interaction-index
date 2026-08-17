"use client";

import "../../styles/teum-base.css";
import "../../styles/components/text-field.css";
import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export type TextFieldProps = Omit<ComponentPropsWithRef<"input">, "size"> & {
  label?: string;
  description?: string;
  error?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  fieldClassName?: string;
};

export function TextField({
  id: providedId,
  label,
  description,
  error,
  leading,
  trailing,
  className,
  fieldClassName,
  ref,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [props["aria-describedby"], descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("teum-field", fieldClassName)} data-invalid={Boolean(error) || undefined}>
      {label && <label className="teum-field__label" htmlFor={id}>{label}</label>}
      <div className="teum-field__control">
        {leading && <span className="teum-field__adornment" aria-hidden="true">{leading}</span>}
        <input
          ref={ref}
          id={id}
          className={cn("teum-input", className)}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          {...props}
        />
        {trailing && <span className="teum-field__adornment">{trailing}</span>}
      </div>
      {description && <div id={descriptionId} className="teum-field__description">{description}</div>}
      {error && <div id={errorId} className="teum-field__error">{error}</div>}
    </div>
  );
}
