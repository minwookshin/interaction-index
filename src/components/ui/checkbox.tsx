import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { Check, Minus } from "@phosphor-icons/react";
import { useId } from "react";
import { cn } from "../../lib/cn";

type CheckboxProps = CheckboxPrimitive.Root.Props & {
  label?: string;
  description?: string;
};

export function Checkbox({ className, label, description, id: providedId, ...props }: CheckboxProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  return (
    <div className="ix-choice-row">
      <CheckboxPrimitive.Root id={id} className={cn("ix-checkbox", className)} {...props}>
        <CheckboxPrimitive.Indicator className="ix-checkbox__indicator">
          <Check className="ix-checkbox__check" weight="bold" />
          <Minus className="ix-checkbox__mixed" weight="bold" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label htmlFor={id} className="ix-choice-copy">
          <span>{label}</span>
          {description && <small>{description}</small>}
        </label>
      )}
    </div>
  );
}
