import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import type { ReactNode } from "react";
export declare const Collapsible: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").CollapsibleRootProps, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
export type CollapsibleContentProps = CollapsiblePrimitive.Panel.Props & {
    children?: ReactNode;
};
export declare function CollapsibleTrigger({ className, children, ...props }: CollapsiblePrimitive.Trigger.Props): import("react").JSX.Element;
export declare function CollapsibleContent({ className, children, ...props }: CollapsibleContentProps): import("react").JSX.Element;
