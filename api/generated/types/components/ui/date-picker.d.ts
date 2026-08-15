import { type CalendarProps as AriaCalendarProps, type DatePickerProps as AriaDatePickerProps, type DateValue } from "react-aria-components";
import type { ReactNode } from "react";
export type CalendarProps<T extends DateValue> = Omit<AriaCalendarProps<T>, "children" | "className"> & {
    className?: string;
};
export declare function Calendar<T extends DateValue>({ className, ...props }: CalendarProps<T>): import("react").JSX.Element;
export type DatePickerProps<T extends DateValue> = Omit<AriaDatePickerProps<T>, "children" | "className"> & {
    label?: ReactNode;
    "aria-label"?: string;
    description?: ReactNode;
    errorMessage?: ReactNode;
    className?: string;
};
export declare function DatePicker<T extends DateValue>({ label, "aria-label": ariaLabel, description, errorMessage, className, ...props }: DatePickerProps<T>): import("react").JSX.Element;
