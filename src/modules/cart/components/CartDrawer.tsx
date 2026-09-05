"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button, Drawer } from "@/shared/components";
import { ROUTES } from "@/shared/routes";
import { API_ROUTES } from "@/shared/api-routes";
import { api } from "@/shared/lib/axios";
import { useToast } from "@/shared/hooks/useToast";
import { formatMoney } from "@/shared/utils/format-money";
import { logError } from "@/shared/utils/log-error";
import { REWARDS_CATALOG } from "@/modules/loyalty/content/rewardsCatalog";
import { useLoyaltyBalance } from "@/modules/loyalty/hooks/useLoyaltyBalance";
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
    userId,
    items,
    isOpen,
    close,
    incrementQty,
    decrementQty,
    removeItem,
    selectedRewardId,
    selectReward,
    clearReward,
    subtotal,
    tax,
    total,
    count,
    isEmpty,
  } = useCart();

  const { data: pointsBalance } = useLoyaltyBalance(userId !== null && isOpen);
  const selectedReward = REWARDS_CATALOG.find((reward) => reward.id === selectedRewardId) ?? null;
  const discountPreview = selectedReward ? Math.min(selectedReward.discountValue, subtotal + tax) : 0;

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
        rewardId: selectedRewardId,
      };
      const { data } = await api.post<{ url: string }>(API_ROUTES.checkout, body);
      window.location.href = data.url;
    } catch (error) {
      logError(error, "CartDrawer.handleCheckout", { level: "error" });
      const serverMessage = axios.isAxiosError(error) ? (error.response?.data as { error?: string } | undefined)?.error : undefined;
      showToast(serverMessage ?? CHECKOUT_ERROR_MESSAGE, "error");
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

            {userId !== null && (
              <div className="border-t border-border py-5">
                <h3 className="font-mono text-xs uppercase tracking-wide text-ink-subtle">Redeem a reward</h3>
                <div className="mt-3 grid gap-2">
                  {REWARDS_CATALOG.map((reward) => {
                    const affordable = pointsBalance !== undefined && pointsBalance >= reward.pointsCost;
                    const isSelected = selectedRewardId === reward.id;
                    return (
                      <button
                        key={reward.id}
                        type="button"
                        disabled={!affordable}
                        onClick={() => (isSelected ? clearReward() : selectReward(reward.id))}
                        className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-[14px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                          isSelected ? "border-gold bg-sunken" : "border-border hover:bg-sunken"
                        }`}
                      >
                        <span className="text-ink">{reward.name}</span>
                        <span className="font-mono text-ink-subtle">{reward.pointsCost} pts</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
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
              {selectedReward && (
                <div className="flex justify-between text-[14.5px] text-gold">
                  <span>{selectedReward.name}</span>
                  <span className="font-mono">−{formatMoney(discountPreview)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2 text-[17px] font-bold text-ink">
                <span>Total</span>
                <span className="font-mono">{formatMoney(Math.max(0, total - discountPreview))}</span>
              </div>
            </div>
            <Button variant="primary" fullWidth disabled={isSubmitting} onClick={handleCheckout}>
              {checkoutButtonLabel(Math.max(0, total - discountPreview), isSubmitting)}
            </Button>
          </div>
        </>
      )}
    </Drawer>
  );
}
