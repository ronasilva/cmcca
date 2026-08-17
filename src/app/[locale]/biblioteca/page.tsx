import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  createAdminClient,
  STUDENT_MEDIA_BUCKET,
} from "@/lib/supabase/admin";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { SectionDivider } from "@/components/SectionDivider";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

type Book = { title: string; author: string };

// The mestre's discography: Antonio L.N. Braga (m/Braga). Local tracks
// stream from the private bucket via long-lived signed URLs; the WAV
// masters stay offline. Released albums live on Bandcamp.
const DISCOS: {
  title: string;
  year: number;
  inProduction?: boolean;
  bandcampUrl?: string;
  tracks?: { label: string; path: string }[];
}[] = [
  {
    title: "Novo CD",
    year: 2026,
    inProduction: true,
    tracks: [
      { label: "Faixa 1", path: "discografia/novo-cd/faixa-1.m4a" },
    ],
  },
  {
    title:
      "Conhecimento de memória dos capoeiras em Capoeira Angola (berimbau e cantorias)",
    year: 2024,
    bandcampUrl:
      "https://berinbaucantoriasbraga2.bandcamp.com/album/conhecimento-de-mem-ria-dos-capoeiras-em-capoeira-angola-berimbau-e-cantorias-g-ecaab-rj-2",
  },
];

const TRACK_URL_TTL = 60 * 60 * 24 * 365; // public track, links live a year

async function signTracks(): Promise<Record<string, string>> {
  try {
    const admin = createAdminClient();
    const paths = DISCOS.flatMap((d) => (d.tracks ?? []).map((t) => t.path));
    const { data } = await admin.storage
      .from(STUDENT_MEDIA_BUCKET)
      .createSignedUrls(paths, TRACK_URL_TTL);
    const out: Record<string, string> = {};
    for (const s of data ?? []) {
      if (s.signedUrl && s.path) out[s.path] = s.signedUrl;
    }
    return out;
  } catch {
    return {};
  }
}

// Curated by Mestre Braga; grouped by the videoteca's four themes
// (index into LibraryPage.liveCats). Titles are the works' own names.
const VIDEOS = [
  {
    id: "ViVlEwPQL1Q",
    cat: 0,
    title: "Reino do Congo",
    channel: "História em Meia Hora",
  },
  {
    id: "ERJNIScowr8",
    cat: 0,
    title: "Sincretismo religioso em Angola e no Reino do Congo",
    channel: "TV Raízes da Cultura",
  },
  {
    id: "UgChVkbxgBc",
    cat: 0,
    title: "Os Ilundu não são orixás — Alberto Oliveira Pinto",
    channel: "Lembra-te, Angola",
  },
  {
    id: "otgt9vz9E-o",
    cat: 1,
    title: "A incrível epopeia do descobrimento do Brasil",
    channel: "Viagens Cariocas",
  },
  {
    id: "IyUg6ebRBvs",
    cat: 2,
    title: "Influência yoruba na formação social de capoeiras",
    channel: "Live · CMC/CA",
  },
  {
    id: "vnm8xUgT6WM",
    cat: 3,
    title: "Grupo/Escola de Capoeira Angola África Bantu",
    channel: "Live · CMC/CA",
  },
];

export default async function BibliotecaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("LibraryPage");

  const books = t.raw("books") as Book[];
  const liveCats = t.raw("liveCats") as string[];
  const trackUrls = await signTracks();

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <SectionDivider label={t("perguntasTitle")} />

      {/* PERGUNTE AO MESTRE — invitation to the public Q&A */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <p className="max-w-2xl font-display text-2xl font-light italic leading-relaxed text-espresso">
          {t("perguntasIntro")}
        </p>
        <Link
          href="/perguntas"
          className="mt-6 inline-block font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
        >
          {t("perguntasCta")} →
        </Link>
      </section>

      <SectionDivider label={t("booksTitle")} />

      {/* BOOKS — public bibliography */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <p className="max-w-2xl text-base leading-relaxed text-espresso-2">
          {t("booksIntro")}
        </p>
        <ul className="mt-12 divide-y divide-terracotta/20 border-y border-terracotta/20">
          {books.map((book, i) => (
            <li
              key={`${book.title}-${book.author}`}
              className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-12 sm:items-baseline"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta sm:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-display text-2xl font-light italic text-espresso sm:col-span-7">
                {book.title}
              </p>
              <p className="text-base text-espresso-2 sm:col-span-4">
                {book.author}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <SectionDivider label={t("estanteTitle")} />

      {/* A ESTANTE DO MESTRE — the mestre's photographed bookshelf */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <p className="max-w-2xl text-base leading-relaxed text-espresso-2">
          {t("estanteIntro")}
        </p>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 17 }, (_, i) => (
            <li key={i}>
              <Image
                src={`/images/estante/estante-${String(i + 1).padStart(2, "0")}.jpg`}
                alt=""
                width={700}
                height={933}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="aspect-3/4 w-full rounded-sm border border-espresso/15 object-contain"
              />
            </li>
          ))}
        </ul>
      </section>

      <SectionDivider label={t("livesTitle")} />

      {/* VIDEO LIBRARY — curated by Mestre Braga, grouped by theme */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <p className="max-w-2xl text-base leading-relaxed text-espresso-2">
          {t("livesIntro")}
        </p>

        <div className="mt-12 flex flex-col gap-14">
          {liveCats.map((cat, i) => {
            const videos = VIDEOS.filter((v) => v.cat === i);
            if (videos.length === 0) return null;
            return (
              <div key={cat}>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                    N°&nbsp;{String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl font-light italic text-espresso">
                    {cat}
                  </h3>
                </div>
                <ul className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                  {videos.map((v) => (
                    <li key={v.id}>
                      <figure>
                        <div className="overflow-hidden rounded-sm border border-espresso/15">
                          <YouTubeEmbed
                            videoId={v.id}
                            title={v.title}
                            poster={`/images/videos/${v.id}.jpg`}
                          />
                        </div>
                        <figcaption className="mt-3">
                          <p className="font-display text-sm italic leading-snug text-espresso">
                            {v.title}
                          </p>
                          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-espresso-2">
                            {v.channel}
                          </p>
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <SectionDivider label={t("recordingsTitle")} />

      {/* DISCOGRAPHY — the mestre's records, streamed from the archive */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <p className="max-w-2xl text-base leading-relaxed text-espresso-2">
          {t("recordingsIntro")}
        </p>
        <ul className="mt-12 flex max-w-3xl flex-col gap-12">
          {DISCOS.map((disco, i) => (
            <li key={disco.title}>
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl font-light italic text-espresso">
                  {disco.title}
                </h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-espresso-2">
                  {disco.year}
                </span>
                {disco.inProduction && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta">
                    ● {t("discInProduction")}
                  </span>
                )}
              </div>
              {disco.tracks && (
                <ul className="mt-5 flex flex-col gap-4 pl-10">
                  {disco.tracks.map(
                    (track) =>
                      trackUrls[track.path] && (
                        <li key={track.path}>
                          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-espresso-2">
                            {track.label}
                          </p>
                          <audio
                            controls
                            preload="none"
                            src={trackUrls[track.path]}
                            className="w-full max-w-xl"
                          />
                        </li>
                      )
                  )}
                </ul>
              )}
              {disco.bandcampUrl && (
                <p className="mt-4 pl-10">
                  <a
                    href={disco.bandcampUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
                  >
                    {t("discListen")} ↗
                  </a>
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </div>
  );
}
