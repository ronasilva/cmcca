// Pull a video out of the Supabase student-media bucket into public/.
// Usage:  node --env-file=.env.local scripts/pull-video.mjs <filename> <outPath>

import { writeFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } }
)

const BUCKET = 'student-media'
const target = process.argv[2]
const outPath = process.argv[3]

if (!target || !outPath) {
  console.error('Usage: pull-video.mjs <filename> <outPath>')
  process.exit(1)
}

async function findFile(folder) {
  const { data } = await supabase.storage
    .from(BUCKET)
    .list(folder, { limit: 1000 })
  for (const item of data ?? []) {
    const path = folder ? `${folder}/${item.name}` : item.name
    if (item.id === null) {
      const found = await findFile(path)
      if (found) return found
    } else if (item.name === target) {
      return path
    }
  }
  return null
}

async function main() {
  const path = await findFile('videos')
  if (!path) {
    console.error(`✗ '${target}' not found under videos/`)
    process.exit(1)
  }
  const { data, error } = await supabase.storage.from(BUCKET).download(path)
  if (error || !data) throw error ?? new Error('download failed')
  const buf = Buffer.from(await data.arrayBuffer())
  await writeFile(outPath, buf)
  console.log(
    `✓ ${path} → ${outPath} (${(buf.length / 1024 / 1024).toFixed(1)} MB)`
  )
}

main().catch((e) => {
  console.error('✗', e.message)
  process.exit(1)
})
