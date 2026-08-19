import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "./button";

export type CursorPaginationProps = HTMLAttributes<HTMLElement> & {
  label?: string;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  range?: ReactNode;
  loading?: boolean;
};

export function CursorPagination({ label = "Data pages", hasPrevious, hasNext, onPrevious, onNext, range, loading = false, className, ...props }: CursorPaginationProps) {
  return (
    <nav className={cn("whatiuse-cursor-pagination", className)} aria-label={label} aria-busy={loading || undefined} {...props}>
      <Button size="small" variant="ghost" leadingIcon={<ArrowLeft />} disabled={!hasPrevious || loading} onClick={onPrevious}>Previous</Button>
      {range && <span className="whatiuse-cursor-pagination__range" aria-live="polite">{range}</span>}
      <Button size="small" variant="ghost" trailingIcon={<ArrowRight />} disabled={!hasNext || loading} onClick={onNext}>Next</Button>
    </nav>
  );
}
