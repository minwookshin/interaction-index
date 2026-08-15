import { Radio } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { useId } from "react";
import { cn } from "../../lib/cn";

export type RadioOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type RadioGroupProps = Omit<RadioGroupPrimitive.Props<string>, "children"> & {
  label: string;
  description?: string;
  error?: string;
  options: readonly RadioOption[];
  orientation?: "vertical" | "horizontal";
};

export function RadioGroup({ className, label, description, error, options, orientation = "vertical", ...props }: RadioGroupProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="ix-radio-field" data-invalid={Boolean(error) || undefined}>
      <div id={id} className="ix-radio-field__label">{label}</div>
      {description && <div id={descriptionId} className="ix-field__description">{description}</div>}
      <RadioGroupPrimitive
        aria-labelledby={id}
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
        aria-invalid={Boolean(error) || undefined}
        className={cn("ix-radio-group", `ix-radio-group--${orientation}`, className)}
        {...props}
      >
        {options.map((option) => (
          <label className="ix-radio-option" key={option.value} data-disabled={option.disabled || undefined}>
            <Radio.Root value={option.value} disabled={option.disabled} className="ix-radio">
              <Radio.Indicator className="ix-radio__indicator" />
            </Radio.Root>
            <span><strong>{option.label}</strong>{option.description && <small>{option.description}</small>}</span>
          </label>
        ))}
      </RadioGroupPrimitive>
      {error && <div id={errorId} className="ix-field__error">{error}</div>}
    </div>
  );
}
