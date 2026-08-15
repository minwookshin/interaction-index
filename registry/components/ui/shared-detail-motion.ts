export type SharedDetailMotionPresetId =
  | "continuity"
  | "quiet"
  | "soft-scale"
  | "spring"
  | "reveal"
  | "crossfade"
  | "stagger"
  | "direct";

type Bezier = [number, number, number, number];

export type SharedDetailMotionPreset = {
  id: SharedDetailMotionPresetId;
  label: string;
  description: string;
  panelInitial: Record<string, string | number>;
  panelExit: Record<string, string | number>;
  panelTransition: { duration?: number; ease?: Bezier; type?: "spring"; bounce?: number };
  contentInitial: Record<string, string | number>;
  contentExit: Record<string, string | number>;
  contentTransition: { duration: number; ease: Bezier; delay?: number };
  titleTransition: { duration?: number; ease?: Bezier; type?: "spring"; bounce?: number };
};

const easeOut: Bezier = [0.23, 1, 0.32, 1];
const easeInOut: Bezier = [0.77, 0, 0.175, 1];
const fluid: Bezier = [0.32, 0.72, 0, 1];

export const sharedDetailMotionPresets: readonly SharedDetailMotionPreset[] = [
  {
    id: "continuity",
    label: "Continuity",
    description: "Selected. Crisp panel travel with a softer shared-title handoff.",
    panelInitial: { opacity: 0, transform: "translateX(8px)" },
    panelExit: { opacity: 0, transform: "translateX(5px)" },
    panelTransition: { duration: 0.18, ease: fluid },
    contentInitial: { opacity: 0, transform: "translateY(2px)" },
    contentExit: { opacity: 0 },
    contentTransition: { duration: 0.14, ease: easeOut, delay: 0.02 },
    titleTransition: { type: "spring", duration: 0.26, bounce: 0.04 },
  },
  {
    id: "quiet",
    label: "Quiet slide",
    description: "Short travel and no decorative softness.",
    panelInitial: { opacity: 0, transform: "translateX(8px)" },
    panelExit: { opacity: 0, transform: "translateX(6px)" },
    panelTransition: { duration: 0.16, ease: easeOut },
    contentInitial: { opacity: 0 },
    contentExit: { opacity: 0 },
    contentTransition: { duration: 0.12, ease: easeOut },
    titleTransition: { duration: 0.18, ease: easeInOut },
  },
  {
    id: "soft-scale",
    label: "Soft scale",
    description: "A compact reveal that feels slightly more dimensional.",
    panelInitial: { opacity: 0, transform: "translateX(8px) scale(0.99)" },
    panelExit: { opacity: 0, transform: "translateX(5px) scale(0.995)" },
    panelTransition: { duration: 0.2, ease: easeOut },
    contentInitial: { opacity: 0, transform: "translateY(3px)" },
    contentExit: { opacity: 0 },
    contentTransition: { duration: 0.15, ease: easeOut, delay: 0.03 },
    titleTransition: { duration: 0.22, ease: easeInOut },
  },
  {
    id: "spring",
    label: "Spring",
    description: "Interruptible movement with restrained physicality.",
    panelInitial: { opacity: 0, transform: "translateX(16px)" },
    panelExit: { opacity: 0, transform: "translateX(10px)" },
    panelTransition: { type: "spring", duration: 0.28, bounce: 0.08 },
    contentInitial: { opacity: 0, transform: "translateY(5px)" },
    contentExit: { opacity: 0, transform: "translateY(-3px)" },
    contentTransition: { duration: 0.17, ease: easeOut, delay: 0.035 },
    titleTransition: { type: "spring", duration: 0.28, bounce: 0.1 },
  },
  {
    id: "reveal",
    label: "Edge reveal",
    description: "The detail surface is clipped from its attachment edge.",
    panelInitial: { opacity: 0.65, clipPath: "inset(0 0 0 10%)", transform: "translateX(6px)" },
    panelExit: { opacity: 0, clipPath: "inset(0 0 0 6%)", transform: "translateX(5px)" },
    panelTransition: { duration: 0.21, ease: easeOut },
    contentInitial: { opacity: 0 },
    contentExit: { opacity: 0 },
    contentTransition: { duration: 0.14, ease: easeOut, delay: 0.04 },
    titleTransition: { duration: 0.22, ease: easeInOut },
  },
  {
    id: "crossfade",
    label: "Crossfade",
    description: "Motion-minimal study for maximum calm.",
    panelInitial: { opacity: 0 },
    panelExit: { opacity: 0 },
    panelTransition: { duration: 0.17, ease: easeOut },
    contentInitial: { opacity: 0, filter: "blur(1px)" },
    contentExit: { opacity: 0, filter: "blur(1px)" },
    contentTransition: { duration: 0.15, ease: easeOut },
    titleTransition: { duration: 0.18, ease: easeInOut },
  },
  {
    id: "stagger",
    label: "Stagger",
    description: "Panel arrives first, then its detail content follows.",
    panelInitial: { opacity: 0, transform: "translateX(12px)" },
    panelExit: { opacity: 0, transform: "translateX(7px)" },
    panelTransition: { duration: 0.2, ease: fluid },
    contentInitial: { opacity: 0, transform: "translateY(6px)" },
    contentExit: { opacity: 0, transform: "translateY(-2px)" },
    contentTransition: { duration: 0.18, ease: easeOut, delay: 0.065 },
    titleTransition: { duration: 0.24, ease: easeInOut },
  },
  {
    id: "direct",
    label: "Direct",
    description: "Fastest study for keyboard-heavy repetition.",
    panelInitial: { opacity: 0, transform: "translateX(4px)" },
    panelExit: { opacity: 0 },
    panelTransition: { duration: 0.1, ease: easeOut },
    contentInitial: { opacity: 0 },
    contentExit: { opacity: 0 },
    contentTransition: { duration: 0.08, ease: easeOut },
    titleTransition: { duration: 0.11, ease: easeInOut },
  },
] as const;

export const selectedSharedDetailMotionPreset = "continuity" satisfies SharedDetailMotionPresetId;

export function getSharedDetailMotionPreset(id: SharedDetailMotionPresetId) {
  return sharedDetailMotionPresets.find((preset) => preset.id === id) ?? sharedDetailMotionPresets[0];
}
