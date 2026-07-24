'use server'

import { redirect } from '@/i18n/navigation'
import { hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import { createAdminClient, STUDENT_MEDIA_BUCKET } from '@/lib/supabase/admin'

const GRADUATIONS = ['aluno', 'contra-mestre', 'mestre'] as const
const MAX_PHOTO_BYTES = 6 * 1024 * 1024
const MAX_CERT_BYTES = 10 * 1024 * 1024

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

  const password = String(formData.get('senha') ?? '')
  const passwordConfirm = String(formData.get('senha2') ?? '')
  if (password.length < 8 || password !== passwordConfirm) {
    redirect({ href: '/apresentacao?erro=senha', locale })
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

  // Optional certificate (e.g. graduation diploma): image or PDF
  const certRaw = formData.get('certificado')
  const cert =
    certRaw instanceof File &&
    certRaw.size > 0 &&
    certRaw.size <= MAX_CERT_BYTES &&
    (certRaw.type.startsWith('image/') || certRaw.type === 'application/pdf')
      ? certRaw
      : null

  const file = photo as File
  let outcome = 'enviado=1'
  try {
    const admin = createAdminClient()

    // The account exists from day one but locked: approved=false blocks
    // sign-in until the mestre approves. The password never touches our
    // storage — it goes straight into Supabase auth.
    const { data: created, error: userError } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { approved: false, status: 'pending' },
      })
    if (userError) {
      outcome = userError.message.toLowerCase().includes('registered')
        ? 'erro=email'
        : 'erro=servidor'
      throw userError
    }

    try {
      const id = crypto.randomUUID()
      const ext = (file.type.split('/')[1] ?? 'jpg').replace('jpeg', 'jpg')

      const { error: photoError } = await admin.storage
        .from(STUDENT_MEDIA_BUCKET)
        .upload(`applications/${id}/foto.${ext}`, file, {
          contentType: file.type,
        })
      if (photoError) throw photoError

      if (cert) {
        const certExt =
          cert.type === 'application/pdf'
            ? 'pdf'
            : (cert.type.split('/')[1] ?? 'jpg').replace('jpeg', 'jpg')
        const { error: certError } = await admin.storage
          .from(STUDENT_MEDIA_BUCKET)
          .upload(`applications/${id}/certificado.${certExt}`, cert, {
            contentType: cert.type,
          })
        if (certError) throw certError
      }

      const ficha = {
        name,
        email,
        where,
        since,
        graduation,
        message,
        locale,
        userId: created.user.id,
        approved: false,
        status: 'pending',
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
    } catch (e) {
      // Roll back the locked account if the ficha couldn't be stored
      await admin.auth.admin.deleteUser(created.user.id).catch(() => {})
      outcome = 'erro=servidor'
      throw e
    }
  } catch {
    if (outcome === 'enviado=1') outcome = 'erro=servidor'
  }

  redirect({ href: `/apresentacao?${outcome}`, locale })
}
