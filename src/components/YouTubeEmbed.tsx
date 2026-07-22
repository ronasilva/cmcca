'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

type Props = {
  videoId: string
  title: string
  poster: string
}

type YTPlayer = { playVideo?: () => void; destroy?: () => void }
type YTNamespace = {
  Player: new (
    el: HTMLElement | string,
    config: {
      events?: {
        onReady?: (e: { target: YTPlayer }) => void
        onStateChange?: (e: { data: number }) => void
      }
    }
  ) => YTPlayer
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

// Single shared loader for the YouTube IFrame API across all embeds
let apiPromise: Promise<YTNamespace> | null = null
function loadYouTubeAPI(): Promise<YTNamespace> {
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT)
      return
    }
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve(window.YT as YTNamespace)
    }
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(s)
  })
  return apiPromise
}

/**
 * Click-to-play facade: a local poster until the visitor opts in — no
 * third-party requests before interaction (the API script warms on hover,
 * i.e. on demonstrated intent).
 *
 * Single-click playback is armed two ways, because browsers differ:
 * the iframe is created synchronously inside the click with autoplay=1
 * (WebKit propagates the gesture to frames created during it), and the
 * IFrame API calls playVideo() once ready (Chromium path). The poster
 * stays up, with a spinner, until the player reports PLAYING — so
 * YouTube's own play button never appears mid-initialisation.
 */
export function YouTubeEmbed({ videoId, title, poster }: Props) {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'player'>('idle')
  const boxRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // WebKit (Safari, and every iOS browser) forbids programmatic start of
  // unmuted cross-origin media outright — the only click that can start
  // playback is one inside YouTube's own player. So on WebKit we embed
  // the real player directly (lazily) instead of the facade: one click
  // for everyone, just via different paths.
  const direct = useSyncExternalStore(
    () => () => {},
    () => navigator.vendor?.includes('Apple') ?? false,
    () => false
  )

  useEffect(() => {
    const box = boxRef.current
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      playerRef.current?.destroy?.()
      box?.replaceChildren()
    }
  }, [])

  const warm = () => {
    loadYouTubeAPI()
  }

  const start = () => {
    if (phase !== 'idle') {
      // Second tap while still initialising: hand over to the player
      setPhase('player')
      return
    }
    setPhase('loading')
    const box = boxRef.current
    if (!box) return

    // Created synchronously within the click's gesture task
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&iv_load_policy=3&enablejsapi=1`
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    iframe.allowFullscreen = true
    iframe.title = title
    iframe.className = 'absolute inset-0 h-full w-full'
    box.appendChild(iframe)

    // Reveal on PLAYING; after a grace period reveal regardless, so a
    // blocked autoplay degrades to YouTube's own play button.
    timerRef.current = setTimeout(() => setPhase('player'), 2500)
    loadYouTubeAPI().then((YT) => {
      playerRef.current = new YT.Player(iframe, {
        events: {
          onReady: (e) => e.target.playVideo?.(),
          onStateChange: (e) => {
            if (e.data === 1) {
              if (timerRef.current) clearTimeout(timerRef.current)
              setPhase('player')
            }
          },
        },
      })
    })
  }

  if (direct) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&rel=0&iv_load_policy=3`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="block aspect-video w-full"
      />
    )
  }

  return (
    <div className="relative aspect-video w-full bg-background">
      <div ref={boxRef} className="absolute inset-0" />
      {phase !== 'player' && (
        <button
          type="button"
          onClick={start}
          onPointerEnter={warm}
          onFocus={warm}
          aria-label={title}
          className="group absolute inset-0 z-10 block w-full cursor-pointer"
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
            {phase === 'loading' ? (
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="h-5 w-5 animate-spin stroke-plate"
                fill="none"
                strokeWidth="1.5"
              >
                <path d="M8 1.5a6.5 6.5 0 1 1-6.5 6.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="ml-0.5 h-5 w-5 fill-plate transition group-hover:fill-terracotta"
              >
                <path d="M4 2.5v11l9-5.5-9-5.5z" />
              </svg>
            )}
          </span>
        </button>
      )}
    </div>
  )
}
