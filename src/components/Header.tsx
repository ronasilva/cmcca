import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from './LanguageSwitcher'

export async function Header() {
  const t = await getTranslations('Nav')

  const links = [
    { href: '/associacao', label: t('association') },
    { href: '/mestre', label: t('mestre') },
    { href: '/cours', label: t('courses') },
    { href: '/biblioteca', label: t('library') },
    { href: '/galeria', label: t('gallery') },
    { href: '/historia', label: t('history') },
  ] as const

  return (
    <header>
      {/* MASTHEAD — wordmark only (the emblem lives in the page body) */}
      <div className="border-b border-espresso/15">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-5">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-display text-xl font-medium tracking-tight text-espresso">
              CMC/CA
            </span>
            <span className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-espresso-2">
              Conhecimento de Memória dos Capoeiras em Capoeira Angola
            </span>
          </Link>
        </div>
      </div>

      {/* NAV RAIL — menu + language + member area together */}
      <div className="border-b border-espresso/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
          <nav className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-espresso-2 transition hover:text-espresso"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-5">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
            >
              {t('memberArea')} →
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
