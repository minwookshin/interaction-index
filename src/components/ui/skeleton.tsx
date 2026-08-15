import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  width?: number | string;
  height?: number | string;
  radius?: "small" | "medium" | "round";
};

export function Skeleton({ className, width, height, radius = "small", style, ...props }: SkeletonProps) {
  return <div className={cn("ix-skeleton", `ix-skeleton--${radius}`, className)} style={{ width, height, ...style }} aria-hidden="true" {...props} />;
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return <div className="ix-skeleton-text" aria-hidden="true">{Array.from({ length: lines }, (_, index) => <Skeleton key={index} height={10} width={index === lines - 1 ? "68%" : "100%"} />)}</div>;
}
