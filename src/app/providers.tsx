"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/shared/components";
import { CartProvider } from "@/modules/cart/components/CartProvider";

export function Providers({ userId, children }: { userId: string | null; children: ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider userId={userId}>{children}</CartProvider>
    </ToastProvider>
  );
}
