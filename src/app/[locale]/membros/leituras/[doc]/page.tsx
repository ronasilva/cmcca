import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  createAdminClient,
  STUDENT_MEDIA_BUCKET,
  SIGNED_URL_TTL_SECONDS,
} from "@/lib/supabase/admin";
import { DOCUMENT_META } from "@/lib/documents";

// In-site reader for the Esfera Intelectual documents: keeps members on
// the site instead of dropping them onto a raw storage URL. Access is
// enforced by the proxy (route lives under /membros).
export default async function LeituraPage({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}) {
  const { locale, doc } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("MemberArea");

  const name = decodeURIComponent(doc);
  if (name.includes("/") || name.includes("..") || !name.endsWith(".pdf")) {
    notFound();
  }

  let url: string | null = null;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.storage
      .from(STUDENT_MEDIA_BUCKET)
      .createSignedUrl(`documents/${name}`, SIGNED_URL_TTL_SECONDS);
    if (!error) url = data?.signedUrl ?? null;
  } catch {
    // Supabase not configured/reachable
  }
  if (!url) notFound();

  const meta = DOCUMENT_META[name];

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <section className="mx-auto flex w-full max-w-360 flex-1 flex-col px-6 pb-10 pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <div>
            <Link
              href="/membros"
              className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
            >
              ← {t("readingsTitle")}
            </Link>
            <h1 className="mt-3 font-display text-2xl font-light italic leading-tight text-espresso md:text-3xl">
              {meta?.title ?? name}
              {meta?.author && (
                <span className="text-espresso-2"> · {meta.author}</span>
              )}
            </h1>
          </div>
          <p className="max-w-md font-display text-sm italic leading-relaxed text-espresso-2">
            {t("readingsNotice")}
          </p>
        </div>
        {/* #toolbar=0 hides download/print in Chromium's viewer; the file
            still reaches the browser — true prevention is impossible. */}
        <iframe
          src={`${url}#toolbar=0&navpanes=0`}
          title={meta?.title ?? name}
          className="mt-5 min-h-[70vh] w-full flex-1 rounded-sm border border-espresso/15 bg-plate"
        />
      </section>

      <Footer />
    </div>
  );
}
