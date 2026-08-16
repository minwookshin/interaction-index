import type { ComponentPropsWithRef } from "react";
export type SkeletonProps = ComponentPropsWithRef<"div"> & {
    width?: number | string;
    height?: number | string;
    radius?: "small" | "medium" | "round";
};
export declare function Skeleton({ className, width, height, radius, style, ...props }: SkeletonProps): import("react").JSX.Element;
export declare function SkeletonText({ lines }: {
    lines?: number;
}): import("react").JSX.Element;
