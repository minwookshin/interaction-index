import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import { cn } from "../../lib/cn";

export type ToolbarProps = ToolbarPrimitive.Root.Props;
export type ToolbarGroupProps = ToolbarPrimitive.Group.Props;
export type ToolbarButtonProps = ToolbarPrimitive.Button.Props;
export type ToolbarLinkProps = ToolbarPrimitive.Link.Props;
export type ToolbarInputProps = ToolbarPrimitive.Input.Props;
export type ToolbarSeparatorProps = ToolbarPrimitive.Separator.Props;

export function Toolbar({ className, ...props }: ToolbarProps) {
  return <ToolbarPrimitive.Root className={cn("ix-toolbar", className)} {...props} />;
}

export function ToolbarGroup({ className, ...props }: ToolbarGroupProps) {
  return <ToolbarPrimitive.Group className={cn("ix-toolbar__group", className)} {...props} />;
}

export function ToolbarButton({ className, ...props }: ToolbarButtonProps) {
  return <ToolbarPrimitive.Button className={cn("ix-toolbar__button", className)} {...props} />;
}

export function ToolbarLink({ className, ...props }: ToolbarLinkProps) {
  return <ToolbarPrimitive.Link className={cn("ix-toolbar__link", className)} {...props} />;
}

export function ToolbarInput({ className, ...props }: ToolbarInputProps) {
  return <ToolbarPrimitive.Input className={cn("ix-toolbar__input", className)} {...props} />;
}

export function ToolbarSeparator({ className, ...props }: ToolbarSeparatorProps) {
  return <ToolbarPrimitive.Separator className={cn("ix-toolbar__separator", className)} {...props} />;
}
