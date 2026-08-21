'use client'

import { useEffect } from 'react'

// One sound at a time: when any <audio> or <video> on the page starts
// playing, pause all the others. Mount once per page with multiple players.
export function ExclusiveAudio() {
  useEffect(() => {
    const onPlay = (e: Event) => {
      const target = e.target
      if (!(target instanceof HTMLMediaElement)) return
      document.querySelectorAll('audio, video').forEach((el) => {
        if (el !== target) (el as HTMLMediaElement).pause()
      })
    }
    // 'play' doesn't bubble, so listen in the capture phase
    document.addEventListener('play', onPlay, true)
    return () => document.removeEventListener('play', onPlay, true)
  }, [])
  return null
}
