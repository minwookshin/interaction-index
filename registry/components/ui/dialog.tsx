import "../../styles/teum-base.css";
import "../../styles/components/dialog.css";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "@phosphor-icons/react";
import { useRef, type ComponentPropsWithRef, type MutableRefObject, type Ref } from "react";
import { cn } from "../../lib/cn";
import { IconButton } from "./icon-button";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export type DialogContentProps = DialogPrimitive.Popup.Props & { showClose?: boolean };

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as MutableRefObject<T | null>).current = value;
}

export function DialogContent({ className, children, showClose = true, initialFocus, ref, ...props }: DialogContentProps) {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const setPopupRef = (node: HTMLDivElement | null) => {
    popupRef.current = node;
    assignRef(ref, node);
  };

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="teum-dialog__backdrop" />
      <DialogPrimitive.Popup
        ref={setPopupRef}
        className={cn("teum-dialog", className)}
        initialFocus={initialFocus ?? ((openType) => openType === "keyboard" ? true : popupRef.current)}
        {...props}
        data-layer="modal"
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close render={<IconButton className="teum-dialog__close" variant="ghost" size="small" aria-label="Close dialog" />}>
            <X />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn("teum-dialog__header", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn("teum-dialog__footer", className)} {...props} />;
}
