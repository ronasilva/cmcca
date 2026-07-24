import {
  createAdminClient,
  STUDENT_MEDIA_BUCKET,
} from "@/lib/supabase/admin";

// Public questions to the mestre, stored one JSON per question under
// questions/ in the private bucket. Curated: only published ones ever
// reach the public page.
export type Question = {
  id: string;
  name: string;
  question: string;
  locale: string;
  submittedAt: string;
  answer?: string;
  published?: boolean;
  answeredAt?: string;
};

export async function listQuestions(): Promise<Question[]> {
  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return [];
  }
  const { data: files } = await admin.storage
    .from(STUDENT_MEDIA_BUCKET)
    .list("questions", { limit: 200 });
  const out: Question[] = [];
  for (const f of (files ?? []).filter((x) => x.id !== null)) {
    const { data: blob } = await admin.storage
      .from(STUDENT_MEDIA_BUCKET)
      .download(`questions/${f.name}`);
    if (!blob) continue;
    try {
      out.push({
        id: f.name.replace(/\.json$/, ""),
        ...JSON.parse(await blob.text()),
      });
    } catch {
      continue;
    }
  }
  return out.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function listPublishedQuestions(): Promise<Question[]> {
  const all = await listQuestions();
  return all
    .filter((q) => q.published === true && q.answer)
    .sort((a, b) =>
      (b.answeredAt ?? b.submittedAt).localeCompare(
        a.answeredAt ?? a.submittedAt
      )
    );
}
