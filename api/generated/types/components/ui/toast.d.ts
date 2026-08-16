import type { ExternalToast, ToasterProps } from "sonner";
import type { ReactNode } from "react";
export type ToastId = string | number;
export type ToastMessage = ReactNode | (() => ReactNode);
export type ToastOptions = ExternalToast;
export type ToastApi = {
    (message: ToastMessage, options?: ToastOptions): ToastId;
    success: (message: ToastMessage, options?: ToastOptions) => ToastId;
    info: (message: ToastMessage, options?: ToastOptions) => ToastId;
    warning: (message: ToastMessage, options?: ToastOptions) => ToastId;
    error: (message: ToastMessage, options?: ToastOptions) => ToastId;
    loading: (message: ToastMessage, options?: ToastOptions) => ToastId;
    dismiss: (id?: ToastId) => ToastId;
};
export declare function Toaster({ className, position, visibleToasts, expand, closeButton, duration, gap, offset, toastOptions, ...props }: ToasterProps): import("react").JSX.Element;
export declare const toast: ToastApi;
