import type { ComponentPropsWithRef } from "react";
export type TableProps = ComponentPropsWithRef<"table"> & {
    containerClassName?: string;
};
export declare function Table({ className, containerClassName, ...props }: TableProps): import("react").JSX.Element;
export declare function TableHeader({ className, ...props }: ComponentPropsWithRef<"thead">): import("react").JSX.Element;
export declare function TableBody({ className, ...props }: ComponentPropsWithRef<"tbody">): import("react").JSX.Element;
export declare function TableFooter({ className, ...props }: ComponentPropsWithRef<"tfoot">): import("react").JSX.Element;
export declare function TableRow({ className, ...props }: ComponentPropsWithRef<"tr">): import("react").JSX.Element;
export declare function TableHead({ className, scope, ...props }: ComponentPropsWithRef<"th">): import("react").JSX.Element;
export declare function TableCell({ className, ...props }: ComponentPropsWithRef<"td">): import("react").JSX.Element;
export declare function TableCaption({ className, ...props }: ComponentPropsWithRef<"caption">): import("react").JSX.Element;
