import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";
import { API_ROUTES } from "@/shared/api-routes";
import type { OrderSummaryDTO } from "../types/order-summary-dto";

const TERMINAL_PAYMENT_STATUSES = new Set(["Paid", "Failed", "Cancelled"]);

/**
 * Only polls when `enabled` — i.e. only when the confirmation page
 * determined this is a genuine post-checkout redirect (?session_id=
 * present and verified), never merely because an order happens to still
 * be Pending. Self-stops once paymentStatus reaches a terminal state.
 */
export function useOrderStatusPoll(orderId: string, sessionId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["order-status", orderId, sessionId],
    queryFn: async () => {
      const { data } = await api.get<OrderSummaryDTO>(
        `${API_ROUTES.orders.byId(orderId)}?session_id=${encodeURIComponent(sessionId)}`,
      );
      return data;
    },
    enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.paymentStatus;
      return status && TERMINAL_PAYMENT_STATUSES.has(status) ? false : 2000;
    },
  });
}
