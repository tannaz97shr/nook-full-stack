"use client";

import { useCart } from "../hooks/useCart";
import { CART_DRAWER_ID } from "../lib/cartDrawerId";

export function CartTrigger() {
  const { open, isOpen, count } = useCart();

  return (
    <button
      type="button"
      onClick={open}
      aria-expanded={isOpen}
      aria-controls={CART_DRAWER_ID}
      className="flex items-center gap-2.5 rounded-pill bg-gold px-[18px] py-2.5 text-sm font-bold text-gold-ink shadow-sm hover:bg-gold-hover"
    >
      <span>Cart</span>
      <span className="grid h-[21px] min-w-[21px] place-items-center rounded-pill bg-gold-hover px-1.5 font-mono text-xs">
        {count}
      </span>
    </button>
  );
}
