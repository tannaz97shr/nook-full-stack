export type AccountTabId = "profile" | "orders" | "rewards";

export interface AccountTab {
  id: AccountTabId;
  label: string;
  href: string;
}
