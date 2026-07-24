'use server'

import { redirect } from '@/i18n/navigation'
import { hasLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/server'
import { routing } from '@/i18n/routing'

function isSafeRedirect(path: string | null | undefined): path is string {
  return !!path && path.startsWith('/') && !path.startsWith('//')
}

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '')
  const rawLocale = String(formData.get('locale') ?? routing.defaultLocale)
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale

  // No auth backend configured: in development sign-in passes through for
  // preview (the proxy leaves the member area open there); in production
  // it fails closed — nobody can sign in without a real backend.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    if (process.env.NODE_ENV === 'development') {
      redirect({ href: isSafeRedirect(next) ? next : '/membros', locale })
    }
    const params = new URLSearchParams({ error: 'invalid_credentials' })
    redirect({ href: `/login?${params.toString()}`, locale })
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    const params = new URLSearchParams({ error: 'invalid_credentials' })
    if (isSafeRedirect(next)) params.set('next', next)
    redirect({ href: `/login?${params.toString()}`, locale })
  }

  // Ficha accounts stay locked until the mestre approves — don't keep a
  // session for them, just explain the state.
  if (data?.user?.app_metadata?.approved === false) {
    await supabase.auth.signOut()
    redirect({ href: '/login?error=pending', locale })
  }

  redirect({ href: isSafeRedirect(next) ? next : '/membros', locale })
}
