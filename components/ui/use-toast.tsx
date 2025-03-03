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

export function CustomToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback(
    (props: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prevToasts) => [...prevToasts, { id, ...props }]);

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
      }, 5000);

      return id;
    },
    [setToasts]
  );

  const dismiss = React.useCallback(
    (toastId?: string) => {
      if (toastId) {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId));
      } else {
        setToasts([]);
      }
    },
    [setToasts]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col p-4 gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-md transform transition-all duration-300 ease-in-out ${
              toast.variant === "destructive" ? "border-l-4 border-red-500" : "border-l-4 border-green-500"
            }`}
          >
            {toast.title && <h3 className="font-medium">{toast.title}</h3>}
            {toast.description && <p className="text-sm text-gray-500 dark:text-gray-400">{toast.description}</p>}
            {toast.action && <div className="mt-2">{toast.action}</div>}
          </div>
        ))}
      </div>
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