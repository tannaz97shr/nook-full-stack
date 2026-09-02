import { ROUTES } from "@/shared/routes";
import type { AccountTab } from "../types/account-tab";

export const ACCOUNT_TABS: AccountTab[] = [
  { id: "profile", label: "Profile", href: ROUTES.account.root },
  { id: "orders", label: "Order history", href: ROUTES.account.orders },
  { id: "rewards", label: "Rewards", href: ROUTES.account.rewards },
];

export const SIGN_OUT_LABEL = "Sign out";

export const SAVED_DETAILS_HEADING = "Saved details";
export const SAVED_DETAILS_BLURB = "We use these to call your name out and text you when it's ready.";
export const PHONE_NOT_PROVIDED_LABEL = "Not provided";
export const NAME_FIELD_LABEL = "Name";
export const PHONE_FIELD_LABEL = "Mobile";
export const EMAIL_FIELD_LABEL = "Email";
