import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type { ComponentPropsWithRef } from "react";
export declare const Sheet: typeof DialogPrimitive.Root;
export declare const SheetTrigger: DialogPrimitive.Trigger;
export declare const SheetClose: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").AlertDialogCloseProps, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
export declare const SheetTitle: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").AlertDialogTitleProps, "ref"> & import("react").RefAttributes<HTMLHeadingElement>>;
export declare const SheetDescription: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").AlertDialogDescriptionProps, "ref"> & import("react").RefAttributes<HTMLParagraphElement>>;
export type SheetSide = "top" | "right" | "bottom" | "left";
export type SheetContentProps = DialogPrimitive.Popup.Props & {
    side?: SheetSide;
    showClose?: boolean;
};
export declare function SheetContent({ className, children, side, showClose, ...props }: SheetContentProps): import("react").JSX.Element;
export declare function SheetHeader({ className, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element;
export declare function SheetBody({ className, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element;
export declare function SheetFooter({ className, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element;
