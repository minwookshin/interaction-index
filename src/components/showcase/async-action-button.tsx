import { ArrowRight, Check } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Button } from "../ui/button";

const MotionButton = motion.create(Button);

export type AsyncActionState = "idle" | "loading" | "success";

export type AsyncActionButtonProps = {
  compact?: boolean;
  idleLabel?: string;
  loadingLabel?: string;
  successLabel?: string;
  showIdleArrow?: boolean;
  autoResetMs?: number;
  widthBehavior?: "stable" | "morph";
  replayActivation?: "pointer" | "keyboard";
  replayKey?: number;
  resetKey?: number;
  onStateChange?: (state: AsyncActionState) => void;
};

export function AsyncActionButton({
  compact = false,
  idleLabel = "Create issue",
  loadingLabel = "Creating",
  successLabel = "Created",
  showIdleArrow = true,
  autoResetMs,
  widthBehavior = "stable",
  replayActivation = "pointer",
  replayKey = 0,
  resetKey = 0,
  onStateChange,
}: AsyncActionButtonProps) {
  const [state, setState] = useState<AsyncActionState>("idle");
  const [activation, setActivation] = useState<"pointer" | "keyboard">("pointer");
  const completionTimer = useRef<number | undefined>(undefined);
  const resetTimer = useRef<number | undefined>(undefined);
  const reduceMotion = useReducedMotion();

  const updateState = (next: AsyncActionState) => {
    setState(next);
    onStateChange?.(next);
  };

  const clearTimers = () => {
    window.clearTimeout(completionTimer.current);
    window.clearTimeout(resetTimer.current);
  };

  const start = (nextActivation: "pointer" | "keyboard") => {
    clearTimers();
    setActivation(nextActivation);
    updateState("loading");
    completionTimer.current = window.setTimeout(() => {
      updateState("success");
      if (autoResetMs === undefined) return;
      resetTimer.current = window.setTimeout(() => updateState("idle"), autoResetMs);
    }, 920);
  };

  useEffect(() => {
    clearTimers();
    updateState("idle");
  // Reset is intentionally driven by a monotonically increasing key.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    if (replayKey === 0) return;
    start(replayActivation);
  // Replay is intentionally driven by a monotonically increasing key.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replayKey]);

  useEffect(() => () => clearTimers(), []);

  const run = (event: MouseEvent<HTMLButtonElement>) => {
    if (state !== "idle") return;
    start(event.detail === 0 ? "keyboard" : "pointer");
  };

  const currentLabel = state === "loading" ? loadingLabel : state === "success" ? successLabel : idleLabel;
  const shouldMorphWidth = widthBehavior === "morph" && activation === "pointer" && !reduceMotion;
  const size = compact ? "medium" : "large";

  return (
    <div className="whatiuse-async-action" data-state={state} data-activation={activation} data-compact={compact || undefined} data-width-behavior={widthBehavior}>
      <span className="whatiuse-async-action__frame">
        {widthBehavior === "stable" && <span className="whatiuse-async-action__sizer" aria-hidden="true">
          <Button className="whatiuse-async-action__sizer-button" variant="primary" size={size} disabled trailingIcon={showIdleArrow ? <ArrowRight weight="bold" /> : undefined}>{idleLabel}</Button>
          <Button className="whatiuse-async-action__sizer-button" variant="primary" size={size} disabled leadingIcon={<span className="whatiuse-spinner" />}>{loadingLabel}</Button>
          <Button className="whatiuse-async-action__sizer-button" variant="primary" size={size} disabled leadingIcon={<Check weight="bold" />}>{successLabel}</Button>
        </span>}
        <MotionButton
          className="whatiuse-async-action__button whatiuse-async-action__morph"
          variant="primary"
          size={size}
          aria-label={idleLabel}
          layout={shouldMorphWidth ? "size" : false}
          layoutDependency={state}
          transition={shouldMorphWidth ? { type: "spring", visualDuration: 0.16, bounce: 0 } : { duration: 0 }}
          loading={state === "loading"}
          loadingLabel={loadingLabel}
          disabled={state === "success"}
          focusableWhenDisabled
          leadingIcon={state === "success" ? <Check weight="bold" /> : undefined}
          trailingIcon={state !== "success" && showIdleArrow ? <ArrowRight weight="bold" /> : undefined}
          onClick={run}
        >
          {state === "success" ? successLabel : idleLabel}
        </MotionButton>
      </span>
      <span className="whatiuse-sr-only" role="status" aria-live="polite">{state === "idle" ? "" : currentLabel}</span>
    </div>
  );
}
