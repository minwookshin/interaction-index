import { type ReactNode } from "react";
export declare const analyticsClassNames: {
    readonly interactivePlot: "whatiuse-analytics-interactive-plot";
};
export type AnalyticsFrameProps = {
    title: string;
    description?: string;
    summary: string;
    plotLabel: string;
    plot: ReactNode;
    table: ReactNode;
    className?: string;
    height?: number;
    loading?: boolean;
    empty?: ReactNode;
    error?: ReactNode;
    activeDescription?: string;
    inspection?: ReactNode;
    showDataByDefault?: boolean;
};
export type AnalyticsInspectionItem = {
    id: string;
    label: ReactNode;
    value?: ReactNode;
    tone?: string;
};
export type AnalyticsInspectionProps = {
    label: ReactNode;
    items?: readonly AnalyticsInspectionItem[];
    active?: boolean;
    className?: string;
};
export declare function AnalyticsInspection({ label, items, active, className }: AnalyticsInspectionProps): import("react").JSX.Element;
export declare function AnalyticsFrame({ title, description, summary, plotLabel, plot, table, className, height, loading, empty, error, activeDescription, inspection, showDataByDefault, }: AnalyticsFrameProps): import("react").JSX.Element;
export type AnalyticsActiveIndexOptions = {
    length: number;
    value?: number | null;
    defaultValue?: number | null;
    onChange?: (index: number | null) => void;
};
export declare function useAnalyticsActiveIndex({ length, value, defaultValue, onChange }: AnalyticsActiveIndexOptions): {
    readonly activeIndex: number | null;
    readonly setActiveIndex: (next: number | null) => void;
    readonly scheduleActiveIndex: (next: number | null) => void;
    readonly clearActiveIndex: () => void;
};
export declare function getLinearAnalyticsKeyIndex(key: string, activeIndex: number | null, length: number): number | null | undefined;
