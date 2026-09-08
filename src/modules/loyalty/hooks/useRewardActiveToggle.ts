"use client";

import { useMutation } from "@tanstack/react-query";
import { API_ROUTES } from "@/shared/api-routes";
import { api } from "@/shared/lib/axios";

interface ToggleInput {
  rewardId: string;
  isActive: boolean;
}

/** The active-toggle's mutation — AdminRewardsTable owns the optimistic flip/rollback around this. */
export function useRewardActiveToggle() {
  return useMutation({
    mutationFn: ({ rewardId, isActive }: ToggleInput) =>
      api.patch(API_ROUTES.admin.loyalty.rewards.active(rewardId), { isActive }),
  });
}
