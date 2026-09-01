export interface Category {
  /** Firestore doc ID — the natural slug (e.g. "coffee"). */
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
}
