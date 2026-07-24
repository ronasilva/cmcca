'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient, STUDENT_MEDIA_BUCKET } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/admins'

// Removes a processed application (photo + ficha.json). Admin-only.
export async function deleteApplication(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!/^[0-9a-f-]{36}$/.test(id)) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!isAdminEmail(user?.email)) return

  const admin = createAdminClient()
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
