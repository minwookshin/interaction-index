import "../../styles/index-base.css";
import "../../styles/components/segmented-control.css";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export type SegmentedControlOption = {
  value: string;
  label: ReactNode;
  accessibleLabel?: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export type SegmentedControlProps = {
  options: readonly SegmentedControlOption[];
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | null) => void;
  allowEmpty?: boolean;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  size?: "small" | "medium";
  className?: string;
};

export function SegmentedControl({
  options,
  label,
  value,
  defaultValue,
  onValueChange,
  allowEmpty = false,
  disabled = false,
  orientation = "horizontal",
  size = "medium",
  className,
}: SegmentedControlProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? options.find((option) => !option.disabled)?.value ?? null);
  const selectedValue = value === undefined ? uncontrolledValue : value;
  const handleValueChange = (nextValues: string[]) => {
    const nextValue = nextValues[0] ?? null;
    if (!allowEmpty && nextValue === null) return;
    if (value === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <ToggleGroup
      className={cn("ix-segmented-control", className)}
      data-size={size}
      aria-label={label}
      value={selectedValue ? [selectedValue] : []}
      onValueChange={handleValueChange}
      disabled={disabled}
      orientation={orientation}
    >
      {options.map((option) => (
        <Toggle key={option.value} className="ix-segmented-control__item" value={option.value} disabled={option.disabled} aria-label={option.accessibleLabel}>
          {option.icon && <span aria-hidden="true">{option.icon}</span>}
          <span>{option.label}</span>
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
