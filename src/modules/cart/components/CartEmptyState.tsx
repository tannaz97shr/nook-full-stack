import { Button } from "@/shared/components";
import { CART_EMPTY_COPY, CART_EMPTY_CTA, CART_EMPTY_HEADING } from "../content/cartContent";

export interface CartEmptyStateProps {
  onBrowseMenu: () => void;
}

export function CartEmptyState({ onBrowseMenu }: CartEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-pill bg-sunken text-2xl text-ink-subtle">
        ◠
      </div>
      <h3 className="font-display text-xl text-ink">{CART_EMPTY_HEADING}</h3>
      <p className="text-sm text-ink-subtle">{CART_EMPTY_COPY}</p>
      <Button variant="primary" onClick={onBrowseMenu} className="mt-2">
        {CART_EMPTY_CTA}
      </Button>
    </div>
  );
}
