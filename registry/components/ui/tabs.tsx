import "../../styles/index-base.css";
import "../../styles/components/tabs.css";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "../../lib/cn";

export function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root className={cn("ix-tabs", className)} {...props} />;
}

export function TabsList({ className, activateOnFocus = true, ...props }: TabsPrimitive.List.Props) {
  return <TabsPrimitive.List className={cn("ix-tabs__list", className)} activateOnFocus={activateOnFocus} {...props} />;
}

export function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return <TabsPrimitive.Tab className={cn("ix-tabs__trigger", className)} {...props} />;
}

export function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel className={cn("ix-tabs__panel", className)} {...props} />;
}
