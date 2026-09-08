"use client";

import { useCallback, useState } from "react";
import type { GalleryPhoto } from "../types/gallery";

export function useLightbox(photos: GalleryPhoto[]) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const open = useCallback((index: number) => setOpenIndex(index), []);
  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((index) => (index === null ? null : (index - 1 + photos.length) % photos.length)),
    [photos.length],
  );
  const next = useCallback(
    () => setOpenIndex((index) => (index === null ? null : (index + 1) % photos.length)),
    [photos.length],
  );

  return {
    openIndex,
    current: openIndex === null ? null : photos[openIndex],
    open,
    close,
    prev,
    next,
  };
}
