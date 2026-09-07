"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { API_ROUTES } from "@/shared/api-routes";
import { api } from "@/shared/lib/axios";
import { menuItemInputSchema } from "../lib/menuItemSchema";
import type { MenuItemInput } from "../lib/menuItemSchema";
import { itemCreateErrorMessage } from "../content/adminMenuContent";
import type { MenuItem } from "../types";

function noop() {}

interface UseAdminItemFormInput {
  item?: MenuItem;
  onSuccess: () => void;
}

export function useAdminItemForm({ item, onSuccess }: UseAdminItemFormInput) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    watch,
    setValue,
    handleSubmit: rhfHandleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MenuItemInput>({
    resolver: zodResolver(menuItemInputSchema),
    defaultValues: item
      ? {
          categoryId: item.categoryId,
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          images: item.images,
          dietaryTags: item.dietaryTags,
          isAvailable: item.isAvailable,
          optionGroupIds: item.optionGroupIds,
        }
      : {
          categoryId: "",
          name: "",
          description: "",
          basePrice: 0,
          images: [],
          dietaryTags: [],
          isAvailable: true,
          optionGroupIds: [],
        },
  });

  async function onSubmit(values: MenuItemInput) {
    setFormError(null);
    try {
      if (item) {
        await api.patch(API_ROUTES.admin.menu.items.byId(item.id), values);
      } else {
        await api.post(API_ROUTES.admin.menu.items.base, values);
      }
      onSuccess();
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      setFormError(itemCreateErrorMessage(status));
    }
  }

  return {
    register,
    watch,
    setValue,
    handleSubmit: rhfHandleSubmit(onSubmit, noop),
    errors,
    isSubmitting,
    formError,
  };
}
