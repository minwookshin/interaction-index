export type DataDensity = "compact" | "default" | "comfortable";
export type DataDensityControlProps = {
    value?: DataDensity;
    defaultValue?: DataDensity;
    onValueChange?: (value: DataDensity) => void;
    label?: string;
    className?: string;
};
export declare function DataDensityControl({ value, defaultValue, onValueChange, label, className }: DataDensityControlProps): import("react").JSX.Element;
