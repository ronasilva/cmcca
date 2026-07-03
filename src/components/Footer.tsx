import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export async function Footer() {
  const t = await getTranslations('Footer')
  const tn = await getTranslations('Nav')

  return (
    <footer id="contact" className="mt-20 scroll-mt-16 border-t border-espresso/15">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 sm:grid-cols-12">
        <div className="flex items-start gap-3 sm:col-span-4">
          <Image
            src="/cmcca-logo.png"
            alt=""
            width={48}
            height={48}
            className="h-8 w-8 object-contain"
          />
          <div>
            <p className="font-display text-lg leading-none">{t('association')}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.3em] text-espresso-2">
              {t('school')}
            </p>
          </div>
        </div>
        <div className="sm:col-span-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
            <Link href="/cours" className="transition hover:text-terracotta-2">
              {tn('courses')} →
            </Link>
          </p>
          <ul className="mt-3 space-y-1 font-display text-base italic text-espresso">
            <li>{t('classesSchedule')}</li>
            <li>{t('classesPlace')}</li>
          </ul>
        </div>
        <div className="sm:col-span-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
            {tn('contact')}
          </p>
          <ul className="mt-3 space-y-1 font-display text-base italic text-espresso">
            <li>
              <a href="mailto:nevesbraga1@bluewin.ch" className="hover:text-terracotta">
                nevesbraga1@bluewin.ch
              </a>
            </li>
            <li>+41 (0) 78 914 89 69</li>
            <li>
              <a
                href="https://www.facebook.com/CapoeiraGeneveAfricaBantu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-terracotta"
              >
                @CapoeiraGeneveAfricaBantu
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2 sm:items-end sm:text-right">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-espresso-2">
            {t('tagline')}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-espresso-2">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
