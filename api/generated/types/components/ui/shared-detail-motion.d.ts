export type SharedDetailMotionPresetId = "continuity" | "quiet" | "soft-scale" | "spring" | "reveal" | "crossfade" | "stagger" | "direct";
type Bezier = [number, number, number, number];
export type SharedDetailMotionPreset = {
    id: SharedDetailMotionPresetId;
    label: string;
    description: string;
    panelInitial: Record<string, string | number>;
    panelExit: Record<string, string | number>;
    panelTransition: {
        duration?: number;
        ease?: Bezier;
        type?: "spring";
        bounce?: number;
    };
    contentInitial: Record<string, string | number>;
    contentExit: Record<string, string | number>;
    contentTransition: {
        duration: number;
        ease: Bezier;
        delay?: number;
    };
    titleTransition: {
        duration?: number;
        ease?: Bezier;
        type?: "spring";
        bounce?: number;
    };
};
export declare const sharedDetailMotionPresets: readonly SharedDetailMotionPreset[];
export declare const selectedSharedDetailMotionPreset = "continuity";
export declare function getSharedDetailMotionPreset(id: SharedDetailMotionPresetId): SharedDetailMotionPreset;
export {};
