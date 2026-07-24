'use server'

import { redirect } from '@/i18n/navigation'
import { hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import { createAdminClient, STUDENT_MEDIA_BUCKET } from '@/lib/supabase/admin'

const GRADUATIONS = ['aluno', 'contra-mestre', 'mestre'] as const
const MAX_PHOTO_BYTES = 6 * 1024 * 1024

export async function submitApplication(formData: FormData) {
  const rawLocale = String(formData.get('locale') ?? routing.defaultLocale)
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale

  // Honeypot: bots fill every field; humans never see this one.
  if (String(formData.get('website') ?? '') !== '') {
    redirect({ href: '/apresentacao?enviado=1', locale })
  }

  const name = String(formData.get('nome') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const where = String(formData.get('onde') ?? '').trim()
  const graduation = String(formData.get('graduacao') ?? '')
  const message = String(formData.get('mensagem') ?? '').trim()

  // Partial date: month and year are required; the exact day is optional
  // (not everyone remembers it). Stored as YYYY-MM or YYYY-MM-DD.
  const year = String(formData.get('desdeAno') ?? '').trim()
  const month = String(formData.get('desdeMes') ?? '').trim()
  const day = String(formData.get('desdeDia') ?? '').trim()
  const monthNum = Number(month)
  const dayNum = day ? Number(day) : null
  const dateValid =
    /^\d{4}$/.test(year) &&
    month !== '' &&
    monthNum >= 1 &&
    monthNum <= 12 &&
    (dayNum === null || (dayNum >= 1 && dayNum <= 31))
  const since = !dateValid
    ? ''
    : dayNum === null
      ? `${year}-${String(monthNum).padStart(2, '0')}`
      : `${year}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`

  if (
    !name ||
    !email ||
    !email.includes('@') ||
    !where ||
    !since ||
    !GRADUATIONS.includes(graduation as (typeof GRADUATIONS)[number])
  ) {
    redirect({ href: '/apresentacao?erro=campos', locale })
  }

  const photo = formData.get('foto')
  if (
    !(photo instanceof File) ||
    photo.size === 0 ||
    photo.size > MAX_PHOTO_BYTES ||
    !photo.type.startsWith('image/')
  ) {
    redirect({ href: '/apresentacao?erro=foto', locale })
  }

  const file = photo as File
  let failed = false
  try {
    const admin = createAdminClient()
    const id = crypto.randomUUID()
    const ext = (file.type.split('/')[1] ?? 'jpg').replace('jpeg', 'jpg')

    const { error: photoError } = await admin.storage
      .from(STUDENT_MEDIA_BUCKET)
      .upload(`applications/${id}/foto.${ext}`, file, {
        contentType: file.type,
      })
    if (photoError) throw photoError

    const ficha = {
      name,
      email,
      where,
      since,
      graduation,
      message,
      locale,
      submittedAt: new Date().toISOString(),
    }
    const { error: jsonError } = await admin.storage
      .from(STUDENT_MEDIA_BUCKET)
      .upload(
        `applications/${id}/ficha.json`,
        Buffer.from(JSON.stringify(ficha, null, 2)),
        { contentType: 'application/json' }
      )
    if (jsonError) throw jsonError
  } catch {
    failed = true
  }

  redirect({
    href: failed ? '/apresentacao?erro=servidor' : '/apresentacao?enviado=1',
    locale,
  })
}
