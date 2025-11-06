"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function ToastProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      theme={theme as "light" | "dark" | "system"}
      toastOptions={{
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
        className: "font-sans",
      }}
    />
  );
}
