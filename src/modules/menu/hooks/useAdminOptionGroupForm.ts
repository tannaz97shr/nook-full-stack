"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { API_ROUTES } from "@/shared/api-routes";
import { api } from "@/shared/lib/axios";
import { optionGroupInputSchema } from "../lib/optionGroupSchema";
import type { OptionGroupInput } from "../lib/optionGroupSchema";
import { optionGroupCreateErrorMessage } from "../content/adminMenuContent";
import type { Option, OptionGroup } from "../types";

function noop() {}

interface UseAdminOptionGroupFormInput {
  group?: OptionGroup;
  groupOptions?: Option[];
  onSuccess: () => void;
}

export function useAdminOptionGroupForm({ group, groupOptions = [], onSuccess }: UseAdminOptionGroupFormInput) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit: rhfHandleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OptionGroupInput>({
    resolver: zodResolver(optionGroupInputSchema),
    defaultValues: group
      ? {
          name: group.name,
          selectionType: group.selectionType,
          isRequired: group.isRequired,
          minSelect: group.minSelect,
          maxSelect: group.maxSelect,
          options: groupOptions.map((option) => ({
            id: option.id,
            name: option.name,
            priceModifier: option.priceModifier,
            isAvailable: option.isAvailable,
          })),
        }
      : {
          name: "",
          selectionType: "single",
          isRequired: false,
          minSelect: 0,
          maxSelect: 1,
          options: [{ name: "", priceModifier: 0, isAvailable: true }],
        },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "options" });

  async function onSubmit(values: OptionGroupInput) {
    setFormError(null);
    try {
      if (group) {
        await api.patch(API_ROUTES.admin.menu.optionGroups.byId(group.id), values);
      } else {
        await api.post(API_ROUTES.admin.menu.optionGroups.base, values);
      }
      onSuccess();
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      setFormError(optionGroupCreateErrorMessage(status));
    }
  }

  return {
    register,
    handleSubmit: rhfHandleSubmit(onSubmit, noop),
    errors,
    isSubmitting,
    formError,
    fields,
    append,
    remove,
  };
}
