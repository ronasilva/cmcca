import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from './LanguageSwitcher'

export async function Header() {
  const t = await getTranslations('Nav')

  const links = [
    { href: '/mestre', label: t('mestre') },
    { href: '/cours', label: t('courses') },
    { href: '/galeria', label: t('gallery') },
    { href: '/historia', label: t('history') },
  ] as const

  return (
    <header>
      {/* MASTHEAD BAND */}
      <div className="border-b border-espresso/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-6">
          <Link href="/" className="flex items-center gap-4">
            <span className="rounded-sm bg-plate p-1.5">
              <Image
                src="/gecaab-logo.png"
                alt="GECAAB — Grupo / Escola de Capoeira Angola — África Bantu"
                width={120}
                height={77}
                className="h-12 w-auto"
                priority
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-2xl font-medium tracking-tight text-espresso">
                GECAAB
              </span>
              <span className="mt-2 font-mono text-[9px] uppercase tracking-[0.25em] text-espresso-2">
                Capoeira Angola · Genève
              </span>
            </span>
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      {/* NAV RAIL */}
      <div className="border-b border-espresso/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
          <ul className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-espresso-2 transition hover:text-espresso"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/login"
            className="ml-auto font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
          >
            {t('studentArea')} →
          </Link>
        </div>
      </div>
    </header>
  )
}
