export interface Option {
  /** Firestore doc ID — composite slug `${optionGroupId}-${optionSlug}` (e.g. "size-large"). */
  id: string;
  /** Back-reference to OptionGroup.id. */
  optionGroupId: string;
  name: string;
  priceModifier: number;
  isAvailable: boolean;
}
