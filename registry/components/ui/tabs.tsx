import "../../styles/teum-base.css";
import "../../styles/components/tabs.css";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "../../lib/cn";

export function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root className={cn("teum-tabs", className)} {...props} />;
}

export function TabsList({ className, activateOnFocus = true, ...props }: TabsPrimitive.List.Props) {
  return <TabsPrimitive.List className={cn("teum-tabs__list", className)} activateOnFocus={activateOnFocus} {...props} />;
}

export function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return <TabsPrimitive.Tab className={cn("teum-tabs__trigger", className)} {...props} />;
}

export function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel className={cn("teum-tabs__panel", className)} {...props} />;
}
