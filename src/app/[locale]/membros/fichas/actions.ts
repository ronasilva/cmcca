'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient, STUDENT_MEDIA_BUCKET } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/admins'

async function requireAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return isAdminEmail(user?.email)
}

async function readFicha(id: string) {
  const admin = createAdminClient()
  const { data: blob } = await admin.storage
    .from(STUDENT_MEDIA_BUCKET)
    .download(`applications/${id}/ficha.json`)
  if (!blob) return null
  try {
    return JSON.parse(await blob.text()) as {
      userId?: string
      approved?: boolean
      [k: string]: unknown
    }
  } catch {
    return null
  }
}

// Unlocks the applicant's account and marks the ficha as approved —
// the ficha itself stays, as the association's registry. Admin-only.
export async function approveApplication(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!/^[0-9a-f-]{36}$/.test(id)) return
  if (!(await requireAdmin())) return

  const admin = createAdminClient()
  const ficha = await readFicha(id)
  if (!ficha?.userId) return

  const { error } = await admin.auth.admin.updateUserById(ficha.userId, {
    app_metadata: { approved: true },
  })
  if (error) return

  await admin.storage
    .from(STUDENT_MEDIA_BUCKET)
    .upload(
      `applications/${id}/ficha.json`,
      Buffer.from(JSON.stringify({ ...ficha, approved: true }, null, 2)),
      { contentType: 'application/json', upsert: true }
    )
  revalidatePath('/membros/fichas')
}

// Removes a spam/mistaken application (photo + ficha.json). If the
// ficha was never approved, its locked account goes too. Admin-only.
export async function deleteApplication(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!/^[0-9a-f-]{36}$/.test(id)) return
  if (!(await requireAdmin())) return

  const admin = createAdminClient()
  const ficha = await readFicha(id)
  if (ficha?.userId && ficha.approved !== true) {
    await admin.auth.admin.deleteUser(ficha.userId).catch(() => {})
  }

  const { data } = await admin.storage
    .from(STUDENT_MEDIA_BUCKET)
    .list(`applications/${id}`, { limit: 20 })
  const files = (data ?? [])
    .filter((f) => f.id !== null)
    .map((f) => `applications/${id}/${f.name}`)
  if (files.length > 0) {
    await admin.storage.from(STUDENT_MEDIA_BUCKET).remove(files)
  }
  revalidatePath('/membros/fichas')
}
