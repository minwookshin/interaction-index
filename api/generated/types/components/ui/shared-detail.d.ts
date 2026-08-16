import { type ReactNode } from "react";
import type { BehaviorContract } from "../../lib/behavior-contract";
import { type SharedDetailMotionPresetId } from "./shared-detail-motion";
export { getSharedDetailMotionPreset, selectedSharedDetailMotionPreset, sharedDetailMotionPresets, type SharedDetailMotionPreset, type SharedDetailMotionPresetId, } from "./shared-detail-motion";
export declare const sharedDetailContract: BehaviorContract;
export type SharedDetailItem = {
    id: string;
    title: string;
    meta: string;
    description: string;
    status?: string;
};
export type SharedDetailProps = {
    items: readonly SharedDetailItem[];
    className?: string;
    selectedId?: string | null;
    defaultSelectedId?: string;
    onSelectedIdChange?: (id: string | null) => void;
    motionPreset?: SharedDetailMotionPresetId;
    focusOnOpen?: boolean;
    regionLabel?: string;
    renderDetail?: (item: SharedDetailItem) => ReactNode;
};
export declare function SharedDetail({ items, className, selectedId: selectedIdProp, defaultSelectedId, onSelectedIdChange, motionPreset, focusOnOpen, regionLabel, renderDetail, }: SharedDetailProps): import("react").JSX.Element;
