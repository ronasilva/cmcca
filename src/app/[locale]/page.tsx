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

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      {/* HERO */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-14 pt-20 md:pt-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-terracotta">
          {t("kicker")}
        </p>
        <h1 className="mt-5 font-display text-[clamp(3.5rem,11vw,9rem)] font-light leading-[0.95] tracking-tight text-espresso">
          {t("heroTitle")}
        </h1>
        <p className="mt-6 max-w-4xl font-display text-[clamp(1.5rem,3.2vw,2.75rem)] font-light italic leading-[1.1] text-espresso">
          {t("mission")}
        </p>
        <p className="mt-8 max-w-2xl font-display text-xl leading-relaxed text-espresso-2">
          {t("heroSubtitle")}
        </p>
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

      {/* THE ASSOCIATION */}
      <section id="associacao" className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
              {t("assocNumber")}
            </p>
            <h2 className="mt-3 font-display text-4xl font-light italic leading-tight text-espresso">
              {t("assocTitle")}
            </h2>
            <div className="mt-10 flex justify-start rounded-sm bg-cream-2/40 p-8">
              <Image
                src="/cmcca-logo.png"
                alt="Emblema da CMC/CA — Associação de Capoeira Angola"
                width={400}
                height={400}
                className="h-auto w-44 max-w-full object-contain"
              />
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="font-display text-xl leading-relaxed text-espresso-2">
              {t("assocBody")}
            </p>
            <figure className="mt-12 border-l-2 border-terracotta pl-6">
              <blockquote className="font-display text-2xl italic leading-snug text-espresso">
                « Capoeira Angola, uma das culturas das diásporas africanas no
                Brasil. »
              </blockquote>
              <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
                — Mestre Braga
              </figcaption>
            </figure>
            <Link
              href="/associacao"
              className="mt-10 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
            >
              {t("assocCta")} →
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* THE SCHOOL — GECAAB */}
      <section id="escola" className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
              {t("schoolNumber")}
            </p>
            <h2 className="mt-3 font-display text-4xl font-light italic leading-tight text-espresso">
              {t("schoolTitle")}
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="font-display text-xl leading-relaxed text-espresso-2">
              {t("schoolBody")}
            </p>
            <div className="mt-10 flex justify-center rounded-sm bg-plate px-6 py-10">
              <Image
                src="/gecaab-logo.png"
                alt="Emblema do GECAAB — Grupo/Escola de Capoeira Angola África Bantu"
                width={600}
                height={388}
                className="h-auto w-80 max-w-full object-contain"
              />
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
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

      <SectionDivider />

      {/* THE LIBRARY — ESFÉRA INTELECTUAL */}
      <section id="biblioteca" className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
              {t("libraryNumber")}
            </p>
            <h2 className="mt-3 font-display text-4xl font-light italic leading-tight text-espresso">
              {t("libraryTitle")}
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="font-display text-xl leading-relaxed text-espresso-2">
              {t("libraryBody")}
            </p>
            <Link
              href="/biblioteca"
              className="mt-10 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
            >
              {t("libraryCta")} →
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* CONTACT */}
      <section id="contact" className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
              {t("contactNumber")}
            </p>
            <h2 className="mt-3 font-display text-4xl font-light italic leading-tight text-espresso">
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
