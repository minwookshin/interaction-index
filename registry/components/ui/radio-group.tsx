"use client";

import "../../styles/teum-base.css";
import "../../styles/components/radio-group.css";
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
    <div className="teum-radio-field" data-invalid={Boolean(error) || undefined}>
      <div id={id} className="teum-radio-field__label">{label}</div>
      {description && <div id={descriptionId} className="teum-field__description">{description}</div>}
      <RadioGroupPrimitive
        aria-labelledby={id}
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
        aria-invalid={Boolean(error) || undefined}
        className={cn("teum-radio-group", `teum-radio-group--${orientation}`, className)}
        {...props}
      >
        {options.map((option) => (
          <label className="teum-radio-option" key={option.value} data-disabled={option.disabled || undefined}>
            <Radio.Root value={option.value} disabled={option.disabled} className="teum-radio">
              <Radio.Indicator className="teum-radio__indicator" />
            </Radio.Root>
            <span><strong>{option.label}</strong>{option.description && <small>{option.description}</small>}</span>
          </label>
        ))}
      </RadioGroupPrimitive>
      {error && <div id={errorId} className="teum-field__error">{error}</div>}
    </div>
  );
}
