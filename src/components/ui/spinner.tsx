import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export type SpinnerProps = ComponentPropsWithRef<"span"> & {
  size?: "small" | "medium" | "large";
  label?: string;
};

export function Spinner({ className, size = "medium", label = "Loading", ...props }: SpinnerProps) {
  return <span className={cn("whatiuse-loading-spinner", `whatiuse-loading-spinner--${size}`, className)} role="status" aria-label={label} {...props}><span aria-hidden="true" /></span>;
}
