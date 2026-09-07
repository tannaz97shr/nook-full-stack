export type AdminMenuTabId = "items" | "categories" | "groups";

export const ADMIN_MENU_TABS: { id: AdminMenuTabId; label: string }[] = [
  { id: "items", label: "Items" },
  { id: "categories", label: "Categories" },
  { id: "groups", label: "Option groups" },
];

export const ADMIN_ITEMS_FOOTNOTE =
  "Switching an item off 86s it immediately — it stays visible on the customer menu, greyed out and marked sold out, and can't be added.";
export const ADMIN_CATEGORIES_FOOTNOTE =
  "A category with nothing in it is hidden from the customer menu automatically, even while marked active.";

export const NEW_ITEM_LABEL = "+ New item";
export const NEW_CATEGORY_LABEL = "+ New category";
export const NEW_OPTION_GROUP_LABEL = "+ New group";
export const EDIT_LABEL = "Edit";

export const ITEM_FORM_TITLE = { create: "New item", edit: "Edit item" };
export const CATEGORY_FORM_TITLE = { create: "New category", edit: "Edit category" };
export const OPTION_GROUP_FORM_TITLE = { create: "New option group", edit: "Edit option group" };

export const ITEM_FORM_LABELS = {
  name: "Name",
  description: "Description",
  category: "Category",
  basePrice: "Base price",
  dietaryTags: "Dietary tags",
  optionGroups: "Option groups",
  isAvailable: "Available for purchase",
  photo: "Photo",
};

export const CATEGORY_FORM_LABELS = {
  name: "Name",
  description: "Description",
  isActive: "Visible on the customer menu",
};

export const OPTION_GROUP_FORM_LABELS = {
  name: "Name",
  selectionType: "Selection type",
  isRequired: "Required",
  minSelect: "Minimum selections",
  maxSelect: "Maximum selections",
  options: "Options",
  optionName: "Name",
  priceModifier: "Price change",
  isAvailable: "Available",
  addOption: "+ Add option",
  removeOption: "Remove",
};

export const SAVE_LABEL = "Save";
export const CANCEL_LABEL = "Cancel";

export function categoryVisibilityChip(isActive: boolean, itemCount: number): { label: string; variant: "leaf" | "clay" | "neutral" } {
  if (!isActive) return { label: "Hidden", variant: "neutral" };
  if (itemCount === 0) return { label: "Hidden — empty", variant: "clay" };
  return { label: "Live", variant: "leaf" };
}

export function optionGroupMeta(selectionType: "single" | "multiple", optionCount: number): string {
  const kind = selectionType === "single" ? "Single select" : "Multi select";
  return `${kind} · ${optionCount} option${optionCount === 1 ? "" : "s"}`;
}

export function usedByLabel(itemCount: number): string {
  return `Used by ${itemCount} item${itemCount === 1 ? "" : "s"}`;
}

export function itemCreateErrorMessage(status: number | undefined): string {
  return status === 409 ? "An item with that name already exists" : "Something went wrong";
}

export function categoryCreateErrorMessage(status: number | undefined): string {
  return status === 409 ? "A category with that name already exists" : "Something went wrong";
}

export function optionGroupCreateErrorMessage(status: number | undefined): string {
  return status === 409 ? "An option group with that name already exists" : "Something went wrong";
}

export const AVAILABILITY_TOGGLE_ERROR = "Couldn't update availability — try again";
export const DIETARY_TAG_OPTIONS: { value: string; label: string }[] = [
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten free" },
  { value: "dairy-free", label: "Dairy free" },
  { value: "contains-nuts", label: "Contains nuts" },
];
