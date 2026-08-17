"use client";

import "../../styles/teum-base.css";
import "../../styles/components/select.css";
import { Check, CaretDown } from "@phosphor-icons/react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { useId } from "react";
import { cn } from "../../lib/cn";

export type SelectOption = { label: string; value: string; disabled?: boolean };

export type SelectProps = Omit<SelectPrimitive.Root.Props<string>, "children" | "items" | "aria-label"> & {
  label?: string;
  "aria-label"?: string;
  description?: string;
  error?: string;
  placeholder?: string;
  options: readonly SelectOption[];
  className?: string;
  ref?: SelectPrimitive.Trigger.Props["ref"];
};

export function Select({ label, "aria-label": ariaLabel, description, error, placeholder = "Select an option", options, className, ref, ...props }: SelectProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="teum-field teum-select-field" data-invalid={Boolean(error) || undefined}>
      <SelectPrimitive.Root items={options} {...props}>
        {label && <SelectPrimitive.Label className="teum-field__label">{label}</SelectPrimitive.Label>}
        <SelectPrimitive.Trigger ref={ref} className={cn("teum-select", className)} aria-label={label ? undefined : ariaLabel} aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined} aria-invalid={Boolean(error) || undefined}>
          <SelectPrimitive.Value className="teum-select__value" placeholder={placeholder} />
          <SelectPrimitive.Icon className="teum-select__icon"><CaretDown aria-hidden="true" /></SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Positioner className="teum-positioner" sideOffset={5} align="start" alignItemWithTrigger={false}>
            <SelectPrimitive.Popup className="teum-select-popup" data-layer="flyout">
              <SelectPrimitive.List className="teum-select-list" aria-label={`${label ?? ariaLabel ?? "Select"} options`}>
                {options.map((option) => (
                  <SelectPrimitive.Item className="teum-select-item" key={option.value} value={option.value} disabled={option.disabled}>
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator className="teum-select-item__indicator"><Check weight="bold" /></SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.List>
            </SelectPrimitive.Popup>
          </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {description && <div id={descriptionId} className="teum-field__description">{description}</div>}
      {error && <div id={errorId} className="teum-field__error">{error}</div>}
    </div>
  );
}
