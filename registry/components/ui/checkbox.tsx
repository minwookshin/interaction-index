import "../../styles/index-base.css";
import "../../styles/components/checkbox.css";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { Check, Minus } from "@phosphor-icons/react";
import { useId } from "react";
import { cn } from "../../lib/cn";

export type CheckboxProps = CheckboxPrimitive.Root.Props & {
  label?: string;
  description?: string;
};

export function Checkbox({ className, label, description, id: providedId, "aria-describedby": ariaDescribedBy, "aria-labelledby": ariaLabelledBy, ...props }: CheckboxProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const labelId = label ? `${id}-label` : undefined;
  const descriptionId = description ? `${id}-description` : undefined;
  const describedBy = [ariaDescribedBy, descriptionId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="ix-choice-row">
      <CheckboxPrimitive.Root id={id} className={cn("ix-checkbox", className)} aria-labelledby={ariaLabelledBy ?? labelId} aria-describedby={describedBy} {...props}>
        <CheckboxPrimitive.Indicator className="ix-checkbox__indicator">
          <Check className="ix-checkbox__check" weight="bold" />
          <Minus className="ix-checkbox__mixed" weight="bold" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label htmlFor={id} className="ix-choice-copy">
          <span id={labelId}>{label}</span>
          {description && <small id={descriptionId}>{description}</small>}
        </label>
      )}
    </div>
  );
}
