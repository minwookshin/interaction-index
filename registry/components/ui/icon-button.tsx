"use client";

import "../../styles/teum-base.css";
import "../../styles/components/icon-button.css";
import type { ReactNode } from "react";
import { Button, type ButtonProps } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { cn } from "../../lib/cn";

export type IconButtonProps = Omit<ButtonProps, "children" | "leadingIcon" | "trailingIcon"> & {
  children?: ReactNode;
  "aria-label": string;
  tooltip?: string;
};

export function IconButton({ children, className, tooltip, ...props }: IconButtonProps) {
  const button = (
    <Button
      className={cn("teum-icon-button", className)}
      focusableWhenDisabled={Boolean(tooltip) && props.disabled}
      {...props}
    >
      {children}
    </Button>
  );

  if (!tooltip) return button;

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
