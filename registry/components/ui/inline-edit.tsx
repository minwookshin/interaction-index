"use client";

import "../../styles/teum-base.css";
import "../../styles/components/inline-edit.css";
import { PencilSimple } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { BehaviorContract } from "../../lib/behavior-contract";
import { cn } from "../../lib/cn";

export const inlineEditContract: BehaviorContract = {
  input: ["Pointer click", "Enter from trigger", "Programmatic focus"],
  origin: "The read state remains the spatial anchor for the input.",
  enter: "A 120ms opacity swap reveals the input without moving surrounding content.",
  active: "Text is selected once; validation and async saving stay inside the same line box.",
  exit: "The saved value replaces the input and keyboard focus returns to the read state.",
  interruption: "Escape restores the prior value; save failure keeps the draft editable with an inline error.",
  keyboard: ["Enter: edit or save", "Escape: cancel", "Tab: save and continue"],
  reducedMotion: "State swaps immediately while preserving focus behavior.",
};

export type InlineEditProps = {
  value: string;
  onSave: (value: string) => void | Promise<void>;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  validate?: (value: string) => string | undefined;
};

export function InlineEdit({ value, onSave, label = "Edit value", placeholder, className, disabled, validate }: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const committingRef = useRef(false);
  const generatedId = useId();
  const errorId = `${generatedId}-error`;

  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    if (!editing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [editing]);

  const commit = async (restoreFocus = false) => {
    if (committingRef.current) return;
    committingRef.current = true;
    const next = draft.trim();
    const validationError = !next ? "A value is required." : validate?.(next);
    if (validationError) {
      setStatus("error");
      setError(validationError);
      setAnnouncement(validationError);
      committingRef.current = false;
      return;
    }
    if (next === value) {
      setEditing(false);
      setStatus("idle");
      setAnnouncement("No changes saved");
      committingRef.current = false;
      if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
      return;
    }
    setStatus("saving");
    setError("");
    try {
      await onSave(next);
      setEditing(false);
      setStatus("idle");
      setAnnouncement(`Saved ${next}`);
      committingRef.current = false;
      if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
    } catch {
      setStatus("error");
      setError("Could not save. Try again.");
      setAnnouncement("Could not save. Try again.");
      committingRef.current = false;
    }
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
    setStatus("idle");
    setError("");
    committingRef.current = false;
    setAnnouncement("Edit cancelled");
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void commit(true);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    }
  };

  return (
    <div className={cn("teum-inline-edit", className)} data-editing={editing || undefined} data-status={status}>
      {editing ? (
        <>
          <div className="teum-inline-edit__control">
            <input
              ref={inputRef}
              className="teum-inline-edit__input"
              value={draft}
              placeholder={placeholder}
              aria-label={label}
              aria-invalid={status === "error" || undefined}
              aria-describedby={error ? errorId : undefined}
              disabled={status === "saving"}
              onChange={(event) => { setDraft(event.target.value); setStatus("idle"); setError(""); }}
              onKeyDown={onKeyDown}
              onBlur={() => void commit(false)}
            />
            {status === "saving" && <span className="teum-inline-edit__saving" aria-hidden="true"><span className="teum-spinner" /></span>}
          </div>
          {error && <span id={errorId} className="teum-inline-edit__error">{error}</span>}
        </>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          className="teum-inline-edit__value"
          onClick={() => setEditing(true)}
          aria-label={`${label}: ${value}`}
          disabled={disabled}
        >
          <span>{value || placeholder}</span>
          <PencilSimple aria-hidden="true" />
        </button>
      )}
      <span className="teum-sr-only" aria-live="polite">{announcement}</span>
    </div>
  );
}
