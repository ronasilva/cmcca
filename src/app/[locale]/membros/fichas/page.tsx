import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
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
import {
  approveApplication,
  deactivateMember,
  reactivateMember,
  deleteApplication,
} from "./actions";
import { statusOf, type FichaStatus } from "@/lib/fichas";

// Internal review tool for the mestre and the site admin.

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
  certUrl: string | null;
  userId?: string;
  approved?: boolean;
  status?: FichaStatus;
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
    let ficha: Omit<Ficha, "id" | "photoUrl" | "certUrl">;
    try {
      ficha = JSON.parse(await blob.text());
    } catch {
      continue;
    }

    const { data: files } = await admin.storage
      .from(STUDENT_MEDIA_BUCKET)
      .list(`applications/${id}`, { limit: 10 });
    const signFile = async (prefix: string): Promise<string | null> => {
      const f = (files ?? []).find((x) => x.name.startsWith(prefix));
      if (!f) return null;
      const { data: signed } = await admin.storage
        .from(STUDENT_MEDIA_BUCKET)
        .createSignedUrl(`applications/${id}/${f.name}`, SIGNED_URL_TTL_SECONDS);
      return signed?.signedUrl ?? null;
    };
    const photoUrl = await signFile("foto");
    const certUrl = await signFile("certificado");
    out.push({ ...ficha, id, photoUrl, certUrl });
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
  const t = await getTranslations("FichasAdmin");
  const tn = await getTranslations("Nav");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) notFound();

  const fichas = await listApplications();

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <div className="mx-auto w-full max-w-6xl px-6 pt-8">
        <Link
          href="/membros"
          className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
        >
          ← {tn("memberArea")}
        </Link>
      </div>

      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
      />

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-6">
        {fichas.length === 0 ? (
          <p className="font-display text-base italic leading-relaxed text-espresso-2">
            {t("empty")}
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
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em]">
                    {statusOf(f) === "member" ? (
                      <span className="text-espresso-2">
                        ● {t("statusMember")}
                      </span>
                    ) : statusOf(f) === "deactivated" ? (
                      <span className="text-espresso-2/60">
                        ○ {t("statusDeactivated")}
                      </span>
                    ) : (
                      <span className="text-terracotta">
                        ● {t("statusPending")}
                      </span>
                    )}
                  </p>
                  <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-base sm:grid-cols-2">
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta">
                        {t("labelGraduation")}
                      </dt>
                      <dd className="font-display italic text-espresso">
                        {f.graduation || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta">
                        {t("labelEmail")}
                      </dt>
                      <dd>
                        <a
                          href={`mailto:${f.email}`}
                          className="text-terracotta hover:text-terracotta-2"
                        >
                          {f.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta">
                        {t("labelWhere")}
                      </dt>
                      <dd className="text-espresso-2">{f.where || "—"}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta">
                        {t("labelSince")}
                      </dt>
                      <dd className="text-espresso-2">
                        {f.since ? formatSince(f.since) : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta">
                        {t("labelCert")}
                      </dt>
                      <dd>
                        {f.certUrl ? (
                          <a
                            href={f.certUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-terracotta hover:text-terracotta-2"
                          >
                            {t("viewCert")} ↗
                          </a>
                        ) : (
                          <span className="text-espresso-2">—</span>
                        )}
                      </dd>
                    </div>
                  </dl>
                  {f.message && (
                    <p className="mt-4 font-display italic text-espresso">
                      “{f.message}”
                    </p>
                  )}
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-espresso-2">
                    {t("receivedOn")}{" "}
                    {new Date(f.submittedAt).toLocaleDateString(locale)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-4 self-start">
                  {statusOf(f) === "pending" && f.userId && (
                    <form action={approveApplication}>
                      <input type="hidden" name="id" value={f.id} />
                      <button
                        type="submit"
                        className="rounded-sm border border-terracotta px-5 py-2 font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:bg-terracotta hover:text-background"
                      >
                        {t("approve")} →
                      </button>
                    </form>
                  )}
                  {statusOf(f) === "member" && f.userId && (
                    <form action={deactivateMember}>
                      <input type="hidden" name="id" value={f.id} />
                      <button
                        type="submit"
                        className="font-mono text-[12px] uppercase tracking-[0.18em] text-espresso-2 transition hover:text-terracotta"
                      >
                        {t("deactivate")} ⏻
                      </button>
                    </form>
                  )}
                  {statusOf(f) === "deactivated" && f.userId && (
                    <form action={reactivateMember}>
                      <input type="hidden" name="id" value={f.id} />
                      <button
                        type="submit"
                        className="rounded-sm border border-terracotta px-5 py-2 font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:bg-terracotta hover:text-background"
                      >
                        {t("reactivate")} →
                      </button>
                    </form>
                  )}
                  {statusOf(f) === "pending" && (
                    <form action={deleteApplication}>
                      <input type="hidden" name="id" value={f.id} />
                      <button
                        type="submit"
                        className="font-mono text-[12px] uppercase tracking-[0.18em] text-espresso-2 transition hover:text-terracotta"
                      >
                        {t("delete")} ✕
                      </button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Footer />
    </div>
  );
}
