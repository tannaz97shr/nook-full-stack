"use client";

import { useEffect, useState } from "react";

/**
 * False on the server render and on this component's own first client
 * render (so hydration always matches), true once it has mounted. Use it,
 * not an ancestor's state, for anything rendered into server HTML: a
 * streamed Suspense boundary hydrates after its ancestors, when their state
 * may already have moved on from what the server rendered.
 */
export function useHasMounted(): boolean {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return hasMounted;
}
