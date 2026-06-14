import { getTranslations, setRequestLocale } from "next-intl/server";
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

      <SectionDivider label={t("scheduleTitle")} />

      {/* SCHEDULE */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
              N° 01 ·
            </p>
            <h2 className="mt-3 font-display text-4xl font-light italic leading-tight text-espresso">
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
                  <p className="font-display text-3xl font-light italic text-espresso sm:col-span-4">
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
          </div>
        </div>
      </section>

      <SectionDivider label={t("locationTitle")} />

      {/* LOCATION */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
              N° 02 ·
            </p>
            <h2 className="mt-3 font-display text-4xl font-light italic leading-tight text-espresso">
              {t("locationTitle")}
            </h2>
          </div>
          <div className="md:col-span-8">
            <p className="font-display text-3xl italic text-espresso">
              {t("locationName")}
            </p>
            <p className="mt-3 max-w-xl text-lg text-espresso-2">
              {t("locationAddress")}
            </p>
            <p className="mt-6 max-w-xl text-sm text-espresso-2/80">
              {t("locationNote")}
            </p>
            <div className="mt-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
                {t("dressCodeTitle")}
              </p>
              <p className="mt-2 font-display text-lg italic text-espresso">
                {t("dressCodeBody")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
