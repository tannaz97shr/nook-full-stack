"use client";

import { useMutation } from "@tanstack/react-query";
import { API_ROUTES } from "@/shared/api-routes";
import { api } from "@/shared/lib/axios";

interface ToggleInput {
  itemId: string;
  isAvailable: boolean;
}

/** The 86-toggle's mutation — AdminItemsTable owns the optimistic flip/rollback around this. */
export function useMenuItemAvailabilityToggle() {
  return useMutation({
    mutationFn: ({ itemId, isAvailable }: ToggleInput) =>
      api.patch(API_ROUTES.admin.menu.items.availability(itemId), { isAvailable }),
  });
}
