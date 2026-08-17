import { type DateValue } from "@internationalized/date";
import type { DataDateRange } from "../../lib/data-view-state";
export type DateRangePreset = {
    id: string;
    label: string;
    getValue: () => DataDateRange;
};
export type DateRangeFilterProps = {
    value: DataDateRange;
    onValueChange: (value: DataDateRange) => void;
    label?: string;
    presets?: readonly DateRangePreset[];
    minValue?: DateValue;
    maxValue?: DateValue;
    disabled?: boolean;
};
export declare function DateRangeFilter({ value, onValueChange, label, presets, minValue, maxValue, disabled, }: DateRangeFilterProps): import("react").JSX.Element;
