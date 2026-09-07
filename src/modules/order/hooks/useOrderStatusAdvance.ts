"use client";

import { useMutation } from "@tanstack/react-query";
import { API_ROUTES } from "@/shared/api-routes";
import { api } from "@/shared/lib/axios";
import type { FulfillmentStatus } from "../types/order";

interface AdvanceInput {
  orderId: string;
  status: FulfillmentStatus;
}

/** The queue's status-advance mutation — AdminOrderQueueTable owns the optimistic flip/rollback around this. */
export function useOrderStatusAdvance() {
  return useMutation({
    mutationFn: ({ orderId, status }: AdvanceInput) => api.patch(API_ROUTES.admin.orders.status(orderId), { status }),
  });
}
