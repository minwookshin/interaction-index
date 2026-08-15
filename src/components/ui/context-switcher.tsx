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

export type ContextSwitcherProps = {
  options: readonly ContextSwitcherOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  "aria-label": string;
  disabled?: boolean;
  className?: string;
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
  className,
}: ContextSwitcherProps) {
  return (
    <SelectPrimitive.Root
      items={options.map((option) => ({ label: option.label, value: option.value }))}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(nextValue) => onValueChange?.(nextValue)}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
      disabled={disabled}
      highlightItemOnHover={false}
    >
      <SelectPrimitive.Trigger className={cn("ix-context-switcher", className)} aria-label={ariaLabel}>
        <SelectPrimitive.Value className="ix-context-switcher__value">
          {(selectedValue) => {
            const selected = options.find((option) => option.value === selectedValue) ?? options[0];
            if (!selected) return null;
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
            <SelectPrimitive.List className="ix-context-switcher__list">
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
