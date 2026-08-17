"use client";

import "../../styles/teum-base.css";
import "../../styles/components/collapsible.css";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { CaretDown } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export const Collapsible = CollapsiblePrimitive.Root;

export type CollapsibleContentProps = CollapsiblePrimitive.Panel.Props & { children?: ReactNode };

export function CollapsibleTrigger({ className, children, ...props }: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger className={cn("teum-collapsible__trigger", className)} {...props}>
      <span>{children}</span>
      <CaretDown aria-hidden="true" />
    </CollapsiblePrimitive.Trigger>
  );
}

export function CollapsibleContent({ className, children, ...props }: CollapsibleContentProps) {
  return (
    <CollapsiblePrimitive.Panel className={cn("teum-collapsible__panel", className)} {...props}>
      <div className="teum-collapsible__content">{children}</div>
    </CollapsiblePrimitive.Panel>
  );
}
