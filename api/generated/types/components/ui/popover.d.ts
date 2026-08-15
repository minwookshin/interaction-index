import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
export declare function Popover(props: PopoverPrimitive.Root.Props): import("react").JSX.Element;
export declare function PopoverTrigger(props: PopoverPrimitive.Trigger.Props): import("react").JSX.Element;
export type PopoverContentProps = PopoverPrimitive.Popup.Props & Pick<PopoverPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">;
export declare function PopoverContent({ className, side, sideOffset, align, alignOffset, ...props }: PopoverContentProps): import("react").JSX.Element;
export declare const PopoverTitle: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").PopoverTitleProps, "ref"> & import("react").RefAttributes<HTMLHeadingElement>>;
export declare const PopoverDescription: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").PopoverDescriptionProps, "ref"> & import("react").RefAttributes<HTMLParagraphElement>>;
