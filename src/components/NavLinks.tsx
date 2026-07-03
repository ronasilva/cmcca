'use client'

import { Link, usePathname } from '@/i18n/navigation'

type NavLink = { href: string; label: string }

export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-7">
      {links.map((l) => {
        const base = l.href.split('#')[0]
        const active = base !== '' && base !== '/' && pathname.startsWith(base)
        const className = `whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.18em] transition ${
          active ? 'text-terracotta' : 'text-espresso-2 hover:text-espresso'
        }`
        // Hash-only links (e.g. #contact) scroll on the current page
        if (base === '') {
          return (
            <a key={l.href} href={l.href} className={className}>
              {l.label}
            </a>
          )
        }
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? 'page' : undefined}
            className={className}
          >
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}
