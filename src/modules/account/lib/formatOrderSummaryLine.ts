import type { OrderLineItem } from "@/modules/order/types";

/** [{name:"Latte",quantity:2}, {name:"Croissant",quantity:1}] -> "2× Latte, 1× Croissant". */
export function formatOrderSummaryLine(lineItems: OrderLineItem[]): string {
  return lineItems.map((line) => `${line.quantity}× ${line.name}`).join(", ");
}
