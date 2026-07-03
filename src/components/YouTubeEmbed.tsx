'use client'

import Image from 'next/image'
import { useState } from 'react'

type Props = {
  videoId: string
  title: string
  poster: string
}

/**
 * Click-to-play facade: shows a local poster with a play button until the
 * visitor opts in, then swaps in the privacy-enhanced YouTube iframe.
 * No third-party requests (or dark loading void) before interaction.
 */
export function YouTubeEmbed({ videoId, title, poster }: Props) {
  const [play, setPlay] = useState(false)

  if (play) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="block aspect-video w-full"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      aria-label={title}
      className="group relative block aspect-video w-full cursor-pointer"
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 60vw"
        className="object-cover"
      />
      <span className="absolute inset-0 bg-background/20 transition group-hover:bg-background/5" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-plate/70 bg-background/60 backdrop-blur-sm transition group-hover:border-terracotta group-hover:bg-background/80">
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="ml-0.5 h-5 w-5 fill-plate transition group-hover:fill-terracotta"
        >
          <path d="M4 2.5v11l9-5.5-9-5.5z" />
        </svg>
      </span>
    </button>
  )
}
