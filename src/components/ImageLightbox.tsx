"use client";

import { useState } from "react";
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
  className?: string;
};

export function ImageLightbox({ images, alt, className }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  function prev() { setIndex((i) => (i - 1 + images.length) % images.length); }
  function next() { setIndex((i) => (i + 1) % images.length); }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <>
      {/* Thumbnails */}
      <div className={cn(
        images.length === 1 ? "" : "grid grid-cols-2 gap-2",
        className
      )}>
        {images.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => { setIndex(i); setOpen(true); }}
            className="rounded-lg border overflow-hidden block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`${alt} ${i + 1}`}
              className="max-h-64 w-full object-contain bg-muted/20"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          role="dialog"
          aria-modal
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white rounded-full bg-black/40 p-2"
          >
            <XIcon className="size-5" />
          </button>

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index]}
              alt={`${alt} ${index + 1}`}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            />
          </div>

          {/* Prev / Next */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 text-white/80 hover:text-white bg-black/40 rounded-full p-2"
              >
                <ChevronLeftIcon className="size-6" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 text-white/80 hover:text-white bg-black/40 rounded-full p-2"
              >
                <ChevronRightIcon className="size-6" />
              </button>
              <p className="absolute bottom-4 text-white/60 text-sm">
                {index + 1} / {images.length}
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
