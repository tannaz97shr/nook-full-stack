"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { API_ROUTES } from "@/shared/api-routes";
import { api } from "@/shared/lib/axios";
import { categoryInputSchema } from "../lib/categorySchema";
import type { CategoryInput } from "../lib/categorySchema";
import { categoryCreateErrorMessage } from "../content/adminMenuContent";
import type { Category } from "../types";

function noop() {}

interface UseAdminCategoryFormInput {
  category?: Category;
  onSuccess: () => void;
}

export function useAdminCategoryForm({ category, onSuccess }: UseAdminCategoryFormInput) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categoryInputSchema),
    defaultValues: category
      ? { name: category.name, description: category.description ?? "", isActive: category.isActive }
      : { name: "", description: "", isActive: true },
  });

  async function onSubmit(values: CategoryInput) {
    setFormError(null);
    try {
      if (category) {
        await api.patch(API_ROUTES.admin.menu.categories.byId(category.id), values);
      } else {
        await api.post(API_ROUTES.admin.menu.categories.base, values);
      }
      onSuccess();
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      setFormError(categoryCreateErrorMessage(status));
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
