import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default async function AssociacaoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("AssociationPage");
  const tn = await getTranslations("Nav");

  const blocks = [
    { number: "N° 01 ·", title: t("missionTitle"), body: t("missionBody") },
    { number: "N° 02 ·", title: t("structureTitle"), body: t("structureBody") },
    { number: "N° 03 ·", title: t("ademTitle"), body: t("ademBody") },
  ];

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      {/* HEADER — title left, emblem right (mirrors the landing hero) */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-14 pt-20 md:pt-28">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-8">
            <p className="font-mono text-[12px] uppercase tracking-[0.35em] text-terracotta">
              {t("eyebrow")}
            </p>
            <h1 className="mt-4 font-display text-[clamp(3rem,7vw,6.5rem)] font-light leading-[0.95] tracking-tight text-espresso">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-espresso-2">
              {t("intro")}
            </p>
          </div>
          <div className="md:col-span-3 md:col-start-10">
            <Image
              src="/cmcca-logo.png"
              alt="Emblema da CMC/CA — Associação de Capoeira Angola"
              width={370}
              height={373}
              className="h-auto w-44 max-w-full object-contain md:w-full"
            />
          </div>
        </div>
      </section>

      {/* NUMBERED BLOCKS — editorial rows with hairline rules */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="divide-y divide-espresso/15 border-t border-espresso/15">
          {blocks.map((b) => (
            <div
              key={b.title}
              className="grid grid-cols-1 gap-8 py-14 md:grid-cols-12"
            >
              <div className="md:col-span-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                  {b.number}
                </p>
                <h2 className="mt-3 font-display text-3xl font-light italic leading-tight text-espresso md:text-4xl">
                  {b.title}
                </h2>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                <p className="text-base leading-relaxed text-espresso-2">
                  {b.body}
                </p>
                {b.title === t("structureTitle") && (
                  <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                    <Link
                      href="/cours"
                      className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
                    >
                      {tn("courses")} →
                    </Link>
                    <Link
                      href="/mestre"
                      className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
                    >
                      {tn("mestre")} →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
