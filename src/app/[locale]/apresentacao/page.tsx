import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { PhotoField } from "@/components/PhotoField";
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
                  : erro === "senha"
                    ? t("errorPassword")
                    : erro === "email"
                      ? t("errorEmail")
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
              <span className={labelClass}>{t("passwordLabel")}</span>
              <input
                type="password"
                name="senha"
                required
                minLength={8}
                autoComplete="new-password"
                className={inputClass}
              />
              <span className="font-display text-sm italic text-espresso-2">
                {t("passwordHint")}
              </span>
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>{t("passwordConfirmLabel")}</span>
              <input
                type="password"
                name="senha2"
                required
                minLength={8}
                autoComplete="new-password"
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>{t("whereLabel")}</span>
              <input type="text" name="onde" required className={inputClass} />
            </label>

            <fieldset className="flex flex-col gap-2">
              <legend className={labelClass}>{t("sinceLabel")}</legend>
              <div className="mt-2 flex flex-wrap gap-6">
                <label className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-espresso-2">
                    {t("sinceDay")}
                  </span>
                  <select
                    name="desdeDia"
                    defaultValue=""
                    className={`${inputClass} w-20 cursor-pointer`}
                  >
                    <option value="">—</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-espresso-2">
                    {t("sinceMonth")}
                  </span>
                  <select
                    name="desdeMes"
                    required
                    defaultValue=""
                    className={`${inputClass} w-40 cursor-pointer`}
                  >
                    <option value="" disabled>
                      —
                    </option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Intl.DateTimeFormat(locale, {
                          month: "long",
                        }).format(new Date(2000, i, 1))}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-espresso-2">
                    {t("sinceYear")}
                  </span>
                  <input
                    type="number"
                    name="desdeAno"
                    required
                    min={1950}
                    max={2100}
                    placeholder="2015"
                    className={`${inputClass} w-24`}
                  />
                </label>
              </div>
              <span className="font-display text-sm italic text-espresso-2">
                {t("sinceHint")}
              </span>
            </fieldset>

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

            <div className="flex flex-col gap-2">
              <span className={labelClass}>{t("photoLabel")}</span>
              <PhotoField
                name="foto"
                strings={{
                  take: t("photoTake"),
                  upload: t("photoUpload"),
                  capture: t("photoCapture"),
                  cancel: t("photoCancel"),
                  retake: t("photoRetake"),
                  error: t("photoCameraError"),
                }}
              />
            </div>

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
