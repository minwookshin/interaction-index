import { type ReactNode } from "react";
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
export declare function SegmentedControl({ options, label, value, defaultValue, onValueChange, allowEmpty, disabled, orientation, size, className, }: SegmentedControlProps): import("react").JSX.Element;
