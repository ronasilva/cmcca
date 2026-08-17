import {
  createAdminClient,
  STUDENT_MEDIA_BUCKET,
} from "@/lib/supabase/admin";

// Questions to the mestre, stored one JSON per question under questions/
// in the private bucket. Two kinds share the same storage and admin UI:
// visitor questions (curated: only published ones reach the public page)
// and the mestre's own Q&A archive ("Para turbinar a memória"), flagged
// arquivo:true and ordered by his original numbering.
export type Question = {
  id: string;
  name: string;
  question: string;
  locale: string;
  submittedAt: string;
  answer?: string;
  published?: boolean;
  answeredAt?: string;
  arquivo?: boolean;
  ordem?: number;
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
  const results = await Promise.all(
    (files ?? [])
      .filter((x) => x.id !== null)
      .map(async (f): Promise<Question | null> => {
        const { data: blob } = await admin.storage
          .from(STUDENT_MEDIA_BUCKET)
          .download(`questions/${f.name}`);
        if (!blob) return null;
        try {
          return {
            id: f.name.replace(/\.json$/, ""),
            ...JSON.parse(await blob.text()),
          };
        } catch {
          return null;
        }
      })
  );
  return results
    .filter((q): q is Question => q !== null)
    .sort((a, b) => {
      // archive entries keep the mestre's numbering; visitor questions
      // sort newest first
      if (a.arquivo && b.arquivo) return (a.ordem ?? 0) - (b.ordem ?? 0);
      if (a.arquivo !== b.arquivo) return a.arquivo ? 1 : -1;
      return b.submittedAt.localeCompare(a.submittedAt);
    });
}

// Published answers to visitor questions, newest first.
export async function listPublishedQuestions(): Promise<Question[]> {
  const all = await listQuestions();
  return all
    .filter((q) => !q.arquivo && q.published === true && q.answer)
    .sort((a, b) =>
      (b.answeredAt ?? b.submittedAt).localeCompare(
        a.answeredAt ?? a.submittedAt
      )
    );
}

// The mestre's published archive, in his order.
export async function listArchiveQuestions(): Promise<Question[]> {
  const all = await listQuestions();
  return all
    .filter((q) => q.arquivo === true && q.published === true && q.answer)
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
}
