import { Badge, Button } from "@/shared/components";
import { formatMoney } from "@/shared/utils/format-money";
import { orderHistoryChipLabel } from "@/modules/order/content/orderStatusContent";
import type { OrderSummaryDTO } from "@/modules/order/types";
import { formatOrderSummaryLine } from "../lib/formatOrderSummaryLine";
import { REORDER_CTA, REORDER_DEFERRED_TITLE } from "../content/orderHistoryContent";

const ORDER_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export interface OrderHistoryCardProps {
  order: OrderSummaryDTO;
}

export function OrderHistoryCard({ order }: OrderHistoryCardProps) {
  const chip = orderHistoryChipLabel(order);

  return (
    <div className="grid gap-4 rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[13px] text-ink-subtle">{order.id}</span>
          <Badge variant={chip.tone}>{chip.label}</Badge>
        </div>
        <span className="text-[13px] text-ink-subtle">{ORDER_DATE_FORMATTER.format(new Date(order.createdAt))}</span>
      </div>

      <p className="text-[14.5px] text-ink">{formatOrderSummaryLine(order.lineItems)}</p>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
        <span className="font-mono text-base font-semibold text-ink">{formatMoney(order.total)}</span>
        <Button variant="secondary" disabled title={REORDER_DEFERRED_TITLE}>
          {REORDER_CTA}
        </Button>
      </div>
    </div>
  );
}
