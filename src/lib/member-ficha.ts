import {
  createAdminClient,
  STUDENT_MEDIA_BUCKET,
  SIGNED_URL_TTL_SECONDS,
} from "@/lib/supabase/admin";
import type { FichaStatus } from "@/lib/fichas";

export type FichaData = {
  name: string;
  apelido?: string;
  email?: string;
  where: string;
  since: string;
  graduation: string;
  message?: string;
  locale?: string;
  userId?: string;
  approved?: boolean;
  status?: FichaStatus;
  admin?: boolean;
  submittedAt?: string;
  updatedAt?: string;
};

export type MemberFicha = {
  folder: string;
  ficha: FichaData;
  photoUrl: string | null;
};

// The signed-in member's own ficha: scan the registry for the folder whose
// ficha.json carries this userId.
export async function findMemberFicha(
  userId: string
): Promise<MemberFicha | null> {
  if (!userId) return null;
  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return null;
  }
  const { data: folders } = await admin.storage
    .from(STUDENT_MEDIA_BUCKET)
    .list("applications", { limit: 100 });
  for (const folder of (folders ?? []).filter((f) => f.id === null)) {
    const { data: blob } = await admin.storage
      .from(STUDENT_MEDIA_BUCKET)
      .download(`applications/${folder.name}/ficha.json`);
    if (!blob) continue;
    try {
      const ficha = JSON.parse(await blob.text()) as FichaData;
      if (ficha.userId !== userId) continue;
      const { data: files } = await admin.storage
        .from(STUDENT_MEDIA_BUCKET)
        .list(`applications/${folder.name}`, { limit: 10 });
      const photoFile = (files ?? []).find((f) => f.name.startsWith("foto"));
      let photoUrl: string | null = null;
      if (photoFile) {
        const { data: signed } = await admin.storage
          .from(STUDENT_MEDIA_BUCKET)
          .createSignedUrl(
            `applications/${folder.name}/${photoFile.name}`,
            SIGNED_URL_TTL_SECONDS
          );
        photoUrl = signed?.signedUrl ?? null;
      }
      return { folder: folder.name, ficha, photoUrl };
    } catch {
      continue;
    }
  }
  return null;
}
