import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/SectionDivider";

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

      {/* IDENTITY — emblem left, description right (Mestre Braga's layout) */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-14 pt-16 md:pt-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-4">
            <Image
              src="/cmcca-logo.png"
              alt="Emblema da CMC/CA — Associação de Capoeira Angola"
              width={400}
              height={400}
              priority
              className="h-auto w-44 max-w-full object-contain md:w-52"
            />
          </div>
          <div className="md:col-span-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-terracotta">
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
        </div>
      </section>

      {/* ZEBRA FILM — full-bleed cinematic band */}
      <section className="relative w-full overflow-hidden border-t border-espresso/15">
        <video
          src="/two-zebras.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="h-[58vh] min-h-80 w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background/40 via-transparent to-background/70" />
      </section>
      <div className="border-y border-espresso/15">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <span aria-hidden className="text-[10px] text-terracotta">◆</span>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-espresso-2">
            {t("videoCaption")}
          </p>
        </div>
      </div>

      {/* GRAVURAS DE MALTAS — historical engraving */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <div className="overflow-hidden rounded-sm border border-espresso/15 bg-plate p-3">
              <Image
                src="/gravura-maltas.jpg"
                alt={t("gravuraCaption")}
                width={313}
                height={301}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
              {t("gravuraTitle")}
            </p>
            <p className="mt-3 font-display text-xl leading-relaxed text-espresso-2">
              {t("gravuraCaption")}
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ÁFRICA BANTU — the school (logo left, text right) */}
      <section id="escola" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-4">
            <Image
              src="/africa-bantu-logo.png"
              alt="Emblema do GECAAB — Grupo/Escola de Capoeira Angola África Bantu"
              width={452}
              height={386}
              className="h-auto w-44 max-w-full object-contain md:w-52"
            />
          </div>
          <div className="md:col-span-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-terracotta">
              {t("schoolTagline")}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-espresso-2">
              Genève – Suisse
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <li>
                <Link
                  href="/mestre"
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
                >
                  {t("schoolCtaMestre")} →
                </Link>
              </li>
              <li>
                <Link
                  href="/cours"
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
                >
                  {t("schoolCtaCourses")} →
                </Link>
              </li>
              <li>
                <Link
                  href="/historia"
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
                >
                  {t("schoolCtaHistory")} →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* NOTA — the manifesto, placed with the África Bantu mark */}
      <SectionDivider label={tn("noteLabel")} />
      <section className="mx-auto w-full max-w-3xl px-6 py-12">
        <p className="border-l-2 border-terracotta pl-6 font-display text-2xl font-light italic leading-relaxed text-espresso">
          {tn("noteBody")}
        </p>
      </section>

      <SectionDivider />

      {/* CONTACT */}
      <section id="contact" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="font-display text-4xl font-light italic leading-tight text-espresso">
              {t("contactTitle")}
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <dl className="grid grid-cols-1 gap-8 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
                  E-mail
                </dt>
                <dd className="mt-2 font-display text-lg italic text-espresso">
                  <a
                    href="mailto:nevesbraga1@bluewin.ch"
                    className="hover:text-terracotta"
                  >
                    nevesbraga1@bluewin.ch
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
                  Tél.
                </dt>
                <dd className="mt-2 font-display text-lg italic text-espresso">
                  +41 (0) 78 914 89 69
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
                  Facebook
                </dt>
                <dd className="mt-2 font-display text-lg italic text-espresso">
                  <a
                    href="https://www.facebook.com/CapoeiraGeneveAfricaBantu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-terracotta"
                  >
                    @CapoeiraGeneveAfricaBantu
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
