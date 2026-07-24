import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { submitApplication } from "./actions";

const GRADUATIONS = ["aluno", "contra-mestre", "mestre"] as const;

const labelClass =
  "font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta";
const inputClass =
  "border-b border-espresso/30 bg-transparent py-2 font-display text-lg italic text-espresso focus:border-terracotta focus:outline-none";

export default async function ApresentacaoPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ enviado?: string; erro?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { enviado, erro } = await searchParams;
  const t = await getTranslations("ApplicationPage");

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-6">
        {enviado ? (
          <p className="max-w-2xl border-l-2 border-terracotta pl-6 font-display text-2xl font-light italic leading-relaxed text-espresso">
            {t("success")}
          </p>
        ) : (
          <form
            action={submitApplication}
            className="flex max-w-2xl flex-col gap-8"
          >
            <input type="hidden" name="locale" value={locale} />
            {/* Honeypot — humans never see it */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            {erro && (
              <div className="border-l-2 border-terracotta bg-cream-2/60 px-4 py-3 text-sm text-espresso">
                {erro === "foto"
                  ? t("errorPhoto")
                  : erro === "servidor"
                    ? t("errorServer")
                    : t("errorInvalid")}
              </div>
            )}

            <label className="flex flex-col gap-2">
              <span className={labelClass}>{t("nameLabel")}</span>
              <input type="text" name="nome" required className={inputClass} />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>{t("emailLabel")}</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>{t("whereLabel")}</span>
              <input type="text" name="onde" required className={inputClass} />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>{t("sinceLabel")}</span>
              <input
                type="number"
                name="desde"
                required
                min={1950}
                max={2100}
                placeholder="2020"
                className={`${inputClass} w-32`}
              />
            </label>

            <fieldset className="flex flex-col gap-3">
              <legend className={labelClass}>{t("gradLabel")}</legend>
              <div className="mt-2 flex flex-wrap gap-x-8 gap-y-3">
                {GRADUATIONS.map((g) => (
                  <label
                    key={g}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="graduacao"
                      value={g}
                      required
                      className="accent-terracotta"
                    />
                    <span className="font-display text-lg italic text-espresso">
                      {g}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>{t("photoLabel")}</span>
              <input
                type="file"
                name="foto"
                accept="image/*"
                capture="user"
                required
                className="text-sm text-espresso-2 file:mr-4 file:cursor-pointer file:rounded-sm file:border file:border-espresso/30 file:bg-transparent file:px-4 file:py-2 file:font-mono file:text-[11px] file:uppercase file:tracking-[0.18em] file:text-espresso hover:file:border-terracotta hover:file:text-terracotta"
              />
              <span className="font-display text-sm italic text-espresso-2">
                {t("photoHint")}
              </span>
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>{t("messageLabel")}</span>
              <textarea
                name="mensagem"
                rows={4}
                className={`${inputClass} resize-y border`}
              />
            </label>

            <button
              type="submit"
              className="mt-2 self-start rounded-sm bg-espresso px-7 py-3 text-sm font-medium tracking-wide text-cream transition hover:bg-ink"
            >
              {t("submit")} →
            </button>
          </form>
        )}
      </section>

      <Footer />
    </div>
  );
}
