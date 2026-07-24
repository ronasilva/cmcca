'use server'

import { redirect } from '@/i18n/navigation'
import { hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import { createAdminClient, STUDENT_MEDIA_BUCKET } from '@/lib/supabase/admin'

export async function submitQuestion(formData: FormData) {
  const rawLocale = String(formData.get('locale') ?? routing.defaultLocale)
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale

  // Honeypot: bots fill every field; humans never see this one.
  if (String(formData.get('website') ?? '') !== '') {
    redirect({ href: '/perguntas?enviado=1', locale })
  }

  const name = String(formData.get('nome') ?? '')
    .trim()
    .slice(0, 80)
  const question = String(formData.get('pergunta') ?? '').trim()

  if (!name || question.length < 10 || question.length > 2000) {
    redirect({ href: '/perguntas?erro=campos', locale })
  }

  let failed = false
  try {
    const admin = createAdminClient()
    const id = crypto.randomUUID()
    const body = {
      name,
      question,
      locale,
      submittedAt: new Date().toISOString(),
      published: false,
    }
    const { error } = await admin.storage
      .from(STUDENT_MEDIA_BUCKET)
      .upload(`questions/${id}.json`, Buffer.from(JSON.stringify(body, null, 2)), {
        contentType: 'application/json',
      })
    if (error) throw error
  } catch {
    failed = true
  }

  redirect({
    href: failed ? '/perguntas?erro=servidor' : '/perguntas?enviado=1',
    locale,
  })
}
