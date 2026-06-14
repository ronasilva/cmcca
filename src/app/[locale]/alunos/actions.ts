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

  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect({ href: '/', locale })
}
