export const REWARD_FORM_TITLE = { create: "New reward", edit: "Edit reward" };

export const REWARD_FORM_LABELS = {
  name: "Name",
  description: "Description",
  pointsCost: "Points cost",
  discountValue: "Discount value",
  isActive: "Active",
};

export const NEW_REWARD_LABEL = "+ New reward";
export const SAVE_LABEL = "Save";
export const CANCEL_LABEL = "Cancel";

export const ADMIN_REWARDS_FOOTNOTE =
  "Deactivating a reward hides it from the catalog immediately but never changes past orders that already redeemed it.";

export const ACTIVE_TOGGLE_ERROR = "Couldn't update reward status — try again";

export function rewardCreateErrorMessage(status: number | undefined): string {
  return status === 409 ? "A reward with that name already exists" : "Something went wrong";
}
