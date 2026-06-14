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
    // Supabase not yet configured — skip auth checks so the app still runs.
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

  const { data: { user } } = await supabase.auth.getUser()

  const { locale, rest } = stripLocale(request.nextUrl.pathname)
  const isProtected = rest.startsWith('/alunos')
  const isAuthRoute = rest === '/login' || rest.startsWith('/login/')

  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = `/${locale}/login`
    redirectUrl.search = ''
    redirectUrl.searchParams.set('next', rest)
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = `/${locale}/alunos`
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  return response
}
