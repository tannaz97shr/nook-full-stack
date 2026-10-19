/** The customer-facing order number ("#A1B2C3") — a display-only shortening of the Firestore doc id, not a stored field. Used everywhere an order is shown (confirmation, order history, admin queue) so the number always matches. */
export function formatOrderDisplayId(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}
