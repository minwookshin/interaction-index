import "../../styles/index-base.css";
import "../../styles/components/menu.css";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Check } from "@phosphor-icons/react";
import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export const Menu = MenuPrimitive.Root;

export function MenuTrigger(props: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="menu-trigger" {...props} />;
}

type MenuContentProps = MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">;

export function MenuContent({ className, align = "start", alignOffset = 0, side = "bottom", sideOffset = 6, ...props }: MenuContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner className="ix-positioner" align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset}>
        <MenuPrimitive.Popup className={cn("ix-menu", className)} {...props} data-layer="flyout" />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

export function MenuLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="presentation" className={cn("ix-menu__label", className)} {...props} />;
}

export function MenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
  return <MenuPrimitive.Item className={cn("ix-menu__item", className)} {...props} />;
}

export function MenuSeparator(props: MenuPrimitive.Separator.Props) {
  return <MenuPrimitive.Separator className="ix-menu__separator" {...props} />;
}

export function MenuCheckboxItem({ className, children, ...props }: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem className={cn("ix-menu__item ix-menu__item--check", className)} {...props}>
      <span>{children}</span>
      <MenuPrimitive.CheckboxItemIndicator className="ix-menu__check"><Check weight="bold" /></MenuPrimitive.CheckboxItemIndicator>
    </MenuPrimitive.CheckboxItem>
  );
}
