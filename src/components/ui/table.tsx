import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export type TableProps = ComponentPropsWithRef<"table"> & {
  containerClassName?: string;
};

export function Table({ className, containerClassName, ...props }: TableProps) {
  return <div className={cn("ix-table__container", containerClassName)}><table className={cn("ix-table", className)} {...props} /></div>;
}

export function TableHeader({ className, ...props }: ComponentPropsWithRef<"thead">) {
  return <thead className={cn("ix-table__header", className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentPropsWithRef<"tbody">) {
  return <tbody className={cn("ix-table__body", className)} {...props} />;
}

export function TableFooter({ className, ...props }: ComponentPropsWithRef<"tfoot">) {
  return <tfoot className={cn("ix-table__footer", className)} {...props} />;
}

export function TableRow({ className, ...props }: ComponentPropsWithRef<"tr">) {
  return <tr className={cn("ix-table__row", className)} {...props} />;
}

export function TableHead({ className, scope = "col", ...props }: ComponentPropsWithRef<"th">) {
  return <th className={cn("ix-table__head", className)} scope={scope} {...props} />;
}

export function TableCell({ className, ...props }: ComponentPropsWithRef<"td">) {
  return <td className={cn("ix-table__cell", className)} {...props} />;
}

export function TableCaption({ className, ...props }: ComponentPropsWithRef<"caption">) {
  return <caption className={cn("ix-table__caption", className)} {...props} />;
}
