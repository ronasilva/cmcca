import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fr', 'pt', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always',
})
