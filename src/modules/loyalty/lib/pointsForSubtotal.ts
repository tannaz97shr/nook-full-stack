/** $1 spent = 1 point, computed on the pre-tax subtotal. */
export function pointsForSubtotal(subtotal: number): number {
  return Math.floor(subtotal);
}
