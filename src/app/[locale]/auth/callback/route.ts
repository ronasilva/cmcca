import { NextResponse } from 'next/server'
import { hasLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/server'
import { routing } from '@/i18n/routing'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale: rawLocale } = await params
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale

  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const nextParam = searchParams.get('next')
  const next =
    nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')
      ? nextParam
      : '/membros'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}/${locale}${next}`)
  }

  return NextResponse.redirect(
    `${origin}/${locale}/login?error=auth_callback_failed`
  )
}
