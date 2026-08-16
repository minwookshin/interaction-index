import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
export type ProgressProps = Omit<ProgressPrimitive.Root.Props, "children"> & {
    label?: string;
    "aria-label"?: string;
    showValue?: boolean;
    size?: "small" | "medium";
    className?: string;
};
export declare function Progress({ label, "aria-label": ariaLabel, showValue, size, className, value, min, max, style, ...props }: ProgressProps): import("react").JSX.Element;
