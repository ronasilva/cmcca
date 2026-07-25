'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient, STUDENT_MEDIA_BUCKET } from '@/lib/supabase/admin'
import { isAdminUser } from '@/lib/admins'

import { statusOf, type FichaStatus } from '@/lib/fichas'

// Member lifecycle: pending -> member <-> deactivated. Fichas are the
// association's registry — people leave and return, so deactivation is the
// normal path; permanent deletion exists for spam and for members who ask
// to be erased.

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
  return isAdminUser(user)
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
  const { data: existing } = await admin.auth.admin.getUserById(ficha.userId)
  const { error } = await admin.auth.admin.updateUserById(ficha.userId, {
    app_metadata: {
      ...existing?.user?.app_metadata,
      approved: to === 'member',
      status: to,
    },
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

// Grant or revoke the admin role on an active member. Admins cannot
// demote themselves (prevents locking everyone out). The flag is
// mirrored on the ficha for display.
export async function setAdminRole(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const makeAdmin = String(formData.get('makeAdmin') ?? '') === '1'
  if (!/^[0-9a-f-]{36}$/.test(id)) return

  const supabase = await createClient()
  const {
    data: { user: actor },
  } = await supabase.auth.getUser()
  if (!isAdminUser(actor)) return

  const ficha = await readFicha(id)
  if (!ficha?.userId || statusOf(ficha) !== 'member') return
  if (!makeAdmin && actor?.id === ficha.userId) return // no self-demotion

  const admin = createAdminClient()
  const { data: existing } = await admin.auth.admin.getUserById(ficha.userId)
  const { error } = await admin.auth.admin.updateUserById(ficha.userId, {
    app_metadata: {
      ...existing?.user?.app_metadata,
      role: makeAdmin ? 'admin' : null,
    },
  })
  if (error) return

  await writeFicha(id, { ...ficha, admin: makeAdmin })
  revalidatePath('/membros/fichas')
}

// Permanent removal: spam while pending, or true erasure of a member who
// asked to be forgotten. Removes the account and every stored file and
// cannot be undone. Admins cannot delete their own ficha.
export async function deleteApplication(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!/^[0-9a-f-]{36}$/.test(id)) return
  if (!(await requireAdmin())) return

  const admin = createAdminClient()
  const ficha = await readFicha(id)
  if (!ficha) return

  const supabase = await createClient()
  const {
    data: { user: me },
  } = await supabase.auth.getUser()
  if (ficha.userId && ficha.userId === me?.id) return

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
