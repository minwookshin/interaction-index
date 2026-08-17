"use client";

import "../../styles/teum-base.css";
import "../../styles/components/kbd.css";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export type KbdProps = ComponentPropsWithRef<"kbd">;

export function Kbd({ className, ...props }: KbdProps) {
  return <kbd className={cn("teum-kbd", className)} {...props} />;
}

export type KbdGroupProps = ComponentPropsWithRef<"span">;

export function KbdGroup({ className, ...props }: KbdGroupProps) {
  return <span className={cn("teum-kbd-group", className)} {...props} />;
}
