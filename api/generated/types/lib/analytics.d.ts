export type AnalyticsValue = number | null;
export type AnalyticsDatum = {
    id: string;
    label: string;
    values: Readonly<Record<string, AnalyticsValue>>;
};
export type AnalyticsSeriesTone = "primary" | "secondary" | "tertiary";
export type AnalyticsSeries = {
    id: string;
    label: string;
    tone?: AnalyticsSeriesTone;
    lineStyle?: "solid" | "dashed" | "dotted";
};
export type AnalyticsDomainOptions = {
    includeZero?: boolean;
    paddingRatio?: number;
    domain?: readonly [number, number];
};
export type AnalyticsPlotBox = {
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
};
export type AnalyticsPointPosition = {
    x: number;
    y: number;
    value: number;
};
export declare function getAnalyticsDomain(data: readonly AnalyticsDatum[], seriesIds: readonly string[], { includeZero, paddingRatio, domain }?: AnalyticsDomainOptions): readonly [number, number];
export declare function createAnalyticsTicks(domain: readonly [number, number], tickCount?: number): readonly number[];
export declare function getAnalyticsPointPosition(data: readonly AnalyticsDatum[], index: number, seriesId: string, domain: readonly [number, number], box: AnalyticsPlotBox): AnalyticsPointPosition | null;
export declare function createAnalyticsPath(data: readonly AnalyticsDatum[], seriesId: string, domain: readonly [number, number], box: AnalyticsPlotBox): string;
export declare function createAnalyticsAreaPath(data: readonly AnalyticsDatum[], seriesId: string, domain: readonly [number, number], box: AnalyticsPlotBox): string;
export declare function clampAnalyticsIndex(index: number | null | undefined, length: number): number | null;
export declare function getPercentChange(current: number, previous: number): number | null;
export declare function formatAnalyticsValue(value: number, options?: Intl.NumberFormatOptions): string;
export declare function describeAnalyticsDatum(datum: AnalyticsDatum, series: readonly AnalyticsSeries[], valueFormatter?: (value: number, series: AnalyticsSeries) => string): string;
export declare function summarizeAnalyticsSeries(data: readonly AnalyticsDatum[], series: AnalyticsSeries, valueFormatter?: (value: number, series: AnalyticsSeries) => string): string;
