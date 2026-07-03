'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

type Photo = { src: string; caption: string }
type Labels = { close: string; previous: string; next: string }

export function GalleryGrid({ photos, labels }: { photos: Photo[]; labels: Labels }) {
  const [index, setIndex] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setIndex(null), [])
  const step = useCallback(
    (delta: number) =>
      setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length]
  )

  useEffect(() => {
    if (index === null) return
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [index !== null, close, step]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p, i) => (
          <li key={p.src} className="group">
            <figure>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="block w-full cursor-zoom-in overflow-hidden rounded-sm border border-espresso/15 bg-cream-2/40"
              >
                <Image
                  src={p.src}
                  alt={p.caption}
                  width={1200}
                  height={1200}
                  className="aspect-square h-auto w-full object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={i < 3}
                />
              </button>
              <figcaption className="mt-3 flex items-baseline gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                  N°&nbsp;{String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-sm italic text-espresso">
                  {p.caption}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {index !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photos[index].caption}
          className="fixed inset-0 z-50 flex flex-col bg-background/95 p-4 sm:p-8"
          onClick={close}
        >
          <div className="flex justify-end">
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="p-2 font-mono text-[12px] uppercase tracking-[0.18em] text-espresso-2 transition hover:text-espresso"
            >
              {labels.close} ✕
            </button>
          </div>
          <div
            className="flex min-h-0 flex-1 items-center justify-center gap-2 sm:gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={labels.previous}
              className="shrink-0 p-2 font-display text-3xl text-espresso-2 transition hover:text-espresso"
            >
              ←
            </button>
            <figure className="flex min-h-0 flex-1 flex-col items-center self-stretch">
              <div className="relative min-h-0 w-full flex-1">
                <Image
                  src={photos[index].src}
                  alt={photos[index].caption}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <figcaption className="mt-4 flex items-baseline gap-3 text-center">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                  {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
                </span>
                <span className="font-display text-sm italic text-espresso">
                  {photos[index].caption}
                </span>
              </figcaption>
            </figure>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={labels.next}
              className="shrink-0 p-2 font-display text-3xl text-espresso-2 transition hover:text-espresso"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
