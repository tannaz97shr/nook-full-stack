/** Display-only shortening of a Firestore doc id for the narrow admin queue column — not a stored field. */
export function formatOrderDisplayId(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}
