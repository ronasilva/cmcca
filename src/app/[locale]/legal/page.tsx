import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("LegalPage");

  const blocks = [
    { title: t("editorTitle"), body: t("editorBody") },
    { title: t("dataTitle"), body: t("dataBody") },
    { title: t("thirdTitle"), body: t("thirdBody") },
    { title: t("rightsTitle"), body: t("rightsBody") },
    { title: t("contentTitle"), body: t("contentBody") },
  ];

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <PageHeader eyebrow={t("eyebrow")} title={t("title")} />

      {/* Document layout: one narrow column of continuous prose — a legal
          note reads as a document, not an editorial spread. */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-12 pt-6">
        <div className="max-w-3xl">
          {blocks.map((b, i) => (
            <div key={b.title} className={i === 0 ? "" : "mt-10"}>
              <h2 className="font-display text-xl font-light italic leading-tight text-espresso">
                {b.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-espresso-2">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
