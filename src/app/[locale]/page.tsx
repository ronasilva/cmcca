import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
          Capoeira Angola
        </p>
        <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light italic leading-[1.05] tracking-tight text-espresso">
          {t("heroTitle")}
        </h1>
        <p className="mt-8 max-w-2xl font-display text-2xl leading-snug text-espresso-2">
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

      {/* ABOUT */}
      <section id="sobre" className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
              N° 01 ·
            </p>
            <h2 className="mt-3 font-display text-4xl font-light italic leading-tight text-espresso">
              {t("aboutTitle")}
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="font-display text-xl leading-relaxed text-espresso-2">
              {t("aboutBody")}
            </p>
            <div className="mt-12 flex justify-center rounded-sm bg-plate px-6 py-10">
              <Image
                src="/gecaab-logo.png"
                alt="Emblema do GECAAB — Grupo/Escola de Capoeira Angola África Bantu"
                width={600}
                height={388}
                className="h-auto w-96 max-w-full object-contain"
              />
            </div>
            <figure className="mt-12 border-l-2 border-terracotta pl-6">
              <blockquote className="font-display text-2xl italic leading-snug text-espresso">
                « Capoeira Angola, uma das culturas das diásporas africanas no
                Brasil. »
              </blockquote>
              <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
                — Mestre Braga
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* CONTACT */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
              N° 02 ·
            </p>
            <h2 className="mt-3 font-display text-4xl font-light italic leading-tight text-espresso">
              {t("contactTitle")}
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="font-display text-xl leading-relaxed text-espresso-2">
              {t("contactBody")}
            </p>
            <dl className="mt-10 grid grid-cols-1 gap-8 text-sm sm:grid-cols-2">
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
