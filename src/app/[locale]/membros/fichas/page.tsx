import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createAdminClient,
  STUDENT_MEDIA_BUCKET,
  SIGNED_URL_TTL_SECONDS,
} from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admins";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { deleteApplication } from "./actions";

// Internal review tool for the mestre and the site admin — not part of
// the public site, so it speaks Portuguese only.

// Partial date (YYYY, YYYY-MM or YYYY-MM-DD) → dd/mm/yyyy at the
// precision that was provided.
function formatSince(s: string): string {
  const [y, m, d] = s.split("-");
  if (d) return `${d}/${m}/${y}`;
  if (m) return `${m}/${y}`;
  return y;
}

type Ficha = {
  id: string;
  name: string;
  email: string;
  where: string;
  since: string;
  graduation: string;
  message: string;
  submittedAt: string;
  photoUrl: string | null;
};

async function listApplications(): Promise<Ficha[]> {
  const admin = createAdminClient();
  const { data: folders } = await admin.storage
    .from(STUDENT_MEDIA_BUCKET)
    .list("applications", { limit: 100 });

  const out: Ficha[] = [];
  for (const folder of (folders ?? []).filter((f) => f.id === null)) {
    const id = folder.name;
    const { data: blob } = await admin.storage
      .from(STUDENT_MEDIA_BUCKET)
      .download(`applications/${id}/ficha.json`);
    if (!blob) continue;
    let ficha: Omit<Ficha, "id" | "photoUrl">;
    try {
      ficha = JSON.parse(await blob.text());
    } catch {
      continue;
    }

    const { data: files } = await admin.storage
      .from(STUDENT_MEDIA_BUCKET)
      .list(`applications/${id}`, { limit: 10 });
    const photoFile = (files ?? []).find((f) => f.name.startsWith("foto"));
    let photoUrl: string | null = null;
    if (photoFile) {
      const { data: signed } = await admin.storage
        .from(STUDENT_MEDIA_BUCKET)
        .createSignedUrl(
          `applications/${id}/${photoFile.name}`,
          SIGNED_URL_TTL_SECONDS
        );
      photoUrl = signed?.signedUrl ?? null;
    }
    out.push({ id, photoUrl, ...ficha });
  }
  return out.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
}

export default async function FichasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) notFound();

  const fichas = await listApplications();

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <PageHeader
        eyebrow="Revisão · Interno"
        title="Fichas"
        intro="Fichas de apresentação recebidas. Depois de aprovar (criar a conta) ou recusar, remova a ficha — os dados não devem ficar guardados."
      />

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-6">
        {fichas.length === 0 ? (
          <p className="font-display text-base italic leading-relaxed text-espresso-2">
            Nenhuma ficha pendente.
          </p>
        ) : (
          <ul className="flex flex-col gap-8">
            {fichas.map((f) => (
              <li
                key={f.id}
                className="flex flex-col gap-6 rounded-sm border border-espresso/15 bg-cream-2/40 p-6 sm:flex-row"
              >
                {f.photoUrl ? (
                  <Image
                    src={f.photoUrl}
                    alt={f.name}
                    width={240}
                    height={240}
                    unoptimized
                    className="h-40 w-40 shrink-0 rounded-sm border border-espresso/15 object-cover"
                  />
                ) : (
                  <div className="h-40 w-40 shrink-0 rounded-sm border border-espresso/15" />
                )}
                <div className="flex-1">
                  <p className="font-display text-2xl font-light italic text-espresso">
                    {f.name}
                    <span className="text-espresso-2"> · {f.graduation}</span>
                  </p>
                  <dl className="mt-3 space-y-1 text-base text-espresso-2">
                    <div>
                      <a
                        href={`mailto:${f.email}`}
                        className="text-terracotta hover:text-terracotta-2"
                      >
                        {f.email}
                      </a>
                    </div>
                    <div>
                      {f.where} · desde {formatSince(f.since)}
                    </div>
                    {f.message && (
                      <div className="mt-2 font-display italic text-espresso">
                        “{f.message}”
                      </div>
                    )}
                    <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em]">
                      Recebida em{" "}
                      {new Date(f.submittedAt).toLocaleDateString("pt-BR")}
                    </div>
                  </dl>
                </div>
                <form action={deleteApplication} className="self-start">
                  <input type="hidden" name="id" value={f.id} />
                  <button
                    type="submit"
                    className="font-mono text-[12px] uppercase tracking-[0.18em] text-espresso-2 transition hover:text-terracotta"
                  >
                    Remover ficha ✕
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Footer />
    </div>
  );
}
