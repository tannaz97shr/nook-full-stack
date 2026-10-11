import { getFeaturedMenuItems, getOptionGroupsByIds, getOptionsByIds } from "@/modules/menu/api";
import { logError } from "@/shared/utils/log-error";
import type { FeaturedItemsResult } from "../types/featured";

/**
 * Server-only. Featured items plus just the option groups/options they
 * reference, so the cards can show "From $X" and open the customize modal.
 * A Firestore failure degrades this one section instead of taking the whole
 * homepage down to the error boundary.
 */
export async function getFeaturedItems(): Promise<FeaturedItemsResult> {
  try {
    const items = await getFeaturedMenuItems();

    const optionGroups = await getOptionGroupsByIds(
      Array.from(new Set(items.flatMap((item) => item.optionGroupIds))),
    );
    const options = await getOptionsByIds(
      Array.from(new Set(optionGroups.flatMap((group) => group.optionIds))),
    );

    return {
      status: "ok",
      items,
      optionGroupsById: Object.fromEntries(optionGroups.map((group) => [group.id, group])),
      optionsById: Object.fromEntries(options.map((option) => [option.id, option])),
    };
  } catch (error) {
    logError(error, "home.getFeaturedItems", { level: "error" });
    return { status: "error" };
  }
}
