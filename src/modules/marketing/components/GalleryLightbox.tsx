"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { GalleryPhoto } from "../types/gallery";

export interface GalleryLightboxProps {
  photo: GalleryPhoto;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function GalleryLightbox({ photo, onClose, onPrev, onNext }: GalleryLightboxProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
      // A photo lightbox needs a near-opaque dark scrim regardless of theme
      // so the photo stays the focus — the `overlay` token is a much
      // lighter backdrop meant for form/menu dialogs (Modal.tsx) where the
      // page should stay visible behind it. Same static-color exemption
      // already used in AuthScreen.tsx for its photo-overlay quote text.
      style={{ background: "rgba(14, 9, 6, 0.94)" }}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-pill text-2xl text-gold-ink hover:bg-white/10"
      >
        ×
      </button>
      <button
        type="button"
        aria-label="Previous photo"
        onClick={onPrev}
        className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-pill text-2xl text-gold-ink hover:bg-white/10 sm:left-4"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next photo"
        onClick={onNext}
        className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-pill text-2xl text-gold-ink hover:bg-white/10 sm:right-4"
      >
        ›
      </button>
      <div className="relative h-[70vh] w-full max-w-4xl">
        <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-contain" />
      </div>
      <p className="mt-4 max-w-xl text-center font-display text-lg italic text-gold-ink">{photo.caption}</p>
    </div>
  );
}
