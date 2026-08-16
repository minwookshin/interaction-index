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
    <div className="teum-field teum-textarea-field" data-invalid={Boolean(error) || undefined}>
      {label && <label className="teum-field__label" htmlFor={id}>{label}</label>}
      <textarea
        ref={ref}
        id={id}
        className={cn("teum-input teum-textarea", className)}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={(event) => { setUncontrolledCount(event.currentTarget.value.length); onChange?.(event); }}
        {...props}
      />
      <div className="teum-textarea-field__meta">
        <span>
          {description && <span id={descriptionId} className="teum-field__description">{description}</span>}
          {error && <span id={errorId} className="teum-field__error">{error}</span>}
        </span>
        {showCount && maxLength && <output aria-label="Character count">{count}/{maxLength}</output>}
      </div>
    </div>
  );
}
