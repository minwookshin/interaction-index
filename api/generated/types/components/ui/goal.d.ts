import type { HTMLAttributes, ReactNode } from "react";
export type GoalProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
    label: string;
    value: number;
    target: number;
    formatter?: (value: number) => string;
    description?: ReactNode;
};
export declare function Goal({ label, value, target, formatter, description, className, ...props }: GoalProps): import("react").JSX.Element;
