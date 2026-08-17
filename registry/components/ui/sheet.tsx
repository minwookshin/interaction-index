"use client";

import "../../styles/teum-base.css";
import "../../styles/components/sheet.css";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "@phosphor-icons/react";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";
import { IconButton } from "./icon-button";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetTitle = DialogPrimitive.Title;
export const SheetDescription = DialogPrimitive.Description;

export type SheetSide = "top" | "right" | "bottom" | "left";
export type SheetContentProps = DialogPrimitive.Popup.Props & {
  side?: SheetSide;
  showClose?: boolean;
};

export function SheetContent({ className, children, side = "right", showClose = true, ...props }: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="teum-sheet__backdrop" />
      <DialogPrimitive.Viewport className="teum-sheet__viewport" data-side={side}>
        <DialogPrimitive.Popup className={cn("teum-sheet", className)} data-side={side} data-layer="modal" {...props}>
          {children}
          {showClose && (
            <DialogPrimitive.Close render={<IconButton className="teum-sheet__close" variant="ghost" size="small" aria-label="Close panel" />}>
              <X />
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn("teum-sheet__header", className)} {...props} />;
}

export function SheetBody({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn("teum-sheet__body", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn("teum-sheet__footer", className)} {...props} />;
}
