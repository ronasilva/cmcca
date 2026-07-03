import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { SectionDivider } from "@/components/SectionDivider";

type Section = {
  title: string;
  paragraphs: string[];
};

export default async function HistoriaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HistoryPage");
  const sections = t.raw("sections") as Section[];

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
      />

      {/* CHAPTER INDEX — jump links into the chronology */}
      <nav
        aria-label={t("tocLabel")}
        className="mx-auto w-full max-w-6xl px-6 pt-8"
      >
        <ol className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {sections.map((section, i) => (
            <li key={section.title}>
              <a
                href={`#capitulo-${String(i + 1).padStart(2, "0")}`}
                className="font-mono text-[12px] uppercase tracking-[0.18em] text-espresso-2 transition hover:text-terracotta"
              >
                <span className="text-terracotta">
                  {String(i + 1).padStart(2, "0")}
                </span>{" "}
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {sections.map((section, i) => (
        <div key={section.title}>
          <SectionDivider />
          <section
            id={`capitulo-${String(i + 1).padStart(2, "0")}`}
            className="mx-auto w-full max-w-6xl scroll-mt-16 px-6 py-16"
          >
            <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                  Chapitre {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 font-display text-3xl font-light italic leading-tight text-espresso md:text-4xl">
                  {section.title}
                </h2>
              </div>
              <div className="md:col-span-8">
                <div className="space-y-5 text-base leading-relaxed text-espresso-2">
                  {section.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      ))}

      <Footer />
    </div>
  );
}
