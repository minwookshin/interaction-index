import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";

export type TableProps = ComponentPropsWithRef<"table"> & {
  containerClassName?: string;
};

export function Table({ className, containerClassName, ...props }: TableProps) {
  return <div className={cn("whatiuse-table__container", containerClassName)}><table className={cn("whatiuse-table", className)} {...props} /></div>;
}

export function TableHeader({ className, ...props }: ComponentPropsWithRef<"thead">) {
  return <thead className={cn("whatiuse-table__header", className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentPropsWithRef<"tbody">) {
  return <tbody className={cn("whatiuse-table__body", className)} {...props} />;
}

export function TableFooter({ className, ...props }: ComponentPropsWithRef<"tfoot">) {
  return <tfoot className={cn("whatiuse-table__footer", className)} {...props} />;
}

export function TableRow({ className, ...props }: ComponentPropsWithRef<"tr">) {
  return <tr className={cn("whatiuse-table__row", className)} {...props} />;
}

export function TableHead({ className, scope = "col", ...props }: ComponentPropsWithRef<"th">) {
  return <th className={cn("whatiuse-table__head", className)} scope={scope} {...props} />;
}

export function TableCell({ className, ...props }: ComponentPropsWithRef<"td">) {
  return <td className={cn("whatiuse-table__cell", className)} {...props} />;
}

export function TableCaption({ className, ...props }: ComponentPropsWithRef<"caption">) {
  return <caption className={cn("whatiuse-table__caption", className)} {...props} />;
}
