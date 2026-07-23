import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { SectionDivider } from "@/components/SectionDivider";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

type Book = { title: string; author: string };

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

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

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

      {/* RECORDINGS — external reference */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <p className="max-w-2xl text-base leading-relaxed text-espresso-2">
          {t("recordingsIntro")}
        </p>
        <a
          href="https://www.last.fm/music/Mestre+Braga+-+Grupo+de+Capoeira+Angola+Africa+Bantu"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
        >
          {t("recordingsLink")} ↗
        </a>
      </section>

      <Footer />
    </div>
  );
}
