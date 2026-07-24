import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { SectionDivider } from "@/components/SectionDivider";

export default async function CoursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("CoursPage");

  const schedule = [
    { day: t("monday"), hours: t("mondayHours"), label: t("mondayLabel") },
    { day: t("wednesday"), hours: t("wednesdayHours"), label: t("wednesdayLabel") },
    { day: t("friday"), hours: t("fridayHours"), label: t("fridayLabel") },
  ];

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <SectionDivider />

      {/* SCHEDULE */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
              N° 01 ·
            </p>
            <h2 className="mt-3 font-display text-3xl font-light italic leading-tight text-espresso md:text-4xl">
              {t("scheduleTitle")}
            </h2>
          </div>
          <div className="md:col-span-8">
            <ul className="divide-y divide-terracotta/20 border-y border-terracotta/20">
              {schedule.map((s) => (
                <li
                  key={s.day}
                  className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-12 sm:items-baseline"
                >
                  <p className="font-display text-2xl font-light italic text-espresso sm:col-span-4">
                    {s.day}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-terracotta sm:col-span-3">
                    {s.hours}
                  </p>
                  <p className="text-base text-espresso-2 sm:col-span-5">
                    {s.label}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-display text-base italic leading-relaxed text-espresso">
              {t("firstClassNote")}
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* LOCATION */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
              N° 02 ·
            </p>
            <h2 className="mt-3 font-display text-3xl font-light italic leading-tight text-espresso md:text-4xl">
              {t("locationTitle")}
            </h2>
          </div>
          <div className="md:col-span-8">
            <p className="font-display text-2xl font-light italic text-espresso">
              {t("locationName")}
            </p>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-espresso-2">
              {t("locationAddress")}
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Centre+ADEM%2C+10+rue+de+Montbrillant%2C+1201+Gen%C3%A8ve"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
            >
              {t("mapCta")} ↗
            </a>
            <p className="mt-6 max-w-xl text-sm text-espresso-2/80">
              {t("locationNote")}
            </p>
            <div className="mt-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                {t("dressCodeTitle")}
              </p>
              <p className="mt-2 font-display text-base italic text-espresso">
                {t("dressCodeBody")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* TEACHING — two tracks (public overview, full programme in member area) */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
              N° 03 ·
            </p>
            <h2 className="mt-3 font-display text-3xl font-light italic leading-tight text-espresso md:text-4xl">
              {t("ensinoTitle")}
            </h2>
          </div>
          <div className="md:col-span-8">
            <p className="max-w-xl text-base leading-relaxed text-espresso-2">
              {t("ensinoIntro")}
            </p>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-sm border border-espresso/15 bg-cream-2/40 px-6 py-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                  01
                </p>
                <h3 className="mt-3 font-display text-2xl font-light italic text-espresso">
                  {t("track1Title")}
                </h3>
                <p className="mt-3 text-base text-espresso-2">{t("track1Body")}</p>
              </div>
              <div className="rounded-sm border border-espresso/15 bg-cream-2/40 px-6 py-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                  02
                </p>
                <h3 className="mt-3 font-display text-2xl font-light italic text-espresso">
                  {t("track2Title")}
                </h3>
                <p className="mt-3 text-base text-espresso-2">{t("track2Body")}</p>
              </div>
            </div>
            <Link
              href="/login"
              className="mt-10 inline-block font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
            >
              {t("ensinoCta")} →
            </Link>
            <p className="mt-12 max-w-xl border-t border-espresso/15 pt-6 text-base leading-relaxed text-espresso-2">
              {t("feesNote")}{" "}
              <a
                href="mailto:mestrebraga1@gmail.com"
                className="text-terracotta transition hover:text-terracotta-2"
              >
                mestrebraga1@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
