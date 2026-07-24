'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient, STUDENT_MEDIA_BUCKET } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/admins'

import { statusOf, type FichaStatus } from '@/lib/fichas'

// Member lifecycle: pending -> member <-> deactivated. Fichas are the
// association's registry — people leave and return, so records persist;
// true deletion exists only for still-pending spam.

type StoredFicha = {
  userId?: string
  approved?: boolean
  status?: FichaStatus
  [k: string]: unknown
}

async function requireAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return isAdminEmail(user?.email)
}

async function readFicha(id: string): Promise<StoredFicha | null> {
  const admin = createAdminClient()
  const { data: blob } = await admin.storage
    .from(STUDENT_MEDIA_BUCKET)
    .download(`applications/${id}/ficha.json`)
  if (!blob) return null
  try {
    return JSON.parse(await blob.text()) as StoredFicha
  } catch {
    return null
  }
}

async function writeFicha(id: string, ficha: StoredFicha): Promise<void> {
  const admin = createAdminClient()
  await admin.storage
    .from(STUDENT_MEDIA_BUCKET)
    .upload(
      `applications/${id}/ficha.json`,
      Buffer.from(JSON.stringify(ficha, null, 2)),
      { contentType: 'application/json', upsert: true }
    )
}

async function setStatus(
  formData: FormData,
  from: FichaStatus[],
  to: FichaStatus
): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!/^[0-9a-f-]{36}$/.test(id)) return
  if (!(await requireAdmin())) return

  const ficha = await readFicha(id)
  if (!ficha?.userId || !from.includes(statusOf(ficha))) return

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.updateUserById(ficha.userId, {
    app_metadata: { approved: to === 'member', status: to },
  })
  if (error) return

  await writeFicha(id, { ...ficha, approved: to === 'member', status: to })
  revalidatePath('/membros/fichas')
}

// Pending -> member: unlocks the account.
export async function approveApplication(formData: FormData) {
  await setStatus(formData, ['pending'], 'member')
}

// Member -> deactivated: suspends access, keeps the record. Takes effect
// on the person's next request (access checks read live auth state).
export async function deactivateMember(formData: FormData) {
  await setStatus(formData, ['member'], 'deactivated')
}

// Deactivated -> member: welcome back.
export async function reactivateMember(formData: FormData) {
  await setStatus(formData, ['deactivated'], 'member')
}

// Spam/mistake removal — allowed ONLY while still pending. Removes the
// locked account and every stored file.
export async function deleteApplication(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!/^[0-9a-f-]{36}$/.test(id)) return
  if (!(await requireAdmin())) return

  const admin = createAdminClient()
  const ficha = await readFicha(id)
  if (!ficha || statusOf(ficha) !== 'pending') return

  if (ficha.userId) {
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
