import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ExclusiveAudio } from "@/components/ExclusiveAudio";
import {
  createAdminClient,
  STUDENT_MEDIA_BUCKET,
  SIGNED_URL_TTL_SECONDS,
} from "@/lib/supabase/admin";
import { findEtapa, etapaHasContent, etapaDisplayName } from "@/content/ensino";

// One stage of the mestre's teaching, members only (route lives under
// /membros, guarded by the proxy). Videos stream from ensino/<slug>/ on
// short-lived signed URLs, never from public paths.
export default async function EtapaPage({
  params,
}: {
  params: Promise<{ locale: string; etapa: string }>;
}) {
  const { locale, etapa: slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("MemberArea");
  const tl = await getTranslations("LibraryPage");

  const found = findEtapa(slug);
  if (!found || !etapaHasContent(found.etapa)) notFound();
  const { track, etapa, index } = found;

  const trackTitle = t(`${track.key}Title`);
  const etapaLabel = (t.raw(`${track.key}Etapas`) as string[])[index];
  const etapaText = (
    t.raw("etapas") as Record<
      string,
      { intro?: string; videos?: Record<string, string> }
    >
  )[slug];
  const intro = etapaText?.intro;
  // keyed by file name without extension (next-intl forbids dots in keys)
  const descriptions = etapaText?.videos ?? {};
  const descriptionOf = (file: string) =>
    descriptions[file.replace(/\.[^.]+$/, "")];

  const urls: Record<string, string> = {};
  try {
    const admin = createAdminClient();
    const { data } = await admin.storage
      .from(STUDENT_MEDIA_BUCKET)
      .createSignedUrls(
        (etapa.videos ?? []).map((v) => `ensino/${slug}/${v.file}`),
        SIGNED_URL_TTL_SECONDS
      );
    for (const s of data ?? []) {
      if (s.signedUrl && s.path) urls[s.path] = s.signedUrl;
    }
  } catch {
    // Supabase not configured/reachable: the page renders without media
  }

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />
      <ExclusiveAudio />

      <section className="mx-auto w-full max-w-6xl px-6 pb-4 pt-8">
        <Link
          href="/membros"
          className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
        >
          ← {t("ensinoBack")}
        </Link>
        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
          {t("ensinoTitle")} · {trackTitle}
        </p>
        <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1] tracking-tight text-espresso">
          {etapaDisplayName(etapaLabel)}
        </h1>
        {intro && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-espresso-2">
            {intro}
          </p>
        )}
        <p className="mt-4 max-w-2xl font-display text-sm italic leading-relaxed text-espresso-2">
          {t("ensinoNotice")}
        </p>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
          {t("ensinoVideosLabel")} ·{" "}
          {String(etapa.videos?.length ?? 0).padStart(2, "0")}
        </p>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
          {(etapa.videos ?? []).map((v, i) => {
            const url = urls[`ensino/${slug}/${v.file}`];
            return (
              <li key={v.file}>
                <figure className={v.portrait ? "mx-auto max-w-sm" : ""}>
                  <div className="overflow-hidden rounded-sm border border-espresso/15 bg-black">
                    {url ? (
                      <video
                        controls
                        preload={v.poster ? "none" : "metadata"}
                        playsInline
                        poster={v.poster}
                        src={v.poster ? url : `${url}#t=0.1`}
                        className={`w-full object-contain ${
                          v.portrait ? "aspect-[9/16]" : "aspect-video"
                        }`}
                      />
                    ) : (
                      <div
                        className={v.portrait ? "aspect-[9/16]" : "aspect-video"}
                      />
                    )}
                  </div>
                  <figcaption className="mt-3">
                    <p className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                        N°&nbsp;{String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-base italic leading-snug text-espresso">
                        {v.title}
                      </span>
                    </p>
                    {descriptionOf(v.file) && (
                      <p className="mt-2 text-sm leading-relaxed text-espresso-2">
                        {descriptionOf(v.file)}
                      </p>
                    )}
                    {v.trairaNote && (
                      <p className="mt-2 text-xs leading-relaxed text-espresso-2/80">
                        {tl("trairaNote")}
                      </p>
                    )}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </section>

      {etapa.textoLink && (
        <section className="mx-auto w-full max-w-6xl px-6 pb-24">
          <p className="border-t border-espresso/15 pt-8">
            <Link
              href={etapa.textoLink}
              className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
            >
              {t("ensinoRefLink")} →
            </Link>
          </p>
        </section>
      )}

      <Footer />
    </div>
  );
}
