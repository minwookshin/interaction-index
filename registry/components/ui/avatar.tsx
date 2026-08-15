import "../../styles/index-base.css";
import "../../styles/components/avatar.css";
import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  src?: string;
  alt?: string;
  fallback: string;
  size?: "small" | "medium" | "large";
  status?: "online" | "away" | "busy" | "offline";
};

export function Avatar({ className, src, alt = "", fallback, size = "medium", status, ...props }: AvatarProps) {
  return (
    <span className={cn("ix-avatar", `ix-avatar--${size}`, className)} {...props}>
      {src ? <img src={src} alt={alt} /> : <span className="ix-avatar__fallback" aria-hidden={alt ? undefined : "true"}>{fallback.slice(0, 2).toLocaleUpperCase()}</span>}
      {status && <span className="ix-avatar__status" data-status={status} role="img" aria-label={`${status} presence`} />}
    </span>
  );
}

export function AvatarGroup({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="group" className={cn("ix-avatar-group", className)} {...props}>{children}</div>;
}
