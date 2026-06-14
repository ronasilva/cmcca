import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
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

type Media = { name: string; url: string };

function prettyName(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function listFolder(folder: "photos" | "videos"): Promise<Media[]> {
  const admin = createAdminClient();
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
    .filter((s) => s.signedUrl)
    .map((s, i) => ({ name: files[i].name, url: s.signedUrl }));
}

export default async function AlunosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("StudentArea");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [photos, videos] = await Promise.all([
    listFolder("photos"),
    listFolder("videos"),
  ]);

  const hasContent = photos.length > 0 || videos.length > 0;

  return (
    <div className="flex flex-col flex-1 text-espresso">
      {/* SLIM "LOGGED IN" RIBBON */}
      <div className="border-b border-espresso/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2 text-xs">
          <span className="font-mono uppercase tracking-[0.25em] text-espresso-2">
            {t("connectedAs", { email: user?.email ?? "" })}
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

      <Header />

      {/* PAGE TITLE — big editorial italic */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-4 pt-20 md:pt-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-terracotta">
          Réservé · Members only
        </p>
        <h1 className="mt-5 font-display text-[clamp(3.5rem,9vw,8rem)] font-light italic leading-[0.95] tracking-tight text-espresso">
          {t("title")}
        </h1>
      </section>

      <main className="flex-1">
        {!hasContent && (
          <div className="mx-auto max-w-6xl px-6 py-24">
            <p className="font-display text-2xl italic text-espresso-2">
              {t("empty")}
            </p>
          </div>
        )}

        {videos.length > 0 && (
          <>
            <SectionDivider label={`${t("videosTitle")} · ${videos.length.toString().padStart(2, "0")}`} />
            <section className="mx-auto w-full max-w-6xl px-6 pb-20">
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
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
                          N°&nbsp;{String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-base italic text-espresso">
                          {prettyName(v.name)}
                        </span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        {photos.length > 0 && (
          <>
            <SectionDivider label={`${t("photosTitle")} · ${photos.length.toString().padStart(2, "0")}`} />
            <section className="mx-auto w-full max-w-6xl px-6 pb-24">
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
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
                          N°&nbsp;{String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-base italic text-espresso">
                          {prettyName(p.name)}
                        </span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
