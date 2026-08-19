"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/switch.css";
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
    <div className="whatiuse-choice-row whatiuse-choice-row--spread">
      {label && (
        <label htmlFor={id} className="whatiuse-choice-copy">
          <span id={labelId}>{label}</span>
          {description && <small id={descriptionId}>{description}</small>}
        </label>
      )}
      <SwitchPrimitive.Root id={id} className={cn("whatiuse-switch", className)} aria-labelledby={ariaLabelledBy ?? labelId} aria-describedby={describedBy} {...props}>
        <SwitchPrimitive.Thumb className="whatiuse-switch__thumb" />
      </SwitchPrimitive.Root>
    </div>
  );
}
