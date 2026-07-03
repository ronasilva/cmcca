'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, usePathname } from '@/i18n/navigation'

type NavLink = { href: string; label: string }

type Props = {
  links: NavLink[]
  memberLabel: string
  menuLabel: string
  closeLabel: string
}

/**
 * Full-screen menu for small screens: every destination visible at once,
 * numbered in the site's editorial register. Desktop keeps the nav rail.
 */
export function MobileMenu({ links, memberLabel, menuLabel, closeLabel }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-espresso transition hover:text-terracotta"
      >
        <span aria-hidden className="flex flex-col gap-0.75">
          <span className="block h-px w-4 bg-current" />
          <span className="block h-px w-4 bg-current" />
          <span className="block h-px w-4 bg-current" />
        </span>
        {menuLabel}
      </button>

      {/* Portal to body: the blurred sticky rail would otherwise become the
          containing block for this fixed overlay. */}
      {open &&
        createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={menuLabel}
          className="fixed inset-0 z-50 flex flex-col bg-background"
        >
          <div className="flex items-center justify-between border-b border-espresso/15 px-6 py-4">
            <span className="font-display text-base font-medium tracking-tight text-espresso">
              CMC/CA
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-mono text-[12px] uppercase tracking-[0.18em] text-espresso-2 transition hover:text-espresso"
            >
              {closeLabel} ✕
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-10">
            <ol className="flex flex-col gap-7">
              {links.map((l, i) => {
                const base = l.href.split('#')[0]
                const active =
                  base !== '' && base !== '/' && pathname.startsWith(base)
                const className = `font-display text-3xl font-light italic leading-none transition ${
                  active ? 'text-terracotta' : 'text-espresso'
                }`
                return (
                  <li key={l.href} className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-terracotta">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {base === '' ? (
                      <a
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={className}
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={className}
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>

          <div className="border-t border-espresso/15 px-6 py-5">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
            >
              {memberLabel} →
            </Link>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
