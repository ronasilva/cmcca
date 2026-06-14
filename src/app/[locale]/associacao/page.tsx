import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { SectionDivider } from "@/components/SectionDivider";

export default async function AssociacaoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("AssociationPage");

  const blocks = [
    { number: "N° 01 ·", title: t("missionTitle"), body: t("missionBody") },
    { number: "N° 02 ·", title: t("structureTitle"), body: t("structureBody") },
    { number: "N° 03 ·", title: t("ademTitle"), body: t("ademBody") },
  ];

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <section className="mx-auto w-full max-w-6xl px-6 pt-10">
        <div className="flex justify-center rounded-sm bg-cream-2/40 px-6 py-12">
          <Image
            src="/cmcca-logo.png"
            alt="Emblema da CMC/CA — Associação de Capoeira Angola"
            width={500}
            height={500}
            className="h-auto w-56 max-w-full object-contain"
          />
        </div>
      </section>

      {blocks.map((b) => (
        <section key={b.title} className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
                {b.number}
              </p>
              <h2 className="mt-3 font-display text-4xl font-light italic leading-tight text-espresso">
                {b.title}
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="font-display text-xl leading-relaxed text-espresso-2">
                {b.body}
              </p>
            </div>
          </div>
        </section>
      ))}

      <SectionDivider label={t("noteTitle")} />

      {/* THE NOTE — editorial manifesto */}
      <section className="mx-auto w-full max-w-3xl px-6 pb-24 pt-4">
        <p className="border-l-2 border-terracotta pl-6 font-display text-2xl font-light italic leading-relaxed text-espresso">
          {t("noteBody")}
        </p>
      </section>

      <Footer />
    </div>
  );
}
