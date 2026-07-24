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

      <section className="mx-auto w-full max-w-6xl px-6 pb-8 pt-10">
        <div className="divide-y divide-espresso/15 border-t border-espresso/15">
          {blocks.map((b) => (
            <div
              key={b.title}
              className="grid grid-cols-1 gap-4 py-10 md:grid-cols-12"
            >
              <div className="md:col-span-4">
                <h2 className="font-display text-2xl font-light italic leading-tight text-espresso">
                  {b.title}
                </h2>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                <p className="text-base leading-relaxed text-espresso-2">
                  {b.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
