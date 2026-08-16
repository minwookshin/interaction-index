import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { type ComponentPropsWithRef } from "react";
export declare const Dialog: typeof DialogPrimitive.Root;
export declare const DialogTrigger: DialogPrimitive.Trigger;
export declare const DialogClose: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").AlertDialogCloseProps, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
export declare const DialogTitle: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").AlertDialogTitleProps, "ref"> & import("react").RefAttributes<HTMLHeadingElement>>;
export declare const DialogDescription: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").AlertDialogDescriptionProps, "ref"> & import("react").RefAttributes<HTMLParagraphElement>>;
export type DialogContentProps = DialogPrimitive.Popup.Props & {
    showClose?: boolean;
};
export declare function DialogContent({ className, children, showClose, initialFocus, ref, ...props }: DialogContentProps): import("react").JSX.Element;
export declare function DialogHeader({ className, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element;
export declare function DialogFooter({ className, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element;
