export type TeumMotionFrequency = "constant" | "frequent" | "occasional" | "rare";

export type TeumMotionRule = {
  frequency: TeumMotionFrequency;
  treatment: "instant" | "tonal" | "spatial" | "expressive";
  rationale: string;
};

export const teumMotionContract = {
  version: "1.0.0",
  principles: [
    "Respond at the moment of input.",
    "Use motion only to explain origin, continuity, state, or recovery.",
    "Keep repeated keyboard paths instant.",
    "Let interrupted transitions retarget instead of restarting.",
    "Remove spatial travel when reduced motion is requested.",
  ],
  frequency: {
    constant: {
      frequency: "constant",
      treatment: "instant",
      rationale: "Keyboard navigation, sorting, selection, and repeated commands must never wait for choreography.",
    },
    frequent: {
      frequency: "frequent",
      treatment: "tonal",
      rationale: "Hover, row navigation, and compact controls use short color or surface feedback only.",
    },
    occasional: {
      frequency: "occasional",
      treatment: "spatial",
      rationale: "Flyouts, detail surfaces, dialogs, and recovery feedback may clarify where a change came from.",
    },
    rare: {
      frequency: "rare",
      treatment: "expressive",
      rationale: "First-run or explanatory moments may carry more character without delaying the task.",
    },
  } satisfies Record<TeumMotionFrequency, TeumMotionRule>,
  durationMs: {
    press: 110,
    hover: 120,
    tooltip: 140,
    flyoutEnter: 160,
    flyoutExit: 120,
    modalEnter: 220,
    modalExit: 160,
    sharedDetail: 180,
    toast: 180,
  },
  easing: {
    out: [0.23, 1, 0.32, 1] as const,
    inOut: [0.77, 0, 0.175, 1] as const,
    drawer: [0.32, 0.72, 0, 1] as const,
  },
  constraints: {
    pressScale: 0.98,
    minimumEntryScale: 0.95,
    maxRoutineDurationMs: 300,
    animateProperties: ["transform", "opacity", "color", "background-color", "border-color"] as const,
    forbiddenPatterns: [
      "scale(0) entrances",
      "ease-in for interface feedback",
      "transition: all",
      "decorative bounce in product workflows",
      "layout movement for sorting or selection",
    ] as const,
  },
} as const;

export type TeumMotionContract = typeof teumMotionContract;
