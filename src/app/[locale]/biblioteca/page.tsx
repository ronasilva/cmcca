import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { SectionDivider } from "@/components/SectionDivider";

type Book = { title: string; author: string };

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
        <p className="max-w-2xl font-display text-xl leading-relaxed text-espresso-2">
          {t("booksIntro")}
        </p>
        <ul className="mt-12 divide-y divide-terracotta/20 border-y border-terracotta/20">
          {books.map((book, i) => (
            <li
              key={`${book.title}-${book.author}`}
              className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-12 sm:items-baseline"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta sm:col-span-1">
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

      <SectionDivider label={t("livesTitle")} />

      {/* VIDEO LIBRARY — members only */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="max-w-2xl font-display text-xl leading-relaxed text-espresso-2">
            {t("livesIntro")}
          </p>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
            ● {t("livesLocked")}
          </span>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {liveCats.map((cat, i) => (
            <li key={cat}>
              <div className="flex items-center justify-between gap-4 rounded-sm border border-espresso/15 bg-cream-2/40 px-6 py-8">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
                    N°&nbsp;{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-2xl font-light italic text-espresso">
                    {cat}
                  </span>
                </div>
                <span aria-hidden className="text-espresso-2">
                  {/* lock glyph */}
                  ⟡
                </span>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/login"
          className="mt-10 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
        >
          {t("livesCta")} →
        </Link>
      </section>

      <SectionDivider label={t("recordingsTitle")} />

      {/* RECORDINGS — external reference */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <p className="max-w-2xl font-display text-xl leading-relaxed text-espresso-2">
          {t("recordingsIntro")}
        </p>
        <a
          href="https://www.last.fm/music/Mestre+Braga+-+Grupo+de+Capoeira+Angola+Africa+Bantu"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
        >
          {t("recordingsLink")} ↗
        </a>
      </section>

      <Footer />
    </div>
  );
}
