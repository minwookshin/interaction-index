import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { Check } from "@phosphor-icons/react";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export const ContextMenu = ContextMenuPrimitive.Root;

export function ContextMenuTrigger({ className, ...props }: ContextMenuPrimitive.Trigger.Props) {
  return <ContextMenuPrimitive.Trigger className={cn("ix-context-menu__trigger", className)} {...props} />;
}

export type ContextMenuContentProps = ContextMenuPrimitive.Popup.Props &
  Pick<ContextMenuPrimitive.Positioner.Props, "align" | "alignOffset" | "collisionAvoidance" | "side" | "sideOffset">;

export function ContextMenuContent({ className, align = "start", alignOffset = 0, collisionAvoidance, side = "bottom", sideOffset = 4, ...props }: ContextMenuContentProps) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner className="ix-positioner" align={align} alignOffset={alignOffset} collisionAvoidance={collisionAvoidance} side={side} sideOffset={sideOffset}>
        <ContextMenuPrimitive.Popup className={cn("ix-menu ix-context-menu", className)} data-layer="flyout" {...props} />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

export function ContextMenuLabel({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div role="presentation" className={cn("ix-menu__label", className)} {...props} />;
}

export function ContextMenuItem({ className, ...props }: ContextMenuPrimitive.Item.Props) {
  return <ContextMenuPrimitive.Item className={cn("ix-menu__item", className)} {...props} />;
}

export function ContextMenuSeparator(props: ContextMenuPrimitive.Separator.Props) {
  return <ContextMenuPrimitive.Separator className="ix-menu__separator" {...props} />;
}

export function ContextMenuCheckboxItem({ className, children, ...props }: ContextMenuPrimitive.CheckboxItem.Props) {
  return (
    <ContextMenuPrimitive.CheckboxItem className={cn("ix-menu__item ix-menu__item--check", className)} {...props}>
      <span>{children}</span>
      <ContextMenuPrimitive.CheckboxItemIndicator className="ix-menu__check"><Check weight="bold" /></ContextMenuPrimitive.CheckboxItemIndicator>
    </ContextMenuPrimitive.CheckboxItem>
  );
}

export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

export function ContextMenuRadioItem({ className, children, closeOnClick = true, ...props }: ContextMenuPrimitive.RadioItem.Props) {
  return (
    <ContextMenuPrimitive.RadioItem className={cn("ix-menu__item ix-menu__item--check", className)} closeOnClick={closeOnClick} {...props}>
      <span>{children}</span>
      <ContextMenuPrimitive.RadioItemIndicator className="ix-menu__check"><Check weight="bold" /></ContextMenuPrimitive.RadioItemIndicator>
    </ContextMenuPrimitive.RadioItem>
  );
}
