import { type ReactNode } from "react";
import { type AnalyticsSeriesTone } from "../../lib/analytics";
export type DonutChartDatum = {
    id: string;
    label: string;
    value: number;
    tone?: AnalyticsSeriesTone;
};
export type DonutChartProps = {
    title: string;
    description?: string;
    data: readonly DonutChartDatum[];
    className?: string;
    valueFormatter?: (value: number, datum: DonutChartDatum) => string;
    centerLabel?: string;
    centerValue?: ReactNode;
    activeId?: string | null;
    defaultActiveId?: string | null;
    onActiveIdChange?: (id: string | null) => void;
    onDatumActivate?: (datum: DonutChartDatum) => void;
    loading?: boolean;
    empty?: ReactNode;
    error?: ReactNode;
    showDataByDefault?: boolean;
};
export declare function DonutChart({ title, description, data, className, valueFormatter, centerLabel, centerValue, activeId, defaultActiveId, onActiveIdChange, onDatumActivate, loading, empty, error, showDataByDefault, }: DonutChartProps): import("react").JSX.Element;
