import type { HTMLAttributes, ReactNode } from "react";
export type FunnelStage = {
    id: string;
    label: string;
    value: number;
    detail?: ReactNode;
};
export type FunnelProps = Omit<HTMLAttributes<HTMLOListElement>, "onSelect"> & {
    label: string;
    stages: readonly FunnelStage[];
    formatter?: (value: number, stage: FunnelStage) => string;
    selectedId?: string;
    onSelect?: (stage: FunnelStage) => void;
};
export declare function Funnel({ label, stages, formatter, selectedId, onSelect, className, ...props }: FunnelProps): import("react").JSX.Element;
