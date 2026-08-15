import type { HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  containerClassName?: string;
};

export function Table({ className, containerClassName, ...props }: TableProps) {
  return <div className={cn("ix-table__container", containerClassName)}><table className={cn("ix-table", className)} {...props} /></div>;
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("ix-table__header", className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("ix-table__body", className)} {...props} />;
}

export function TableFooter({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tfoot className={cn("ix-table__footer", className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("ix-table__row", className)} {...props} />;
}

export function TableHead({ className, scope = "col", ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("ix-table__head", className)} scope={scope} {...props} />;
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("ix-table__cell", className)} {...props} />;
}

export function TableCaption({ className, ...props }: HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={cn("ix-table__caption", className)} {...props} />;
}
