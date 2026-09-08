"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { API_ROUTES } from "@/shared/api-routes";
import { api } from "@/shared/lib/axios";
import { rewardInputSchema } from "../lib/rewardSchema";
import type { RewardInput } from "../lib/rewardSchema";
import { rewardCreateErrorMessage } from "../content/adminLoyaltyContent";
import type { RewardCatalogItem } from "../types/reward";

function noop() {}

interface UseAdminRewardFormInput {
  reward?: RewardCatalogItem;
  onSuccess: () => void;
}

export function useAdminRewardForm({ reward, onSuccess }: UseAdminRewardFormInput) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RewardInput>({
    resolver: zodResolver(rewardInputSchema),
    defaultValues: reward
      ? {
          name: reward.name,
          description: reward.description,
          pointsCost: reward.pointsCost,
          discountValue: reward.discountValue,
          isActive: reward.isActive,
        }
      : {
          name: "",
          description: "",
          pointsCost: 0,
          discountValue: 0,
          isActive: true,
        },
  });

  async function onSubmit(values: RewardInput) {
    setFormError(null);
    try {
      if (reward) {
        await api.patch(API_ROUTES.admin.loyalty.rewards.byId(reward.id), values);
      } else {
        await api.post(API_ROUTES.admin.loyalty.rewards.base, values);
      }
      onSuccess();
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      setFormError(rewardCreateErrorMessage(status));
    }
  }

  return {
    register,
    handleSubmit: rhfHandleSubmit(onSubmit, noop),
    errors,
    isSubmitting,
    formError,
  };
}
