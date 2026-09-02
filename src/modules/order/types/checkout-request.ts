/**
 * The minimal untrusted shape the client sends to /api/checkout — ids and
 * quantity only, never names or prices. selectedOptionIds is flat (not
 * grouped by optionGroupId): the server re-derives each option's live
 * optionGroupId itself rather than trusting a client-supplied grouping,
 * which would let a tampered client pair a real option id with a wrong
 * group id to confuse group-level (min/max/required) validation.
 */
export interface CheckoutRequestLine {
  menuItemId: string;
  quantity: number;
  selectedOptionIds: string[];
}

export interface CheckoutRequestBody {
  lines: CheckoutRequestLine[];
}
