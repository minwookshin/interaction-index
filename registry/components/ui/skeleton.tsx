"use client";

import "../../styles/teum-base.css";
import "../../styles/components/skeleton.css";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export type SkeletonProps = ComponentPropsWithRef<"div"> & {
  width?: number | string;
  height?: number | string;
  radius?: "small" | "medium" | "round";
};

export function Skeleton({ className, width, height, radius = "small", style, ...props }: SkeletonProps) {
  return <div className={cn("teum-skeleton", `teum-skeleton--${radius}`, className)} style={{ width, height, ...style }} aria-hidden="true" {...props} />;
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return <div className="teum-skeleton-text" aria-hidden="true">{Array.from({ length: lines }, (_, index) => <Skeleton key={index} height={10} width={index === lines - 1 ? "68%" : "100%"} />)}</div>;
}
