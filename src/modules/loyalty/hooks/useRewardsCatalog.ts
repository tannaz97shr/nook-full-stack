"use client";

import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/shared/api-routes";
import { api } from "@/shared/lib/axios";
import type { RewardCatalogItem } from "../types/reward";

/** Public rewards catalog — always enabled, unlike useLoyaltyBalance, since it's needed on mount regardless of auth state. */
export function useRewardsCatalog() {
  return useQuery({
    queryKey: ["rewards-catalog"],
    queryFn: async () => {
      const { data } = await api.get<{ rewards: RewardCatalogItem[] }>(API_ROUTES.loyalty.catalog);
      return data.rewards;
    },
    staleTime: 30_000,
  });
}
