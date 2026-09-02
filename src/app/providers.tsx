"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/shared/components";
import { CartProvider } from "@/modules/cart/components/CartProvider";

export function Providers({ userId, children }: { userId: string | null; children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <CartProvider userId={userId}>{children}</CartProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
