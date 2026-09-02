"use client";

import { useCart } from "../hooks/useCart";

export function CartTrigger() {
  const { open, count } = useCart();

  return (
    <button
      type="button"
      onClick={open}
      className="flex items-center gap-2.5 rounded-pill bg-gold px-[18px] py-2.5 text-sm font-bold text-gold-ink shadow-sm hover:bg-gold-hover"
    >
      <span>Cart</span>
      <span className="grid h-[21px] min-w-[21px] place-items-center rounded-pill bg-gold-hover px-1.5 font-mono text-xs">
        {count}
      </span>
    </button>
  );
}
