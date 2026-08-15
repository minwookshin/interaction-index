import "../../styles/index-base.css";
import "../../styles/components/context-switcher.css";
import { CaretUpDown, Check } from "@phosphor-icons/react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type ContextSwitcherOption = {
  value: string;
  label: string;
  description: string;
  icon: ReactNode;
  disabled?: boolean;
};

export type ContextSwitcherProps = Omit<SelectPrimitive.Root.Props<string>, "children" | "items"> & {
  options: readonly ContextSwitcherOption[];
  "aria-label": string;
  placeholder?: string;
  className?: string;
  ref?: SelectPrimitive.Trigger.Props["ref"];
};

export function ContextSwitcher({
  options,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  "aria-label": ariaLabel,
  disabled,
  highlightItemOnHover = true,
  placeholder = "Choose context",
  className,
  ref,
  ...rootProps
}: ContextSwitcherProps) {
  const fallbackValue = options.find((option) => !option.disabled)?.value ?? null;
  return (
    <SelectPrimitive.Root
      items={options.map((option) => ({ label: option.label, value: option.value }))}
      value={value}
      defaultValue={defaultValue === undefined ? fallbackValue : defaultValue}
      onValueChange={onValueChange}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      highlightItemOnHover={highlightItemOnHover}
      {...rootProps}
    >
      <SelectPrimitive.Trigger ref={ref} className={cn("ix-context-switcher", className)} aria-label={ariaLabel}>
        <SelectPrimitive.Value className="ix-context-switcher__value">
          {(selectedValue) => {
            const selected = options.find((option) => option.value === selectedValue);
            if (!selectedValue || !selected) return <span className="ix-context-switcher__label" data-placeholder>{placeholder}</span>;
            return (
              <>
                <span className="ix-context-switcher__icon" aria-hidden="true">{selected.icon}</span>
                <span className="ix-context-switcher__label">{selected.label}</span>
              </>
            );
          }}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon className="ix-context-switcher__chevron"><CaretUpDown aria-hidden="true" /></SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner className="ix-positioner" sideOffset={4} align="start" alignItemWithTrigger={false}>
          <SelectPrimitive.Popup className="ix-context-switcher__popup" data-layer="flyout">
            <SelectPrimitive.List className="ix-context-switcher__list" aria-label={`${ariaLabel} options`}>
              {options.map((option) => (
                <SelectPrimitive.Item className="ix-context-switcher__item" key={option.value} value={option.value} disabled={option.disabled}>
                  <span className="ix-context-switcher__item-icon" aria-hidden="true">{option.icon}</span>
                  <span className="ix-context-switcher__copy">
                    <SelectPrimitive.ItemText className="ix-context-switcher__item-label">{option.label}</SelectPrimitive.ItemText>
                    <span className="ix-context-switcher__description">{option.description}</span>
                  </span>
                  <SelectPrimitive.ItemIndicator className="ix-context-switcher__indicator"><Check weight="bold" aria-hidden="true" /></SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
