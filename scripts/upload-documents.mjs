// Upload the Esfera Intelectual documents to the member-only storage bucket.
//
// Usage: node --env-file=.env.local scripts/upload-documents.mjs
//
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local
// (see scripts/setup-supabase.mjs for provisioning the project itself).
// Source PDFs live in material/ (gitignored — copyrighted works, private
// study circle only; never commit or serve them publicly).

import { readFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const BUCKET = 'student-media'

// [local path, storage key under documents/]
const FILES = [
  [
    'material/pdf_esfera_intelectual/1 - Artigo Mestre Pastinha Paulo Magalhães.pdf',
    '01-artigo-sobre-mestre-pastinha.pdf',
  ],
  [
    'material/pdf_esfera_intelectual/E-book-Vicente Ferreira Pastinha-Manuscritos do Mestre Pastinha.pdf',
    '02-manuscritos-do-mestre-pastinha.pdf',
  ],
  [
    'material/pdf_esfera_intelectual/Mestre_Pastinha_Capoeira_Angola.pdf',
    '03-capoeira-angola-mestre-pastinha.pdf',
  ],
  [
    'material/pdf_esfera_intelectual/Waldeloir Rego Capoeira Angola+capa.pdf',
    '04-capoeira-angola-waldeloir-rego.pdf',
  ],
  [
    'material/A Negregada Instituição - Carlos Eugênio Líbano Soares.pdf',
    '05-a-negregada-instituicao.pdf',
  ],
]

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SECRET_KEY
if (!url || !key) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY — configure .env.local first.'
  )
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

for (const [localPath, storageName] of FILES) {
  const body = await readFile(localPath)
  const target = `documents/${storageName}`
  process.stdout.write(`${target} (${(body.length / 1e6).toFixed(1)} MB)… `)
  const { error } = await supabase.storage.from(BUCKET).upload(target, body, {
    contentType: 'application/pdf',
    upsert: true,
  })
  if (error) {
    console.error(`FAILED: ${error.message}`)
    process.exit(1)
  }
  console.log('ok')
}
console.log('All documents uploaded.')
