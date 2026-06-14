import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

export async function Footer() {
  const t = await getTranslations('Footer')

  return (
    <footer className="mt-20 border-t border-espresso/15">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/cmcca-logo.png"
            alt=""
            width={48}
            height={48}
            className="h-8 w-8 object-contain"
          />
          <div>
            <p className="font-display text-lg leading-none">{t('association')}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-espresso-2">
              {t('school')}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-espresso-2">
            {t('tagline')}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-espresso-2">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
