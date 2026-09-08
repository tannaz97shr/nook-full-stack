"use client";

import Image from "next/image";
import { GALLERY_HEADER, GALLERY_PHOTOS } from "../content/galleryContent";
import { useLightbox } from "../hooks/useLightbox";
import { GalleryLightbox } from "./GalleryLightbox";

export function GalleryScreen() {
  const { current, open, close, prev, next } = useLightbox(GALLERY_PHOTOS);

  return (
    <main className="mx-auto max-w-[1240px] px-4 py-8 sm:px-8 md:py-12">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl text-ink">{GALLERY_HEADER.heading}</h1>
        <p className="mt-3 text-lg text-ink-muted">{GALLERY_HEADER.body}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {GALLERY_PHOTOS.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => open(index)}
            className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-sunken shadow-sm"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {current && <GalleryLightbox photo={current} onClose={close} onPrev={prev} onNext={next} />}
    </main>
  );
}
