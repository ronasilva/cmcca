import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createAdminClient,
  STUDENT_MEDIA_BUCKET,
  SIGNED_URL_TTL_SECONDS,
} from "@/lib/supabase/admin";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/SectionDivider";
import { signOut } from "./actions";
import { DOCUMENT_META, documentThumbPath } from "@/lib/documents";

type Media = { name: string; url: string };

function prettyName(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+[-_ ]*/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function listFolder(
  folder: "photos" | "videos" | "documents"
): Promise<Media[]> {
  // Degrade gracefully when Supabase isn't configured/reachable, so the
  // member-area layout still renders (with empty media) instead of erroring.
  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return [];
  }
  const { data, error } = await admin.storage
    .from(STUDENT_MEDIA_BUCKET)
    .list(folder, { limit: 200, sortBy: { column: "name", order: "asc" } });

  if (error || !data) return [];

  const files = data.filter((f) => f.id !== null);
  if (files.length === 0) return [];

  const { data: signed, error: signError } = await admin.storage
    .from(STUDENT_MEDIA_BUCKET)
    .createSignedUrls(
      files.map((f) => `${folder}/${f.name}`),
      SIGNED_URL_TTL_SECONDS
    );

  if (signError || !signed) return [];

  return signed
    .map((s, i) => ({ name: files[i].name, url: s.signedUrl }))
    .filter((m): m is Media => m.url !== null);
}

// Signed URLs for the documents' cover thumbnails, keyed by PDF name.
// Missing thumbnails are simply absent from the map.
async function signDocumentThumbs(
  documents: Media[]
): Promise<Record<string, string>> {
  if (documents.length === 0) return {};
  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return {};
  }
  const { data } = await admin.storage
    .from(STUDENT_MEDIA_BUCKET)
    .createSignedUrls(
      documents.map((d) => documentThumbPath(d.name)),
      SIGNED_URL_TTL_SECONDS
    );
  const out: Record<string, string> = {};
  data?.forEach((s, i) => {
    if (!s.error && s.signedUrl) out[documents[i].name] = s.signedUrl;
  });
  return out;
}

function EtapaCard({ label, note }: { label: string; note: string }) {
  return (
    <div className="rounded-sm border border-espresso/15 bg-cream-2/40 px-6 py-6">
      <p className="font-display text-xl font-light italic text-espresso">
        {label}
      </p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-espresso-2">
        {note}
      </p>
    </div>
  );
}

export default async function MembrosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("MemberArea");

  // Access control is enforced in the proxy; here the user is only used for the
  // "signed in as" label. Degrade gracefully if Supabase isn't configured.
  let userEmail = "";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? "";
  } catch {
    // Supabase not configured/reachable
  }

  const [photos, videos, documents] = await Promise.all([
    listFolder("photos"),
    listFolder("videos"),
    listFolder("documents"),
  ]);
  const docThumbs = await signDocumentThumbs(documents);

  const track1Etapas = t.raw("track1Etapas") as string[];
  const track2Etapas = t.raw("track2Etapas") as string[];
  const hasMedia = photos.length > 0 || videos.length > 0;

  const supabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <div className="flex flex-col flex-1 text-espresso">
      {/* SLIM "LOGGED IN" RIBBON — or an honest notice in local preview */}
      {supabaseConfigured ? (
        <div className="border-b border-espresso/15">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2 text-xs">
            <span className="font-mono uppercase tracking-[0.25em] text-espresso-2">
              {t("connectedAs", { email: userEmail })}
            </span>
            <form action={signOut}>
              <input type="hidden" name="locale" value={locale} />
              <button
                type="submit"
                className="font-mono uppercase tracking-[0.25em] text-espresso-2 hover:text-terracotta"
              >
                {t("signOut")} →
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="border-b border-terracotta/40 bg-terracotta/10">
          <p className="mx-auto max-w-6xl px-6 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-terracotta">
            Pré-visualização de desenvolvimento — autenticação desativada
            (Supabase não configurado)
          </p>
        </div>
      )}

      <Header />

      {/* PAGE TITLE */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-4 pt-20 md:pt-28">
        <p className="font-mono text-[12px] uppercase tracking-[0.35em] text-terracotta">
          {t("badge")}
        </p>
        <h1 className="mt-4 font-display text-[clamp(3rem,7vw,6.5rem)] font-light leading-[0.95] tracking-tight text-espresso">
          {t("title")}
        </h1>
      </section>

      <main className="flex-1">
        {/* TEACHING — the two tracks, in stages */}
        <SectionDivider label={t("ensinoTitle")} />
        <section className="mx-auto w-full max-w-6xl px-6 pb-12">
          <p className="max-w-2xl text-base leading-relaxed text-espresso-2">
            {t("ensinoIntro")}
          </p>

          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                01
              </p>
              <h2 className="mt-3 font-display text-3xl font-light italic leading-tight text-espresso">
                {t("track1Title")}
              </h2>
              <p className="mt-3 text-base text-espresso-2">{t("track1Desc")}</p>
              <div className="mt-6 flex flex-col gap-4">
                {track1Etapas.map((label) => (
                  <EtapaCard key={label} label={label} note={t("comingSoon")} />
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                02
              </p>
              <h2 className="mt-3 font-display text-3xl font-light italic leading-tight text-espresso">
                {t("track2Title")}
              </h2>
              <p className="mt-3 text-base text-espresso-2">{t("track2Desc")}</p>
              <div className="mt-6 flex flex-col gap-4">
                {track2Etapas.map((label) => (
                  <EtapaCard key={label} label={label} note={t("comingSoon")} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VIDEO LIBRARY — Esfera Intelectual (Lives) */}
        <SectionDivider label={t("livesTitle")} />
        <section className="mx-auto w-full max-w-6xl px-6 pb-12">
          <p className="max-w-2xl text-base leading-relaxed text-espresso-2">
            {t("livesIntro")}
          </p>
          <p className="mt-8 font-display text-xl font-light italic text-espresso-2">
            {t("comingSoon")}
          </p>
        </section>

        {/* LEITURAS — Esfera Intelectual documents, members only */}
        {documents.length > 0 && (
          <>
            <SectionDivider label={t("readingsTitle")} />
            <section className="mx-auto w-full max-w-6xl px-6 pb-12">
              <p className="max-w-2xl text-base leading-relaxed text-espresso-2">
                {t("readingsIntro")}
              </p>
              <ul className="mt-10 divide-y divide-terracotta/20 border-y border-terracotta/20">
                {documents.map((d, i) => {
                  const meta = DOCUMENT_META[d.name];
                  return (
                    <li key={d.name} className="py-5">
                      <Link
                        href={`/membros/leituras/${encodeURIComponent(d.name)}`}
                        className="group flex items-center gap-5 sm:gap-6"
                      >
                        {docThumbs[d.name] ? (
                          <Image
                            src={docThumbs[d.name]}
                            alt=""
                            width={140}
                            height={190}
                            unoptimized
                            className="h-24 w-auto shrink-0 rounded-xs border border-espresso/15 bg-plate object-contain"
                          />
                        ) : (
                          <span
                            aria-hidden
                            className="h-24 w-17.5 shrink-0 rounded-xs border border-espresso/15 bg-cream-2/40"
                          />
                        )}
                        <span className="grid flex-1 grid-cols-1 gap-1 sm:grid-cols-12 sm:items-baseline sm:gap-2">
                          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta sm:col-span-1">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-display text-xl font-light italic text-espresso sm:col-span-6">
                            {meta?.title ?? prettyName(d.name)}
                          </span>
                          <span className="text-base text-espresso-2 sm:col-span-3">
                            {meta?.author ?? ""}
                          </span>
                          <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition group-hover:text-terracotta-2 sm:col-span-2 sm:text-right">
                            {t("readingsOpen")} →
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          </>
        )}

        {/* CERTIFICATES */}
        <SectionDivider label={t("certsTitle")} />
        <section className="mx-auto w-full max-w-6xl px-6 pb-12">
          <p className="max-w-2xl text-base leading-relaxed text-espresso-2">
            {t("certsBody")}
          </p>
        </section>

        {/* MEDIA — photos & videos from storage */}
        <SectionDivider label={t("mediaTitle")} />
        {!hasMedia && (
          <div className="mx-auto max-w-6xl px-6 pb-16">
            <p className="font-display text-xl italic text-espresso-2">
              {t("empty")}
            </p>
          </div>
        )}

        {videos.length > 0 && (
          <section className="mx-auto w-full max-w-6xl px-6 pb-12">
            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
              {t("videosTitle")} · {videos.length.toString().padStart(2, "0")}
            </p>
            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((v, i) => (
                <li key={v.name}>
                  <figure className="group">
                    <div className="relative overflow-hidden rounded-sm border border-espresso/15 bg-black">
                      <video
                        src={`${v.url}#t=0.1`}
                        controls
                        preload="metadata"
                        playsInline
                        className="aspect-video w-full bg-black object-contain"
                      />
                    </div>
                    <figcaption className="mt-3 flex items-baseline gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                        N°&nbsp;{String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-sm italic text-espresso">
                        {prettyName(v.name)}
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </section>
        )}

        {photos.length > 0 && (
          <section className="mx-auto w-full max-w-6xl px-6 pb-24">
            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
              {t("photosTitle")} · {photos.length.toString().padStart(2, "0")}
            </p>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((p, i) => (
                <li key={p.name} className="group">
                  <figure>
                    <div className="overflow-hidden rounded-sm border border-espresso/15 bg-cream-2/40">
                      <Image
                        src={p.url}
                        alt={prettyName(p.name)}
                        width={1200}
                        height={1200}
                        unoptimized
                        className="aspect-square h-auto w-full object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={i < 3}
                      />
                    </div>
                    <figcaption className="mt-3 flex items-baseline gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                        N°&nbsp;{String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-sm italic text-espresso">
                        {prettyName(p.name)}
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
