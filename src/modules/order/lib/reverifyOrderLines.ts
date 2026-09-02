import { roundToCents } from "@/shared/utils/format-money";
import { getMenuItemById, getOptionGroupsByIds, getOptionsByIds } from "@/modules/menu/api";
import { computeSelectionTotal } from "@/modules/menu/lib/computeSelectionTotal";
import { isModalValid, type SelectionsByGroupId } from "@/modules/menu/lib/optionGroupValidation";
import type { Option, OptionGroup } from "@/modules/menu/types";
import type { CheckoutRequestLine } from "../types/checkout-request";
import type { OrderLineGroup, OrderLineItem } from "../types/order";

export type ReverifyResult =
  | { ok: true; lines: OrderLineItem[]; subtotal: number }
  | { ok: false; reason: string };

/**
 * Re-derives the authoritative price for every requested line from live
 * Firestore data — the server never trusts a client-computed unitPrice.
 * Rejects the whole request on any invalid/unavailable line rather than
 * silently dropping it: charging for a cart the customer never actually
 * saw is worse than one clear error asking them to fix their cart.
 */
export async function reverifyOrderLines(
  requestLines: CheckoutRequestLine[],
): Promise<ReverifyResult> {
  if (requestLines.length === 0) {
    return { ok: false, reason: "Cart is empty" };
  }

  const results = await Promise.all(requestLines.map(reverifyOneLine));

  const failure = results.find((result) => !result.ok);
  if (failure && !failure.ok) {
    return { ok: false, reason: failure.reason };
  }

  const lines = results.map((result) => (result as { ok: true; line: OrderLineItem }).line);
  const subtotal = roundToCents(
    lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
  );

  return { ok: true, lines, subtotal };
}

type LineResult = { ok: true; line: OrderLineItem } | { ok: false; reason: string };

async function reverifyOneLine(requestLine: CheckoutRequestLine): Promise<LineResult> {
  const { menuItemId, quantity, selectedOptionIds } = requestLine;

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { ok: false, reason: `Invalid quantity for item ${menuItemId}` };
  }

  const item = await getMenuItemById(menuItemId);
  if (!item || !item.isAvailable) {
    return { ok: false, reason: `Item ${menuItemId} is no longer available` };
  }

  const optionGroups = await getOptionGroupsByIds(item.optionGroupIds);
  const allOptionIds = optionGroups.flatMap((group) => group.optionIds);
  const options = await getOptionsByIds(allOptionIds);
  const optionsById: Record<string, Option> = Object.fromEntries(
    options.map((option) => [option.id, option]),
  );
  const optionGroupsById: Record<string, OptionGroup> = Object.fromEntries(
    optionGroups.map((group) => [group.id, group]),
  );
  const validGroupIds = new Set(item.optionGroupIds);

  const selections: SelectionsByGroupId = {};
  for (const optionId of selectedOptionIds) {
    const option = optionsById[optionId];
    if (!option || !option.isAvailable || !validGroupIds.has(option.optionGroupId)) {
      return { ok: false, reason: `Selection ${optionId} is no longer valid for item ${menuItemId}` };
    }
    (selections[option.optionGroupId] ??= []).push(optionId);
  }

  if (!isModalValid(optionGroups, selections)) {
    return { ok: false, reason: `Required selections missing for item ${menuItemId}` };
  }

  const unitPrice = computeSelectionTotal(item, optionsById, selections);

  const orderSelections: OrderLineGroup[] = Object.entries(selections).map(
    ([optionGroupId, optionIds]) => ({
      optionGroupId,
      optionGroupName: optionGroupsById[optionGroupId].name,
      options: optionIds.map((optionId) => ({
        optionId,
        name: optionsById[optionId].name,
        priceModifier: optionsById[optionId].priceModifier,
      })),
    }),
  );

  return {
    ok: true,
    line: {
      menuItemId: item.id,
      name: item.name,
      unitPrice,
      quantity,
      selections: orderSelections,
    },
  };
}
