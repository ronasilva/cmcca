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

      {sections.map((section, i) => (
        <div key={section.title}>
          <SectionDivider label={`N° ${String(i + 1).padStart(2, "0")}`} />
          <section className="mx-auto w-full max-w-6xl px-6 py-16">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
                  Chapitre {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 font-display text-3xl font-light italic leading-tight text-espresso md:text-4xl">
                  {section.title}
                </h2>
              </div>
              <div className="md:col-span-8">
                <div className="space-y-5 font-display text-lg leading-relaxed text-espresso-2 md:text-xl">
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
