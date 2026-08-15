import "../../styles/index-base.css";
import "../../styles/components/switch.css";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { useId } from "react";
import { cn } from "../../lib/cn";

type SwitchProps = SwitchPrimitive.Root.Props & {
  label?: string;
  description?: string;
};

export function Switch({ className, label, description, id: providedId, ...props }: SwitchProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  return (
    <div className="ix-choice-row ix-choice-row--spread">
      {label && (
        <label htmlFor={id} className="ix-choice-copy">
          <span>{label}</span>
          {description && <small>{description}</small>}
        </label>
      )}
      <SwitchPrimitive.Root id={id} className={cn("ix-switch", className)} {...props}>
        <SwitchPrimitive.Thumb className="ix-switch__thumb" />
      </SwitchPrimitive.Root>
    </div>
  );
}
