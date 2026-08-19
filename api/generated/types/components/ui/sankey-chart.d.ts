import { type ReactNode } from "react";
export type SankeyNode = {
    id: string;
    label: string;
    column?: number;
};
export type SankeyLink = {
    id: string;
    source: string;
    target: string;
    value: number;
    label?: string;
};
export type SankeyChartProps = {
    title: string;
    description?: string;
    nodes: readonly SankeyNode[];
    links: readonly SankeyLink[];
    className?: string;
    height?: number;
    valueFormatter?: (value: number) => string;
    activeLinkIndex?: number | null;
    defaultActiveLinkIndex?: number | null;
    onActiveLinkIndexChange?: (index: number | null) => void;
    onLinkActivate?: (link: SankeyLink, index: number) => void;
    loading?: boolean;
    empty?: ReactNode;
    error?: ReactNode;
    showDataByDefault?: boolean;
};
export declare function SankeyChart({ title, description, nodes, links, className, height, valueFormatter, activeLinkIndex, defaultActiveLinkIndex, onActiveLinkIndexChange, onLinkActivate, loading, empty, error, showDataByDefault, }: SankeyChartProps): import("react").JSX.Element;
