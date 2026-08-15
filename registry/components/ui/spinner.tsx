import "../../styles/index-base.css";
import "../../styles/components/spinner.css";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export type SpinnerProps = ComponentPropsWithRef<"span"> & {
  size?: "small" | "medium" | "large";
  label?: string;
};

export function Spinner({ className, size = "medium", label = "Loading", ...props }: SpinnerProps) {
  return <span className={cn("ix-loading-spinner", `ix-loading-spinner--${size}`, className)} role="status" aria-label={label} {...props}><span aria-hidden="true" /></span>;
}
