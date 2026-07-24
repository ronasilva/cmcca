import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'

const LOCALE_PATTERN = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`)

function stripLocale(pathname: string): { locale: string; rest: string } {
  const match = pathname.match(LOCALE_PATTERN)
  if (!match) return { locale: routing.defaultLocale, rest: pathname }
  return {
    locale: match[1],
    rest: pathname.slice(match[0].length) || '/',
  }
}

export async function updateSession(
  request: NextRequest,
  initialResponse: NextResponse
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !publishableKey) {
    // No auth backend configured. In development the member area stays
    // open for preview; anywhere else it fails CLOSED — an unconfigured
    // deployment must never expose member content.
    if (process.env.NODE_ENV !== 'development') {
      const { locale, rest } = stripLocale(request.nextUrl.pathname)
      if (rest.startsWith('/membros')) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = `/${locale}/login`
        redirectUrl.search = ''
        return NextResponse.redirect(redirectUrl)
      }
    }
    return initialResponse
  }

  const response = initialResponse
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  // Fail fast: never let a slow or unreachable Supabase hang every request.
  // If the auth check doesn't answer in time, treat the visitor as logged out.
  const AUTH_TIMEOUT_MS = 2000
  const user = await Promise.race([
    supabase.auth.getUser().then(({ data }) => data.user),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), AUTH_TIMEOUT_MS)),
  ]).catch(() => null)

  const { locale, rest } = stripLocale(request.nextUrl.pathname)
  const isProtected = rest.startsWith('/membros')
  const isAuthRoute = rest === '/login' || rest.startsWith('/login/')

  // Accounts created via the ficha carry approved:false until the mestre
  // approves; they must not reach the member area. (Pre-existing accounts
  // have no flag and pass.)
  const pending = user?.app_metadata?.approved === false

  if (isProtected && (!user || pending)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = `/${locale}/login`
    redirectUrl.search = ''
    if (pending) redirectUrl.searchParams.set('error', 'pending')
    else redirectUrl.searchParams.set('next', rest)
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && user && !pending) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = `/${locale}/membros`
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  return response
}
