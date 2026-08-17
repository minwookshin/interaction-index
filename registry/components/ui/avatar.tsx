"use client";

import "../../styles/teum-base.css";
import "../../styles/components/avatar.css";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export type AvatarProps = ComponentPropsWithRef<"span"> & {
  src?: string;
  alt?: string;
  fallback: string;
  size?: "small" | "medium" | "large";
  status?: "online" | "away" | "busy" | "offline";
};

function fallbackTone(value: string) {
  return [...value].reduce((total, character) => total + (character.codePointAt(0) ?? 0), 0) % 4;
}

export function Avatar({ className, src, alt = "", fallback, size = "medium", status, ...props }: AvatarProps) {
  return (
    <span className={cn("teum-avatar", `teum-avatar--${size}`, className)} data-status={status || undefined} data-tone={src ? undefined : fallbackTone(fallback)} {...props}>
      {src ? <img src={src} alt={alt} /> : <span className="teum-avatar__fallback" aria-hidden={alt ? undefined : "true"}>{fallback.slice(0, 2).toLocaleUpperCase()}</span>}
      {status && <span className="teum-avatar__status" data-status={status} role="img" aria-label={`${status} presence`} />}
    </span>
  );
}

export function AvatarGroup({ className, children, ...props }: ComponentPropsWithRef<"div">) {
  return <div role="group" className={cn("teum-avatar-group", className)} {...props}>{children}</div>;
}
