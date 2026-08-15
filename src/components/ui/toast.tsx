import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      className="ix-toaster"
      position="bottom-right"
      closeButton
      gap={8}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "ix-toast",
          content: "ix-toast__content",
          title: "ix-toast__title",
          description: "ix-toast__description",
          actionButton: "ix-toast__action",
          closeButton: "ix-toast__close",
        },
      }}
    />
  );
}

export const toast = sonnerToast;
