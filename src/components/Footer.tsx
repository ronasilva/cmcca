import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

export async function Footer() {
  const t = await getTranslations('Footer')

  return (
    <footer className="mt-20 border-t border-espresso/15">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="rounded-sm bg-plate p-1">
            <Image
              src="/gecaab-logo.png"
              alt=""
              width={48}
              height={31}
              className="h-6 w-auto"
            />
          </span>
          <div>
            <p className="font-display text-lg leading-none">GECAAB</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-espresso-2">
              {t('tagline')}
            </p>
          </div>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-espresso-2">
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  )
}
