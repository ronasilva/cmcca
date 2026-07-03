'use client'

import { useLocale } from 'next-intl'
import { useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div
      aria-label="Language"
      className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.15em]"
    >
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden className="text-espresso/25">
              /
            </span>
          )}
          <button
            type="button"
            disabled={isPending || loc === locale}
            onClick={() =>
              startTransition(() =>
                router.replace(pathname, { locale: loc })
              )
            }
            className={
              loc === locale
                ? 'text-terracotta'
                : 'text-espresso-2 transition hover:text-espresso'
            }
          >
            {loc}
          </button>
        </span>
      ))}
    </div>
  )
}
