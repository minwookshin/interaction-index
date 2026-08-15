import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
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
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [props["aria-describedby"], descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("ix-field", fieldClassName)} data-invalid={Boolean(error) || undefined}>
      {label && <label className="ix-field__label" htmlFor={id}>{label}</label>}
      <div className="ix-field__control">
        {leading && <span className="ix-field__adornment" aria-hidden="true">{leading}</span>}
        <input
          id={id}
          className={cn("ix-input", className)}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          {...props}
        />
        {trailing && <span className="ix-field__adornment">{trailing}</span>}
      </div>
      {description && <div id={descriptionId} className="ix-field__description">{description}</div>}
      {error && <div id={errorId} className="ix-field__error">{error}</div>}
    </div>
  );
}
