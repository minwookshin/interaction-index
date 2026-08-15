import "../../styles/index-base.css";
import "../../styles/components/undo-stack.css";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { BehaviorContract } from "../../lib/behavior-contract";
import { Button } from "./button";

export const undoStackContract: BehaviorContract = {
  input: ["Registered reversible action", "Undo button", "Cmd/Ctrl+Z"],
  origin: "Each mutation registers its inverse at the moment the visible state changes.",
  enter: "A compact undo bar confirms the latest reversible action.",
  active: "The stack is last-in-first-out and exposes the latest action label.",
  exit: "Undo runs the inverse once, removes it from the stack, and announces restoration.",
  interruption: "Repeated mutations replace the visible label while retaining the full stack.",
  keyboard: ["Cmd/Ctrl+Z: undo latest", "Tab: reach Undo button", "Enter/Space: undo"],
  reducedMotion: "The bar appears without translation; recovery timing is unchanged.",
};

export type UndoAction = {
  id?: string;
  label: string;
  undo: () => void;
};

type UndoContextValue = {
  pushUndo: (action: UndoAction) => void;
  undoLatest: () => void;
  canUndo: boolean;
  latestLabel?: string;
  count: number;
};

const UndoContext = createContext<UndoContextValue | null>(null);

export function UndoStackProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<UndoAction[]>([]);
  const [announcement, setAnnouncement] = useState("");

  const pushUndo = useCallback((action: UndoAction) => {
    setStack((current) => [...current, { ...action, id: action.id ?? crypto.randomUUID() }]);
    setAnnouncement(`${action.label}. Undo available.`);
  }, []);

  const undoLatest = useCallback(() => {
    const latest = stack.at(-1);
    if (!latest) return;
    latest.undo();
    setAnnouncement(`Undid ${latest.label}`);
    setStack((current) => current.filter((action) => action.id !== latest.id));
  }, [stack]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "z" && !event.shiftKey) {
        const target = event.target as HTMLElement | null;
        if (target?.matches("input, textarea, [contenteditable='true']")) return;
        event.preventDefault();
        undoLatest();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undoLatest]);

  const value = useMemo(() => ({
    pushUndo,
    undoLatest,
    canUndo: stack.length > 0,
    latestLabel: stack.at(-1)?.label,
    count: stack.length,
  }), [pushUndo, stack, undoLatest]);

  return (
    <UndoContext.Provider value={value}>
      {children}
      <span className="ix-sr-only" aria-live="polite">{announcement}</span>
    </UndoContext.Provider>
  );
}

export function useUndoStack() {
  const context = useContext(UndoContext);
  if (!context) throw new Error("useUndoStack must be used inside UndoStackProvider");
  return context;
}

export function UndoBar() {
  const { canUndo, latestLabel, undoLatest, count } = useUndoStack();
  if (!canUndo) return null;
  return (
    <div className="ix-undo-bar" role="status">
      <span><strong>{latestLabel}</strong><small>{count > 1 ? `${count} actions in history` : "Action can be restored"}</small></span>
      <Button variant="ghost" size="small" leadingIcon={<ArrowCounterClockwise />} onClick={undoLatest}>Undo</Button>
    </div>
  );
}
