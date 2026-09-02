"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/modules/cart/hooks/useCart";
import { formatMoney } from "@/shared/utils/format-money";
import {
  FULFILLMENT_STATUS_STEPS,
  ORDER_CONFIRMATION_HEADING,
  pendingPaymentStatusCopy,
} from "../content/orderStatusContent";
import { useOrderStatusPoll } from "../hooks/useOrderStatusPoll";
import type { OrderSummaryDTO } from "../types/order-summary-dto";

export interface OrderConfirmationScreenProps {
  orderId: string;
  initialOrder: OrderSummaryDTO;
  sessionId: string | null;
  shouldPoll: boolean;
}

export function OrderConfirmationScreen({
  orderId,
  initialOrder,
  sessionId,
  shouldPoll,
}: OrderConfirmationScreenProps) {
  const cart = useCart();
  const { data } = useOrderStatusPoll(orderId, sessionId ?? "", shouldPoll);
  const order = data ?? initialOrder;

  // Fires off whatever paymentStatus currently IS, not "a poll just
  // completed" — this is what correctly handles both orderings of the
  // webhook-vs-redirect race: if the webhook already landed by the time
  // this first renders, the very first value here is already "Paid".
  //
  // Gated on cart.isHydrated for the same reason MenuScreen's reconcile()
  // call is (see CartProvider's isHydrated doc comment): CartProvider is
  // an ANCESTOR of this component, so on initial mount THIS effect fires
  // before CartProvider's own hydration effect does. If paymentStatus is
  // already "Paid" on the very first render (a fast webhook can beat the
  // page load), calling clear() here first just gets silently clobbered
  // a moment later when hydration unconditionally overwrites items from
  // localStorage. Confirmed via a real guest-checkout test: the page
  // rendered "Received" but the cart never actually emptied.
  const hasClearedRef = useRef(false);
  useEffect(() => {
    if (!cart.isHydrated) return;
    if (order.paymentStatus === "Paid" && !hasClearedRef.current) {
      hasClearedRef.current = true;
      cart.clear();
    }
  }, [order.paymentStatus, cart.isHydrated, cart]);

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="font-display text-3xl text-ink">{ORDER_CONFIRMATION_HEADING}</h1>

      {order.paymentStatus !== "Paid" ? (
        <p className="mt-3 text-base text-ink-muted">{pendingPaymentStatusCopy(order.paymentStatus)}</p>
      ) : (
        <ol className="mt-6 grid gap-4">
          {FULFILLMENT_STATUS_STEPS.map((step, index) => {
            const currentIndex = FULFILLMENT_STATUS_STEPS.findIndex(
              (s) => s.status === order.fulfillmentStatus,
            );
            const isReached = currentIndex >= index;
            return (
              <li
                key={step.status}
                className={`flex items-baseline justify-between gap-3 ${isReached ? "text-ink" : "text-ink-subtle"}`}
              >
                <span className="text-[15px] font-semibold">{step.label}</span>
                <span className="text-[13px]">{step.note}</span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-8 border-t border-border pt-6">
        {order.lineItems.map((line) => (
          <div key={line.menuItemId} className="flex items-baseline justify-between gap-2.5 py-1.5">
            <span className="text-[15px] text-ink">
              {line.quantity}× {line.name}
            </span>
            <span className="font-mono text-sm text-ink">{formatMoney(line.unitPrice * line.quantity)}</span>
          </div>
        ))}

        <div className="mt-4 grid gap-2 border-t border-border pt-4">
          <div className="flex justify-between text-[14.5px] text-ink-muted">
            <span>Subtotal</span>
            <span className="font-mono">{formatMoney(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-[14.5px] text-ink-muted">
            <span>Tax</span>
            <span className="font-mono">{formatMoney(order.tax)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-[17px] font-bold text-ink">
            <span>Total</span>
            <span className="font-mono">{formatMoney(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
