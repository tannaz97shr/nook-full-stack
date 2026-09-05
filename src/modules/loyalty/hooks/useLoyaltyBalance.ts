"use client";

import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/shared/api-routes";
import { api } from "@/shared/lib/axios";

/** Live points balance for the signed-in user — enabled only while relevant (e.g. the cart drawer is open for a signed-in user). */
export function useLoyaltyBalance(enabled: boolean) {
  return useQuery({
    queryKey: ["loyalty-balance"],
    queryFn: async () => {
      const { data } = await api.get<{ pointsBalance: number }>(API_ROUTES.loyalty.balance);
      return data.pointsBalance;
    },
    enabled,
    staleTime: 30_000,
  });
}
