'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient, STUDENT_MEDIA_BUCKET } from '@/lib/supabase/admin'
import { isAdminUser } from '@/lib/admins'

async function requireAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return isAdminUser(user)
}

async function readQuestion(id: string) {
  const admin = createAdminClient()
  const { data: blob } = await admin.storage
    .from(STUDENT_MEDIA_BUCKET)
    .download(`questions/${id}.json`)
  if (!blob) return null
  try {
    return JSON.parse(await blob.text()) as Record<string, unknown>
  } catch {
    return null
  }
}

// Save the answer; publish=1 makes it public, publish=0 withdraws it.
export async function answerQuestion(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const answer = String(formData.get('resposta') ?? '').trim()
  const publish = String(formData.get('publicar') ?? '') === '1'
  if (!/^[0-9a-f-]{36}$/.test(id)) return
  if (!(await requireAdmin())) return
  if (publish && !answer) return

  const q = await readQuestion(id)
  if (!q) return

  const admin = createAdminClient()
  await admin.storage
    .from(STUDENT_MEDIA_BUCKET)
    .upload(
      `questions/${id}.json`,
      Buffer.from(
        JSON.stringify(
          {
            ...q,
            answer,
            published: publish,
            answeredAt: new Date().toISOString(),
          },
          null,
          2
        )
      ),
      { contentType: 'application/json', upsert: true }
    )
  revalidatePath('/membros/perguntas')
  revalidatePath('/perguntas')
}

// Remove a question entirely (spam, or the mestre's judgment).
export async function deleteQuestion(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!/^[0-9a-f-]{36}$/.test(id)) return
  if (!(await requireAdmin())) return

  const admin = createAdminClient()
  await admin.storage
    .from(STUDENT_MEDIA_BUCKET)
    .remove([`questions/${id}.json`])
  revalidatePath('/membros/perguntas')
  revalidatePath('/perguntas')
}
