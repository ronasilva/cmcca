import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'
import { NavLinks } from './NavLinks'
import { RailBrand } from './RailBrand'

export async function Header() {
  const t = await getTranslations('Nav')

  const links = [
    { href: '/associacao', label: t('association') },
    { href: '/mestre', label: t('mestre') },
    { href: '/cours', label: t('courses') },
    { href: '/biblioteca', label: t('library') },
    { href: '/galeria', label: t('gallery') },
    { href: '/historia', label: t('history') },
    { href: '#contact', label: t('contact') },
  ] as const

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-terracotta focus:px-4 focus:py-2 focus:font-mono focus:text-[12px] focus:uppercase focus:tracking-[0.18em] focus:text-background"
      >
        {t('skipToContent')}
      </a>

      {/* MASTHEAD — the wordmark speaks in the site's display voice; the
          tagline answers in the italic register, so neither reads as menu.
          Language selection lives in the utility corner, top right. */}
      <header data-masthead className="border-b border-espresso/15">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-6 px-6 py-6">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/cmcca-logo.png"
              alt=""
              width={370}
              height={373}
              priority
              className="h-12 w-12 object-contain md:h-14 md:w-14"
            />
            <span className="flex flex-col">
              <span className="font-display text-3xl font-light tracking-tight text-espresso md:text-4xl">
                CMC/CA
              </span>
              <span className="mt-1 hidden font-display text-sm italic leading-snug text-espresso-2 sm:block">
                Conhecimento de Memória dos Capoeiras em Capoeira Angola
              </span>
            </span>
          </Link>
          <div className="pt-1.5">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* NAV RAIL — sticky; a compact wordmark keeps the way home visible
          once the masthead scrolls away. Small screens get a full-screen
          menu; md+ keeps the inline rail. */}
      <div className="sticky top-0 z-40 border-b border-espresso/15 bg-background/90 backdrop-blur-sm">
        <div className="scrollbar-none mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-6 py-3">
          <RailBrand />
          <MobileMenu
            links={[...links]}
            memberLabel={t('memberArea')}
            menuLabel={t('menu')}
            closeLabel={t('close')}
          />
          <div className="hidden md:block">
            <NavLinks links={[...links]} />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-5 pl-2">
            <Link
              href="/login"
              className="whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
            >
              {t('memberArea')} →
            </Link>
          </div>
        </div>
      </div>

      {/* Skip-link target: the page content starts right after the header */}
      <div id="conteudo" />
    </>
  )
}
