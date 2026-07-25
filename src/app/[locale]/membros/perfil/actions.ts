'use server'

import { redirect } from '@/i18n/navigation'
import { hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient, STUDENT_MEDIA_BUCKET } from '@/lib/supabase/admin'
import { findMemberFicha } from '@/lib/member-ficha'

const GRADUATIONS = ['aluno', 'contra-mestre', 'mestre'] as const
const MAX_PHOTO_BYTES = 6 * 1024 * 1024
const MAX_CERT_BYTES = 10 * 1024 * 1024

export async function updateProfile(formData: FormData) {
  const rawLocale = String(formData.get('locale') ?? routing.defaultLocale)
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect({ href: '/login?next=%2Fmembros%2Fperfil', locale })
    return
  }

  // Optional password change: both fields empty means keep the current one.
  const password = String(formData.get('senha') ?? '')
  const passwordConfirm = String(formData.get('senha2') ?? '')
  const wantsPassword = password !== '' || passwordConfirm !== ''
  if (wantsPassword && (password.length < 8 || password !== passwordConfirm)) {
    redirect({ href: '/membros/perfil?erro=senha', locale })
  }

  const member = await findMemberFicha(user.id)

  const name = String(formData.get('nome') ?? '').trim()
  const apelido = String(formData.get('apelido') ?? '')
    .trim()
    .slice(0, 60)
  const where = String(formData.get('onde') ?? '').trim()
  const graduation = String(formData.get('graduacao') ?? '')

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
    member &&
    (!name ||
      !where ||
      !since ||
      !GRADUATIONS.includes(graduation as (typeof GRADUATIONS)[number]))
  ) {
    redirect({ href: '/membros/perfil?erro=campos', locale })
  }

  // Optional photo replacement — empty means keep the current one.
  const photoRaw = formData.get('foto')
  const photo =
    photoRaw instanceof File && photoRaw.size > 0 ? photoRaw : null
  if (photo && (photo.size > MAX_PHOTO_BYTES || !photo.type.startsWith('image/'))) {
    redirect({ href: '/membros/perfil?erro=foto', locale })
  }

  // Optional certificate replacement
  const certRaw = formData.get('certificado')
  const cert =
    certRaw instanceof File &&
    certRaw.size > 0 &&
    certRaw.size <= MAX_CERT_BYTES &&
    (certRaw.type.startsWith('image/') || certRaw.type === 'application/pdf')
      ? certRaw
      : null

  try {
    const admin = createAdminClient()

    if (member) {
      const path = (file: string) => `applications/${member.folder}/${file}`
      const { data: files } = await admin.storage
        .from(STUDENT_MEDIA_BUCKET)
        .list(`applications/${member.folder}`, { limit: 10 })

      const replaceFile = async (prefix: string, file: File, ext: string) => {
        const stale = (files ?? [])
          .filter((f) => f.name.startsWith(prefix))
          .map((f) => path(f.name))
        if (stale.length > 0) {
          await admin.storage.from(STUDENT_MEDIA_BUCKET).remove(stale)
        }
        const { error } = await admin.storage
          .from(STUDENT_MEDIA_BUCKET)
          .upload(path(`${prefix}.${ext}`), file, {
            contentType: file.type,
            upsert: true,
          })
        if (error) throw error
      }

      if (photo) {
        const ext = (photo.type.split('/')[1] ?? 'jpg').replace('jpeg', 'jpg')
        await replaceFile('foto', photo, ext)
      }
      if (cert) {
        const ext =
          cert.type === 'application/pdf'
            ? 'pdf'
            : (cert.type.split('/')[1] ?? 'jpg').replace('jpeg', 'jpg')
        await replaceFile('certificado', cert, ext)
      }

      const ficha = {
        ...member.ficha,
        name,
        apelido,
        where,
        since,
        graduation,
        updatedAt: new Date().toISOString(),
      }
      const { error: jsonError } = await admin.storage
        .from(STUDENT_MEDIA_BUCKET)
        .upload(
          path('ficha.json'),
          Buffer.from(JSON.stringify(ficha, null, 2)),
          { contentType: 'application/json', upsert: true }
        )
      if (jsonError) throw jsonError
    }

    // Auth record: display names for the nav rail, plus the new password.
    // Through the member's own session (not the admin API) so changing the
    // password doesn't revoke the session they're using right now.
    const { error: userError } = await supabase.auth.updateUser({
      ...(wantsPassword ? { password } : {}),
      ...(member ? { data: { name, apelido } } : {}),
    })
    if (userError) throw userError
  } catch {
    redirect({ href: '/membros/perfil?erro=servidor', locale })
  }

  redirect({ href: '/membros/perfil?salvo=1', locale })
}
