#!/usr/bin/env bash
# Forwards Stripe test-mode webhooks to the local dev server: `bun run stripe:listen`.
#
# Reads STRIPE_SECRET_KEY from .env.local at runtime and passes it with --api-key,
# because a plain `stripe listen` under the CLI's OAuth login fails with a 403.
# --events is required on Stripe CLI 1.53. No secrets live in this file, and the
# key is never printed. Copy the `whsec_...` value it prints into
# STRIPE_WEBHOOK_SECRET in .env.local, then restart the dev server.
set -euo pipefail

cd "$(dirname "$0")/.."

ENV_FILE=".env.local"
EVENTS="checkout.session.completed,checkout.session.expired"
FORWARD_TO="localhost:3000/api/webhooks/stripe"

if ! command -v stripe >/dev/null 2>&1; then
  echo "stripe-listen: Stripe CLI not found — install it first (brew install stripe/stripe-cli/stripe)." >&2
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "stripe-listen: $ENV_FILE not found in the repo root." >&2
  exit 1
fi

# Last STRIPE_SECRET_KEY= line wins (same as dotenv); strip quotes, spaces, tabs and CR.
KEY="$(grep -E '^[[:space:]]*(export[[:space:]]+)?STRIPE_SECRET_KEY[[:space:]]*=' "$ENV_FILE" | tail -n 1 | cut -d= -f2- | tr -d "\"' \t\r" || true)"

if [[ -z "$KEY" ]]; then
  echo "stripe-listen: STRIPE_SECRET_KEY is missing or empty in $ENV_FILE." >&2
  exit 1
fi

exec stripe listen --api-key "$KEY" --events "$EVENTS" --forward-to "$FORWARD_TO"
