import Link from "next/link";
import { ROUTES } from "@/shared/routes";
import type { OrderSummaryDTO } from "@/modules/order/types";
import {
  BROWSE_MENU_CTA,
  ORDER_HISTORY_EMPTY_COPY,
  ORDER_HISTORY_EMPTY_TITLE,
  ORDER_HISTORY_HEADING,
} from "../content/orderHistoryContent";
import { OrderHistoryCard } from "./OrderHistoryCard";

export interface OrderHistoryListProps {
  orders: OrderSummaryDTO[];
}

export function OrderHistoryList({ orders }: OrderHistoryListProps) {
  return (
    <div>
      <h2 className="font-display text-xl text-ink">{ORDER_HISTORY_HEADING}</h2>

      {orders.length === 0 ? (
        <div className="mt-5 grid max-w-md gap-3 rounded-xl border border-border bg-surface p-6 text-center">
          <p className="font-display text-lg text-ink">{ORDER_HISTORY_EMPTY_TITLE}</p>
          <p className="text-[14.5px] text-ink-muted">{ORDER_HISTORY_EMPTY_COPY}</p>
          <Link
            href={ROUTES.menu}
            className="inline-flex items-center justify-center gap-[11px] justify-self-center rounded-pill bg-gold px-6 py-4 text-base font-bold text-gold-ink shadow-md transition-colors hover:bg-gold-hover"
          >
            {BROWSE_MENU_CTA}
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid max-w-[840px] gap-4">
          {orders.map((order) => (
            <OrderHistoryCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
