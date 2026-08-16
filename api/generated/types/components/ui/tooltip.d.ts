import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
export declare function TooltipProvider({ delay, ...props }: TooltipPrimitive.Provider.Props): import("react").JSX.Element;
export declare function Tooltip(props: TooltipPrimitive.Root.Props): import("react").JSX.Element;
export declare function TooltipTrigger(props: TooltipPrimitive.Trigger.Props): import("react").JSX.Element;
export type TooltipContentProps = TooltipPrimitive.Popup.Props & Pick<TooltipPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">;
export declare function TooltipContent({ className, side, sideOffset, align, alignOffset, children, ...props }: TooltipContentProps): import("react").JSX.Element;
