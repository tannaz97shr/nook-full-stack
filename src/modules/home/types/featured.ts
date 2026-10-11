import type { MenuItem, Option, OptionGroup } from "@/modules/menu/types";

export type FeaturedItemsResult =
  | {
      status: "ok";
      items: MenuItem[];
      optionGroupsById: Record<string, OptionGroup>;
      optionsById: Record<string, Option>;
    }
  | { status: "error" };
