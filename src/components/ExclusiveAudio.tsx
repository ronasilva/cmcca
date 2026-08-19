'use client'

import { useEffect } from 'react'

// One sound at a time: when any <audio> on the page starts playing,
// pause all the others. Mount once per page that has multiple players.
export function ExclusiveAudio() {
  useEffect(() => {
    const onPlay = (e: Event) => {
      const target = e.target
      if (!(target instanceof HTMLAudioElement)) return
      document.querySelectorAll('audio').forEach((a) => {
        if (a !== target) a.pause()
      })
    }
    // 'play' doesn't bubble, so listen in the capture phase
    document.addEventListener('play', onPlay, true)
    return () => document.removeEventListener('play', onPlay, true)
  }, [])
  return null
}
