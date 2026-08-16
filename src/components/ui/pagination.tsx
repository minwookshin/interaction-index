import { CaretLeft, CaretRight, DotsThree } from "@phosphor-icons/react";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export type PaginationProps = Omit<ComponentPropsWithRef<"nav">, "children"> & {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
  label?: string;
};

function pageRange(page: number, total: number, siblingCount: number) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const start = Math.max(2, page - siblingCount);
  const end = Math.min(total - 1, page + siblingCount);
  const values: Array<number | "ellipsis-start" | "ellipsis-end"> = [1];
  if (start > 2) values.push("ellipsis-start");
  for (let value = start; value <= end; value += 1) values.push(value);
  if (end < total - 1) values.push("ellipsis-end");
  values.push(total);
  return values;
}

export function Pagination({ page, totalPages, onPageChange, siblingCount = 1, className, label = "Pagination", ...props }: PaginationProps) {
  const safeTotalPages = Math.max(1, Math.floor(totalPages));
  const safePage = Math.min(safeTotalPages, Math.max(1, Math.floor(page)));
  const safeSiblingCount = Math.max(0, Math.floor(siblingCount));
  const setPage = (next: number) => onPageChange(Math.min(safeTotalPages, Math.max(1, next)));
  return (
    <nav className={cn("teum-pagination", className)} aria-label={label} {...props}>
      <button type="button" aria-label="Previous page" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}><CaretLeft /></button>
      {pageRange(safePage, safeTotalPages, safeSiblingCount).map((item) => typeof item === "number" ? <button type="button" key={item} aria-label={`Page ${item}`} aria-current={item === safePage ? "page" : undefined} onClick={() => setPage(item)}>{item}</button> : <span key={item} aria-hidden="true"><DotsThree /></span>)}
      <button type="button" aria-label="Next page" disabled={safePage >= safeTotalPages} onClick={() => setPage(safePage + 1)}><CaretRight /></button>
    </nav>
  );
}
