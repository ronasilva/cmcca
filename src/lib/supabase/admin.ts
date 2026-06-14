import 'server-only'

import { createClient } from '@supabase/supabase-js'

// Server-only admin client. Uses the SECRET key, which bypasses RLS and
// grants full project access. Never import from a Client Component.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!url || !secretKey) {
    throw new Error(
      'Missing Supabase admin credentials (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY).'
    )
  }
  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export const STUDENT_MEDIA_BUCKET = 'student-media'
export const SIGNED_URL_TTL_SECONDS = 60 * 60 // 1 hour
