'use server'

import { redirect } from '@/i18n/navigation'
import { hasLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/server'
import { routing } from '@/i18n/routing'

export async function signOut(formData: FormData) {
  const rawLocale = String(formData.get('locale') ?? routing.defaultLocale)
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale

  // No-op when Supabase isn't configured (e.g. local dev) — just go home.
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  redirect({ href: '/', locale })
}
