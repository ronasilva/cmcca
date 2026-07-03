'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'

/**
 * Compact wordmark inside the sticky nav rail. Hidden while the masthead
 * (marked with [data-masthead]) is on screen, so the brand never appears
 * twice; fades in once the rail is navigating on its own.
 */
export function RailBrand() {
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const masthead = document.querySelector('[data-masthead]')
    if (!masthead) return
    const io = new IntersectionObserver(([entry]) =>
      setStuck(!entry.isIntersecting)
    )
    io.observe(masthead)
    return () => io.disconnect()
  }, [])

  return (
    <div
      aria-hidden={!stuck}
      className={`flex shrink-0 items-center gap-4 overflow-hidden transition-all duration-300 md:gap-6 ${
        stuck ? 'max-w-40 opacity-100' : '-ml-4 max-w-0 opacity-0 md:-ml-6'
      }`}
    >
      <Link
        href="/"
        tabIndex={stuck ? 0 : -1}
        className="flex items-center gap-2.5 font-display text-base font-medium tracking-tight text-espresso transition hover:text-terracotta"
      >
        <Image
          src="/cmcca-logo.png"
          alt="CMC/CA"
          width={370}
          height={373}
          className="h-6 w-6 shrink-0 object-contain"
        />
        <span className="hidden md:inline">CMC/CA</span>
      </Link>
      <span aria-hidden className="h-4 w-px shrink-0 bg-espresso/20" />
    </div>
  )
}
