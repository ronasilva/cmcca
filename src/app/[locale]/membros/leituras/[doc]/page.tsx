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

      <section className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-8">
        <Link
          href="/membros"
          className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
        >
          ← {t("readingsTitle")}
        </Link>
        <h1 className="mt-5 font-display text-3xl font-light italic leading-tight text-espresso md:text-4xl">
          {meta?.title ?? name}
        </h1>
        {meta?.author && (
          <p className="mt-2 text-base text-espresso-2">{meta.author}</p>
        )}
        <iframe
          src={url}
          title={meta?.title ?? name}
          className="mt-8 h-[80vh] w-full rounded-sm border border-espresso/15 bg-plate"
        />
      </section>

      <Footer />
    </div>
  );
}
