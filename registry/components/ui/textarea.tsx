import "../../styles/index-base.css";
import "../../styles/components/textarea.css";
import { useId, useState, type ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export type TextareaProps = ComponentPropsWithRef<"textarea"> & {
  label?: string;
  description?: string;
  error?: string;
  showCount?: boolean;
};

export function Textarea({ id: providedId, label, description, error, showCount, maxLength, className, value, defaultValue, onChange, ref, ...props }: TextareaProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [props["aria-describedby"], descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const initialValue = value ?? defaultValue ?? "";
  const [uncontrolledCount, setUncontrolledCount] = useState(typeof initialValue === "string" ? initialValue.length : 0);
  const count = typeof value === "string" ? value.length : uncontrolledCount;

  return (
    <div className="ix-field ix-textarea-field" data-invalid={Boolean(error) || undefined}>
      {label && <label className="ix-field__label" htmlFor={id}>{label}</label>}
      <textarea
        ref={ref}
        id={id}
        className={cn("ix-input ix-textarea", className)}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={(event) => { setUncontrolledCount(event.currentTarget.value.length); onChange?.(event); }}
        {...props}
      />
      <div className="ix-textarea-field__meta">
        <span>
          {description && <span id={descriptionId} className="ix-field__description">{description}</span>}
          {error && <span id={errorId} className="ix-field__error">{error}</span>}
        </span>
        {showCount && maxLength && <output aria-label="Character count">{count}/{maxLength}</output>}
      </div>
    </div>
  );
}
