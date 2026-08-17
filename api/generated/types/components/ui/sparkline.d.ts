import type { SVGProps } from "react";
import { type AnalyticsSeriesTone } from "../../lib/analytics";
export type SparklineProps = Omit<SVGProps<SVGSVGElement>, "children" | "width" | "height" | "fill" | "values"> & {
    values: readonly (number | null)[];
    label?: string;
    width?: number;
    height?: number;
    tone?: AnalyticsSeriesTone;
    fill?: boolean;
    decorative?: boolean;
};
export declare function Sparkline({ values, label, width, height, tone, fill, decorative, className, style, ...props }: SparklineProps): import("react").JSX.Element;
