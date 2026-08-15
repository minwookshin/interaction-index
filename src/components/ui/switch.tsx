import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { useId } from "react";
import { cn } from "../../lib/cn";

export type SwitchProps = SwitchPrimitive.Root.Props & {
  label?: string;
  description?: string;
};

export function Switch({ className, label, description, id: providedId, "aria-describedby": ariaDescribedBy, "aria-labelledby": ariaLabelledBy, ...props }: SwitchProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const labelId = label ? `${id}-label` : undefined;
  const descriptionId = description ? `${id}-description` : undefined;
  const describedBy = [ariaDescribedBy, descriptionId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="ix-choice-row ix-choice-row--spread">
      {label && (
        <label htmlFor={id} className="ix-choice-copy">
          <span id={labelId}>{label}</span>
          {description && <small id={descriptionId}>{description}</small>}
        </label>
      )}
      <SwitchPrimitive.Root id={id} className={cn("ix-switch", className)} aria-labelledby={ariaLabelledBy ?? labelId} aria-describedby={describedBy} {...props}>
        <SwitchPrimitive.Thumb className="ix-switch__thumb" />
      </SwitchPrimitive.Root>
    </div>
  );
}
