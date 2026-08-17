export type TeumMotionFrequency = "constant" | "frequent" | "occasional" | "rare";
export type TeumMotionRule = {
    frequency: TeumMotionFrequency;
    treatment: "instant" | "tonal" | "spatial" | "expressive";
    rationale: string;
};
export declare const teumMotionContract: {
    readonly version: "1.0.0";
    readonly principles: readonly ["Respond at the moment of input.", "Use motion only to explain origin, continuity, state, or recovery.", "Keep repeated keyboard paths instant.", "Let interrupted transitions retarget instead of restarting.", "Remove spatial travel when reduced motion is requested."];
    readonly frequency: {
        constant: {
            frequency: "constant";
            treatment: "instant";
            rationale: string;
        };
        frequent: {
            frequency: "frequent";
            treatment: "tonal";
            rationale: string;
        };
        occasional: {
            frequency: "occasional";
            treatment: "spatial";
            rationale: string;
        };
        rare: {
            frequency: "rare";
            treatment: "expressive";
            rationale: string;
        };
    };
    readonly durationMs: {
        readonly press: 110;
        readonly hover: 120;
        readonly tooltip: 140;
        readonly flyoutEnter: 160;
        readonly flyoutExit: 120;
        readonly modalEnter: 220;
        readonly modalExit: 160;
        readonly sharedDetail: 180;
        readonly toast: 180;
    };
    readonly easing: {
        readonly out: readonly [0.23, 1, 0.32, 1];
        readonly inOut: readonly [0.77, 0, 0.175, 1];
        readonly drawer: readonly [0.32, 0.72, 0, 1];
    };
    readonly constraints: {
        readonly pressScale: 0.98;
        readonly minimumEntryScale: 0.95;
        readonly maxRoutineDurationMs: 300;
        readonly animateProperties: readonly ["transform", "opacity", "color", "background-color", "border-color"];
        readonly forbiddenPatterns: readonly ["scale(0) entrances", "ease-in for interface feedback", "transition: all", "decorative bounce in product workflows", "layout movement for sorting or selection"];
    };
};
export type TeumMotionContract = typeof teumMotionContract;
