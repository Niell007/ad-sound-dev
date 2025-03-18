"use client";

import * as React from "react";
import { createContext, useContext } from "react";
import { ToastActionElement, ToastProps } from "@/components/ui/toast";

type ToastContextType = {
  toast: (props: ToastProps) => void;
  dismiss: (toastId?: string) => void;
  toasts: ToastProps[];
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function CustomToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback(
    (props: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9);
      const variant = props.variant || "default";
      setToasts((prevToasts) => [...prevToasts, { id, variant, ...props }]);

      // Auto dismiss after 5 seconds
      setTimeout(
        () => {
          setToasts((prevToasts) =>
            prevToasts.filter((toast) => toast.id !== id)
          );
        },
        props.variant === "custom" ? 7000 : 5000
      ); // Custom toasts stay longer

      return id;
    },
    [setToasts]
  );

  const dismiss = React.useCallback(
    (toastId?: string) => {
      if (toastId) {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== toastId)
        );
      } else {
        setToasts([]);
      }
    },
    [setToasts]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a CustomToastProvider");
  }
  return context;
}
