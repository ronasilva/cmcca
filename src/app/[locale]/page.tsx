import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/SectionDivider";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HomePage");
  const tn = await getTranslations("AssociationPage");

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      {/* IDENTITY — statement left, emblem right (mirrors the school section) */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-14 pt-16 md:pt-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <p className="font-mono text-[12px] uppercase tracking-[0.35em] text-terracotta">
              {t("kicker")}
            </p>
            <h1 className="mt-4 font-display text-[clamp(3rem,7vw,6.5rem)] font-light leading-[0.95] tracking-tight text-espresso">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 font-display text-[clamp(1.4rem,2.6vw,2.25rem)] font-light italic leading-[1.15] text-espresso">
              {t("mission")}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-espresso-2">
              {t("culturalIntro")}
            </p>
          </div>
          {/* Leads on mobile (order-first), sits right of the statement on md+ */}
          <div className="order-first md:order-0 md:col-span-4 md:col-start-9">
            <Image
              src="/cmcca-logo.png"
              alt="Emblema da CMC/CA — Associação de Capoeira Angola"
              width={370}
              height={373}
              priority
              className="h-auto w-36 max-w-full object-contain md:w-full"
            />
          </div>
        </div>
      </section>

      {/* ZEBRA FILM — full-bleed cinematic band */}
      <section className="relative w-full overflow-hidden border-t border-espresso/15">
        <video
          src="/two-zebras.mp4"
          poster="/two-zebras-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="aspect-video w-full object-cover motion-reduce:hidden md:aspect-auto md:h-[58vh] md:min-h-80"
        />
        {/* Static frame for visitors with reduced-motion enabled */}
        <Image
          src="/two-zebras-poster.jpg"
          alt=""
          aria-hidden="true"
          width={1600}
          height={900}
          className="hidden aspect-video w-full object-cover motion-reduce:block md:aspect-auto md:h-[58vh] md:min-h-80"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background/40 via-transparent to-background/70" />
      </section>
      <div className="border-y border-espresso/15">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <span aria-hidden className="text-[11px] text-terracotta">◆</span>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-espresso-2">
            {t("videoCaption")}
          </p>
        </div>
      </div>

      {/* MEMÓRIA — the archival band: engraving + historic film as museum plates */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-terracotta">
          {t("memoriaEyebrow")}
        </p>
        <h2 className="mt-3 font-display text-3xl font-light italic leading-tight text-espresso md:text-4xl">
          {t("memoriaTitle")}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-espresso-2">
          {t("memoriaIntro")}
        </p>

        {/* 1fr : 1.71fr makes both figures render at exactly the same height —
            1.71 = (16/9) / (313/301), the ratio of the two aspect ratios. */}
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.71fr] md:items-start">
          <figure>
            <div className="overflow-hidden rounded-sm border border-espresso/15">
              <Image
                src="/gravura-maltas.jpg"
                alt={t("gravuraCaption")}
                width={313}
                height={301}
                className="h-auto w-full object-contain"
              />
            </div>
            <figcaption className="mt-3 font-display text-sm italic leading-relaxed text-espresso-2">
              {t("gravuraCaption")}
            </figcaption>
          </figure>
          <figure>
            <div className="overflow-hidden rounded-sm border border-espresso/15">
              <YouTubeEmbed
                videoId="8hngKFy3gaM"
                title="Capoeira Angola Tradicional — Antiga na Bahia (TV France)"
                poster="/video-bahia-poster.jpg"
              />
            </div>
            <figcaption className="mt-3 font-display text-sm italic leading-relaxed text-espresso-2">
              {t("historicVideoCaption")}
            </figcaption>
          </figure>
        </div>

        <Link
          href="/historia"
          className="mt-10 inline-block font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
        >
          {t("memoriaCta")} →
        </Link>
      </section>

      <SectionDivider />

      {/* ÁFRICA BANTU — the school: description, schedule glance, CTA */}
      <section id="escola" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-terracotta">
              {t("schoolEyebrow")}
            </p>
            <h2 className="mt-3 font-display text-3xl font-light italic leading-tight text-espresso md:text-4xl">
              GECAAB / África Bantu
            </h2>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-espresso-2">
              Genève – Suisse
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-espresso-2">
              {t("schoolBody")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/mestre"
                className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
              >
                {t("schoolCtaMestre")} →
              </Link>
              <Link
                href="/cours"
                className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
              >
                {t("schoolCtaSchedule")} →
              </Link>
            </div>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            {/* Signature size on mobile, full column on md+ */}
            <div className="max-w-64 rounded-sm border border-espresso/15 bg-white p-4 md:max-w-none md:p-6">
              <Image
                src="/africa-bantu-logo.png"
                alt="Emblema do GECAAB — Grupo/Escola de Capoeira Angola África Bantu"
                width={1200}
                height={860}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* NOTA — same section grammar as the rest of the page */}
      <SectionDivider />
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-terracotta">
          {tn("noteLabel")}
        </p>
        <h2 className="mt-3 font-display text-3xl font-light italic leading-tight text-espresso md:text-4xl">
          {tn("noteTitle")}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-espresso-2">
          {tn("noteBody")}
        </p>
      </section>

      <Footer />
    </div>
  );
}
