"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/kbd.css";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export type KbdProps = ComponentPropsWithRef<"kbd">;

export function Kbd({ className, ...props }: KbdProps) {
  return <kbd className={cn("whatiuse-kbd", className)} {...props} />;
}

export type KbdGroupProps = ComponentPropsWithRef<"span">;

export function KbdGroup({ className, ...props }: KbdGroupProps) {
  return <span className={cn("whatiuse-kbd-group", className)} {...props} />;
}
