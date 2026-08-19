import { cn } from "../../lib/cn";
import { SegmentedControl, type SegmentedControlOption } from "./segmented-control";

export type DataDensity = "compact" | "default" | "comfortable";

export type DataDensityControlProps = {
  value?: DataDensity;
  defaultValue?: DataDensity;
  onValueChange?: (value: DataDensity) => void;
  label?: string;
  className?: string;
};

const densityOptions: readonly SegmentedControlOption[] = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
];

export function DataDensityControl({ value, defaultValue = "default", onValueChange, label = "Row density", className }: DataDensityControlProps) {
  return (
    <div className={cn("whatiuse-data-density-control", className)}>
      <SegmentedControl
        label={label}
        options={densityOptions}
        value={value}
        defaultValue={defaultValue}
        size="small"
        onValueChange={(nextValue) => {
          if (nextValue) onValueChange?.(nextValue as DataDensity);
        }}
      />
    </div>
  );
}
