"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/menu.css";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Check } from "@phosphor-icons/react";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export const Menu = MenuPrimitive.Root;

export function MenuTrigger(props: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="menu-trigger" {...props} />;
}

export type MenuContentProps = MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "collisionAvoidance" | "side" | "sideOffset">;

export function MenuContent({ className, align = "start", alignOffset = 0, collisionAvoidance, side = "bottom", sideOffset = 6, ...props }: MenuContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner className="whatiuse-positioner" align={align} alignOffset={alignOffset} collisionAvoidance={collisionAvoidance} side={side} sideOffset={sideOffset}>
        <MenuPrimitive.Popup className={cn("whatiuse-menu", className)} {...props} data-layer="flyout" />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

export function MenuLabel({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div role="presentation" className={cn("whatiuse-menu__label", className)} {...props} />;
}

export function MenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
  return <MenuPrimitive.Item className={cn("whatiuse-menu__item", className)} {...props} />;
}

export function MenuSeparator(props: MenuPrimitive.Separator.Props) {
  return <MenuPrimitive.Separator className="whatiuse-menu__separator" {...props} />;
}

export function MenuCheckboxItem({ className, children, ...props }: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem className={cn("whatiuse-menu__item whatiuse-menu__item--check", className)} {...props}>
      <span>{children}</span>
      <MenuPrimitive.CheckboxItemIndicator className="whatiuse-menu__check"><Check weight="bold" /></MenuPrimitive.CheckboxItemIndicator>
    </MenuPrimitive.CheckboxItem>
  );
}

export const MenuRadioGroup = MenuPrimitive.RadioGroup;

export function MenuRadioItem({ className, children, closeOnClick = true, ...props }: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem className={cn("whatiuse-menu__item whatiuse-menu__item--check", className)} closeOnClick={closeOnClick} {...props}>
      <span>{children}</span>
      <MenuPrimitive.RadioItemIndicator className="whatiuse-menu__check"><Check weight="bold" /></MenuPrimitive.RadioItemIndicator>
    </MenuPrimitive.RadioItem>
  );
}
