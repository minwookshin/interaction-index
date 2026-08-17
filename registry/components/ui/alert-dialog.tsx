"use client";

import "../../styles/teum-base.css";
import "../../styles/components/alert-dialog.css";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogClose = AlertDialogPrimitive.Close;
export const AlertDialogTitle = AlertDialogPrimitive.Title;
export const AlertDialogDescription = AlertDialogPrimitive.Description;

export function AlertDialogContent({ className, children, ...props }: AlertDialogPrimitive.Popup.Props) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Backdrop className="teum-dialog__backdrop" />
      <AlertDialogPrimitive.Viewport className="teum-alert-dialog__viewport">
        <AlertDialogPrimitive.Popup className={cn("teum-dialog", "teum-alert-dialog", className)} {...props} data-layer="modal">
          {children}
        </AlertDialogPrimitive.Popup>
      </AlertDialogPrimitive.Viewport>
    </AlertDialogPrimitive.Portal>
  );
}

export function AlertDialogHeader({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn("teum-dialog__header", className)} {...props} />;
}

export function AlertDialogFooter({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn("teum-dialog__footer", className)} {...props} />;
}
