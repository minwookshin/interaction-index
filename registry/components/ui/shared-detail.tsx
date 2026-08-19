"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/shared-detail.css";
import { ArrowLeft, X } from "@phosphor-icons/react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { BehaviorContract } from "../../lib/behavior-contract";
import { cn } from "../../lib/cn";
import { IconButton } from "./icon-button";
import { getSharedDetailMotionPreset, selectedSharedDetailMotionPreset, type SharedDetailMotionPresetId } from "./shared-detail-motion";

export {
  getSharedDetailMotionPreset,
  selectedSharedDetailMotionPreset,
  sharedDetailMotionPresets,
  type SharedDetailMotionPreset,
  type SharedDetailMotionPresetId,
} from "./shared-detail-motion";

export const sharedDetailContract: BehaviorContract = {
  input: ["Row click", "Enter on row", "Close button", "Escape"],
  origin: "The selected row title is the visual and focus origin for the detail surface.",
  enter: "Pointer activation uses title continuity and a 180ms panel reveal; keyboard activation is direct.",
  active: "The non-modal detail is a labelled region; focus enters the region without triggering a tooltip.",
  exit: "The panel contracts toward the selected row before the row trigger regains focus.",
  interruption: "A second selection retargets the shared element without stacking panels.",
  keyboard: ["Enter/Space: open", "Escape: close", "Tab: navigate detail controls"],
  reducedMotion: "A 120ms opacity transition replaces travel and shared-layout movement; focus origin remains explicit.",
};

const reducedMotionTransition = { duration: 0.12, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] };

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

export function SharedDetail({
  items,
  className,
  selectedId: selectedIdProp,
  defaultSelectedId,
  onSelectedIdChange,
  motionPreset = selectedSharedDetailMotionPreset,
  focusOnOpen = true,
  regionLabel,
  renderDetail,
}: SharedDetailProps) {
  const [uncontrolledSelectedId, setUncontrolledSelectedId] = useState<string | null>(defaultSelectedId ?? null);
  const [keyboardInvoked, setKeyboardInvoked] = useState(false);
  const selectedId = selectedIdProp === undefined ? uncontrolledSelectedId : selectedIdProp;
  const selected = items.find((item) => item.id === selectedId);
  const originRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const interactedRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const layoutGroupId = useId();
  const panelId = (itemId: string) => `${layoutGroupId}-detail-panel-${itemId}`;
  const titleId = (itemId: string) => `${layoutGroupId}-detail-title-${itemId}`;
  const preset = getSharedDetailMotionPreset(motionPreset);
  const motionMode = keyboardInvoked ? "direct" : reduceMotion ? "reduced" : "full";
  const spatialMotion = motionMode === "full";
  const panelInitial = motionMode === "direct" ? false : motionMode === "reduced" ? { opacity: 0 } : preset.panelInitial;
  const panelExit = motionMode === "full" ? preset.panelExit : { opacity: 0 };
  const panelTransition = motionMode === "direct" ? { duration: 0 } : motionMode === "reduced" ? reducedMotionTransition : preset.panelTransition;
  const contentInitial = motionMode === "direct" ? false : motionMode === "reduced" ? { opacity: 0 } : preset.contentInitial;
  const contentExit = motionMode === "full" ? preset.contentExit : { opacity: 0 };
  const contentTransition = motionMode === "direct" ? { duration: 0 } : motionMode === "reduced" ? reducedMotionTransition : preset.contentTransition;

  const setSelectedId = (id: string | null) => {
    if (selectedIdProp === undefined) setUncontrolledSelectedId(id);
    onSelectedIdChange?.(id);
  };

  const close = () => {
    setSelectedId(null);
    requestAnimationFrame(() => originRef.current?.focus({ preventScroll: true }));
  };

  useEffect(() => {
    if (!selected) return;
    if (focusOnOpen && interactedRef.current) requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) { event.preventDefault(); close(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <LayoutGroup id={layoutGroupId}>
      <div className={cn("whatiuse-shared-detail", className)} data-open={Boolean(selected) || undefined} data-motion-preset={motionPreset} data-motion-mode={motionMode}>
        <div className="whatiuse-shared-detail__list" aria-label="Objects">
          {items.map((item) => (
            <button
              type="button"
              key={item.id}
              className="whatiuse-shared-detail__row"
              aria-expanded={selectedId === item.id}
              aria-controls={selectedId === item.id ? panelId(item.id) : undefined}
              onClick={(event) => {
                interactedRef.current = true;
                originRef.current = event.currentTarget;
                setKeyboardInvoked(event.detail === 0);
                setSelectedId(item.id);
              }}
            >
              <span className="whatiuse-shared-detail__dot" aria-hidden="true" />
              <span className="whatiuse-shared-detail__row-copy" data-title={item.title}>
                <motion.span layout={spatialMotion ? "position" : false} layoutId={spatialMotion ? titleId(item.id) : undefined} transition={spatialMotion ? preset.titleTransition : { duration: 0 }}>{item.title}</motion.span>
                <small>{item.meta}</small>
              </span>
              {item.status && <span className="whatiuse-shared-detail__status">{item.status}</span>}
            </button>
          ))}
        </div>
        <AnimatePresence initial={false}>
          {selected && (
            <motion.aside
              ref={panelRef}
              id={panelId(selected.id)}
              className="whatiuse-shared-detail__panel"
              role="region"
              tabIndex={-1}
              aria-label={regionLabel}
              aria-labelledby={regionLabel ? undefined : titleId(selected.id)}
              initial={panelInitial}
              animate={{ opacity: 1, transform: "translateX(0px) scale(1)", clipPath: "inset(0 0 0 0)", filter: "blur(0px)" }}
              exit={panelExit}
              transition={panelTransition}
            >
              <div className="whatiuse-shared-detail__toolbar">
                <IconButton className="whatiuse-shared-detail__back" variant="ghost" size="small" aria-label="Back to list" tooltip="Back" onClick={close}><ArrowLeft /></IconButton>
                <IconButton variant="ghost" size="small" aria-label="Close detail" tooltip="Close" onClick={close}><X /></IconButton>
              </div>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={selected.id}
                  className="whatiuse-shared-detail__content"
                  initial={contentInitial}
                  animate={{ opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }}
                  exit={contentExit}
                  transition={contentTransition}
                >
                  <motion.h3 layout={spatialMotion ? "position" : false} id={titleId(selected.id)} layoutId={spatialMotion ? titleId(selected.id) : undefined} transition={spatialMotion ? preset.titleTransition : { duration: 0 }}>{selected.title}</motion.h3>
                  <div className="whatiuse-shared-detail__meta">{selected.meta}</div>
                  {renderDetail ? renderDetail(selected) : <><p>{selected.description}</p><dl><div><dt>Status</dt><dd>{selected.status ?? "Open"}</dd></div><div><dt>Interaction</dt><dd>Shared detail</dd></div></dl></>}
                </motion.div>
              </AnimatePresence>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
