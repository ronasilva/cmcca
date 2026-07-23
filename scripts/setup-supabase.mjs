// One-shot setup for the Supabase Storage bucket that holds student-only media.
// Run with:  npm run setup:supabase
//
// Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY from .env.local
// (node --env-file=.env.local takes care of loading them).

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const secretKey = process.env.SUPABASE_SECRET_KEY

if (!url || !secretKey) {
  console.error(
    '✗ Missing env vars. Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.'
  )
  process.exit(1)
}

const BUCKET = 'student-media'
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB per file (Supabase free-tier cap)
const MIME_TYPES = ['image/*', 'video/*', 'application/pdf']

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function ensureBucket() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) throw listError

  const existing = buckets.find((b) => b.name === BUCKET)
  if (existing) {
    console.log(`✓ Bucket '${BUCKET}' already exists (id: ${existing.id})`)
    return
  }

  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: false,
    fileSizeLimit: MAX_FILE_SIZE,
    allowedMimeTypes: MIME_TYPES,
  })
  if (error) throw error
  console.log(
    `✓ Created bucket '${BUCKET}'  (private · max 50 MB/file · images+videos only)`
  )
}

async function main() {
  console.log(`→ Supabase project: ${url}\n`)
  await ensureBucket()
  console.log(`
Done. Upload files via Supabase Studio:
  Storage → ${BUCKET} → drag-and-drop

Suggested folder layout inside the bucket:
  photos/   → JPG / PNG / WebP
  videos/   → MP4 / WebM
`)
}

main().catch((err) => {
  console.error('✗ Setup failed:', err.message ?? err)
  process.exit(1)
})
