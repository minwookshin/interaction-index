import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
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

const toastClassNames = {
  toast: "teum-toast",
  content: "teum-toast__content",
  title: "teum-toast__title",
  description: "teum-toast__description",
  actionButton: "teum-toast__action",
  closeButton: "teum-toast__close",
};

export function Toaster({
  className,
  position = "bottom-center",
  visibleToasts = 1,
  expand = false,
  closeButton = true,
  duration = 4000,
  gap = 8,
  offset = 20,
  toastOptions,
  ...props
}: ToasterProps) {
  return (
    <SonnerToaster
      {...props}
      className={["teum-toaster", className].filter(Boolean).join(" ")}
      position={position}
      visibleToasts={visibleToasts}
      expand={expand}
      closeButton={closeButton}
      duration={duration}
      gap={gap}
      offset={offset}
      style={{ "--width": "326px", ...props.style } as ToasterProps["style"]}
      toastOptions={{
        ...toastOptions,
        unstyled: true,
        classNames: {
          ...toastClassNames,
          ...toastOptions?.classNames,
        },
      }}
    />
  );
}

export const toast: ToastApi = Object.assign(
  (message: ToastMessage, options?: ToastOptions) => sonnerToast(message, options),
  {
    success: (message: ToastMessage, options?: ToastOptions) => sonnerToast.success(message, options),
    info: (message: ToastMessage, options?: ToastOptions) => sonnerToast.info(message, options),
    warning: (message: ToastMessage, options?: ToastOptions) => sonnerToast.warning(message, options),
    error: (message: ToastMessage, options?: ToastOptions) => sonnerToast.error(message, options),
    loading: (message: ToastMessage, options?: ToastOptions) => sonnerToast.loading(message, options),
    dismiss: (id?: ToastId) => sonnerToast.dismiss(id),
  },
);
