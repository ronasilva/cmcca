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

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <PageHeader eyebrow={t("eyebrow")} title={t("title")} />

      {/* BERIMBAU FILM — full-bleed cinematic band */}
      <section className="relative w-full overflow-hidden border-t border-espresso/15">
        <video
          src="/berimbau-close-up.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="h-[52vh] min-h-80 w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background/40 via-transparent to-background/70" />
      </section>
      <div className="border-y border-espresso/15">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <span aria-hidden className="text-[10px] text-terracotta">
            ◆
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-espresso-2">
            {t("videoCaption")}
          </p>
        </div>
      </div>

      {/* SUBTITLE + BIO */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-display text-2xl italic leading-snug text-espresso-2">
              {t("subtitle")}
            </p>
          </div>
          <div className="md:col-span-8">
            <p className="font-display text-xl leading-relaxed text-espresso">
              {t("bio")}
            </p>
          </div>
        </div>
      </section>

      <SectionDivider label={t("lineageTitle")} />

      {/* LINEAGE */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
              N° 01 ·
            </p>
            <h2 className="mt-3 font-display text-4xl font-light italic leading-tight text-espresso">
              {t("lineageTitle")}
            </h2>
          </div>
          <div className="md:col-span-8">
            <p className="font-display text-2xl leading-relaxed text-espresso">
              {t("lineageBody")}
            </p>
          </div>
        </div>
      </section>

      <SectionDivider label={t("memoriasTitle")} />

      {/* MEMÓRIAS */}
      <section id="memorias" className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
              N° 02 ·
            </p>
            <h2 className="mt-3 font-display text-4xl font-light italic leading-tight text-espresso">
              {t("memoriasTitle")}
            </h2>
          </div>
          <div className="md:col-span-8">
            <div className="border-l border-terracotta/40 pl-6">
              <div className="space-y-6 font-display text-lg leading-relaxed text-espresso md:text-xl">
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
