"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Drawer } from "@/shared/components";
import { ROUTES } from "@/shared/routes";
import { API_ROUTES } from "@/shared/api-routes";
import { api } from "@/shared/lib/axios";
import { useToast } from "@/shared/hooks/useToast";
import { formatMoney } from "@/shared/utils/format-money";
import { logError } from "@/shared/utils/log-error";
import type { CheckoutRequestBody } from "@/modules/order/types";
import {
  CART_HEADER_TITLE,
  CHECKOUT_ERROR_MESSAGE,
  cartSummaryLine,
  checkoutButtonLabel,
} from "../content/cartContent";
import { useCart } from "../hooks/useCart";
import { CartEmptyState } from "./CartEmptyState";
import { CartLineItemRow } from "./CartLineItemRow";

export function CartDrawer() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    items,
    isOpen,
    close,
    incrementQty,
    decrementQty,
    removeItem,
    subtotal,
    tax,
    total,
    count,
    isEmpty,
  } = useCart();

  function handleBrowseMenu() {
    close();
    router.push(ROUTES.menu);
  }

  async function handleCheckout() {
    setIsSubmitting(true);
    try {
      const body: CheckoutRequestBody = {
        lines: items.map((line) => ({
          menuItemId: line.menuItemId,
          quantity: line.quantity,
          selectedOptionIds: line.selections.flatMap((group) =>
            group.options.map((option) => option.optionId),
          ),
        })),
      };
      const { data } = await api.post<{ url: string }>(API_ROUTES.checkout, body);
      window.location.href = data.url;
    } catch (error) {
      logError(error, "CartDrawer.handleCheckout", { level: "error" });
      showToast(CHECKOUT_ERROR_MESSAGE, "error");
      setIsSubmitting(false);
    }
  }

  return (
    <Drawer open={isOpen} onClose={close} labelledBy="cart-drawer-title">
      <div className="flex items-start justify-between gap-3 border-b border-border px-6 py-5">
        <div>
          <h2 id="cart-drawer-title" className="font-display text-2xl text-ink">
            {CART_HEADER_TITLE}
          </h2>
          <p className="mt-1 text-sm text-ink-subtle">{cartSummaryLine(count)}</p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close cart"
          className="grid h-9 w-9 flex-none place-items-center rounded-pill text-ink hover:bg-sunken"
        >
          ✕
        </button>
      </div>

      {isEmpty ? (
        <CartEmptyState onBrowseMenu={handleBrowseMenu} />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-6">
            {items.map((line) => (
              <CartLineItemRow
                key={line.key}
                line={line}
                onIncrement={() => incrementQty(line.key)}
                onDecrement={() => decrementQty(line.key)}
                onRemove={() => removeItem(line.key)}
              />
            ))}
          </div>

          <div className="flex-none border-t border-border bg-surface px-6 py-5">
            <div className="mb-4 grid gap-2">
              <div className="flex justify-between text-[14.5px] text-ink-muted">
                <span>Subtotal</span>
                <span className="font-mono">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[14.5px] text-ink-muted">
                <span>Tax (10%)</span>
                <span className="font-mono">{formatMoney(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-[17px] font-bold text-ink">
                <span>Total</span>
                <span className="font-mono">{formatMoney(total)}</span>
              </div>
            </div>
            <Button variant="primary" fullWidth disabled={isSubmitting} onClick={handleCheckout}>
              {checkoutButtonLabel(total, isSubmitting)}
            </Button>
          </div>
        </>
      )}
    </Drawer>
  );
}
