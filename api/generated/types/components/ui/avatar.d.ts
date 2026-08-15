import type { ComponentPropsWithRef } from "react";
export type AvatarProps = ComponentPropsWithRef<"span"> & {
    src?: string;
    alt?: string;
    fallback: string;
    size?: "small" | "medium" | "large";
    status?: "online" | "away" | "busy" | "offline";
};
export declare function Avatar({ className, src, alt, fallback, size, status, ...props }: AvatarProps): import("react").JSX.Element;
export declare function AvatarGroup({ className, children, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element;
