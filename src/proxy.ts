import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'
import { updateSession } from '@/lib/supabase/proxy'

const handleI18nRouting = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  const intlResponse = handleI18nRouting(request)

  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse
  }

  return updateSession(request, intlResponse ?? NextResponse.next({ request }))
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
