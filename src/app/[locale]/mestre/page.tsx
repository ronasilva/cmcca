import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { SectionDivider } from "@/components/SectionDivider";

export default async function MestrePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("MestrePage");

  const memoriasParagraphs = [
    t("memoriasP1"),
    t("memoriasP2"),
    t("memoriasP3"),
    t("memoriasP4"),
    t("memoriasP5"),
    t("memoriasP6"),
  ];

  const facts = [
    { label: t("fullNameLabel"), value: t("fullName") },
    { label: t("bornLabel"), value: t("born") },
    { label: t("gradedLabel"), value: t("graded") },
    { label: t("foundedLabel"), value: t("founded") },
  ];

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <PageHeader eyebrow={t("eyebrow")} title={t("title")} />

      {/* BERIMBAU — full-bleed cinematic band */}
      <section className="relative w-full overflow-hidden border-t border-espresso/15">
        <Image
          src="/berimbau.jpg"
          alt={t("videoCaption")}
          width={1535}
          height={1024}
          priority
          sizes="100vw"
          className="aspect-3/2 w-full object-cover md:aspect-auto md:h-[52vh] md:min-h-80"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background/40 via-transparent to-background/70" />
      </section>
      <div className="border-y border-espresso/15">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <span aria-hidden className="text-[11px] text-terracotta">
            ◆
          </span>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-espresso-2">
            {t("videoCaption")}
          </p>
        </div>
      </div>

      {/* SUBTITLE + BIO */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-display text-2xl italic leading-snug text-espresso-2">
              {t("subtitle")}
            </p>
          </div>
          <div className="md:col-span-8">
            <p className="text-base leading-relaxed text-espresso-2">
              {t("bio")}
            </p>

            {/* KEY FACTS */}
            <dl className="mt-12 grid grid-cols-1 gap-x-8 gap-y-6 border-t border-espresso/15 pt-10 sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                    {f.label}
                  </dt>
                  <dd className="mt-2 font-display text-base italic leading-snug text-espresso">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* EMBLEM NOTE */}
            <figure className="mt-12 border-l-2 border-terracotta pl-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                {t("emblemTitle")}
              </p>
              <p className="mt-3 text-base leading-relaxed text-espresso-2">
                {t("emblemBody")}
              </p>
            </figure>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* LINEAGE */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
              N° 01 ·
            </p>
            <h2 className="mt-3 font-display text-3xl font-light italic leading-tight text-espresso md:text-4xl">
              {t("lineageTitle")}
            </h2>
          </div>
          <div className="md:col-span-8">
            <p className="font-display text-xl italic leading-relaxed text-espresso">
              {t("lineageBody")}
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* MEMÓRIAS */}
      <section id="memorias" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
              N° 02 ·
            </p>
            <h2 className="mt-3 font-display text-3xl font-light italic leading-tight text-espresso md:text-4xl">
              {t("memoriasTitle")}
            </h2>
          </div>
          <div className="md:col-span-8">
            <div className="border-l border-terracotta/40 pl-6">
              <div className="space-y-6 text-base leading-relaxed text-espresso-2">
                {memoriasParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
