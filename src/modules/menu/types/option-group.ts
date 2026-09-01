export type SelectionType = "single" | "multiple";

export interface OptionGroup {
  /** Firestore doc ID — natural slug (e.g. "size", "milk", "addons"). */
  id: string;
  name: string;
  selectionType: SelectionType;
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  /** References Option.id. */
  optionIds: string[];
}
