import "../../styles/index-base.css";
import "../../styles/components/kbd.css";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export type KbdProps = ComponentPropsWithRef<"kbd">;

export function Kbd({ className, ...props }: KbdProps) {
  return <kbd className={cn("ix-kbd", className)} {...props} />;
}

export type KbdGroupProps = ComponentPropsWithRef<"span">;

export function KbdGroup({ className, ...props }: KbdGroupProps) {
  return <span className={cn("ix-kbd-group", className)} {...props} />;
}
