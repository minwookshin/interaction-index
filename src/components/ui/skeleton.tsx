import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export type SkeletonProps = ComponentPropsWithRef<"div"> & {
  width?: number | string;
  height?: number | string;
  radius?: "small" | "medium" | "round";
};

export function Skeleton({ className, width, height, radius = "small", style, ...props }: SkeletonProps) {
  return <div className={cn("whatiuse-skeleton", `whatiuse-skeleton--${radius}`, className)} style={{ width, height, ...style }} aria-hidden="true" {...props} />;
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return <div className="whatiuse-skeleton-text" aria-hidden="true">{Array.from({ length: lines }, (_, index) => <Skeleton key={index} height={10} width={index === lines - 1 ? "68%" : "100%"} />)}</div>;
}
