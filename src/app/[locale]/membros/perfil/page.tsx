import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { findMemberFicha } from "@/lib/member-ficha";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { PhotoField } from "@/components/PhotoField";
import { updateProfile } from "./actions";

const GRADUATIONS = ["aluno", "contra-mestre", "mestre"] as const;

const labelClass =
  "font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta";
const inputClass =
  "border-b border-espresso/30 bg-transparent py-2 font-display text-lg italic text-espresso focus:border-terracotta focus:outline-none";

export default async function PerfilPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { erro } = await searchParams;
  const t = await getTranslations("ProfilePage");
  const ta = await getTranslations("ApplicationPage");
  const tn = await getTranslations("Nav");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect({ href: "/login?next=%2Fmembros%2Fperfil", locale });
    return null;
  }

  const member = await findMemberFicha(user.id);
  const ficha = member?.ficha;

  // since is YYYY, YYYY-MM or YYYY-MM-DD
  const [sinceYear = "", sinceMonth = "", sinceDay = ""] = (
    ficha?.since ?? ""
  ).split("-");

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <div className="mx-auto w-full max-w-6xl px-6 pt-8">
        <Link
          href="/membros"
          className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
        >
          ← {tn("memberArea")}
        </Link>
      </div>

      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-6">
        {erro && (
          <div className="mb-10 max-w-2xl border-l-2 border-terracotta bg-cream-2/60 px-4 py-3 text-sm text-espresso">
            {erro === "senha"
              ? t("errorPassword")
              : erro === "foto"
                ? t("errorPhoto")
                : erro === "servidor"
                  ? t("errorServer")
                  : t("errorInvalid")}
          </div>
        )}

        <form action={updateProfile} className="flex max-w-2xl flex-col gap-8">
          <input type="hidden" name="locale" value={locale} />

          <div className="flex flex-col gap-2">
            <span className={labelClass}>{t("emailLabel")}</span>
            <p className="py-2 font-display text-lg italic text-espresso-2">
              {user.email}
            </p>
          </div>

          {ficha ? (
            <>
              <label className="flex flex-col gap-2">
                <span className={labelClass}>{ta("nameLabel")}</span>
                <input
                  type="text"
                  name="nome"
                  required
                  defaultValue={ficha.name}
                  className={inputClass}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className={labelClass}>{ta("apelidoLabel")}</span>
                <input
                  type="text"
                  name="apelido"
                  maxLength={60}
                  defaultValue={ficha.apelido ?? ""}
                  className={inputClass}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className={labelClass}>{ta("whereLabel")}</span>
                <input
                  type="text"
                  name="onde"
                  required
                  defaultValue={ficha.where}
                  className={inputClass}
                />
              </label>

              <fieldset className="flex flex-col gap-2">
                <legend className={labelClass}>{ta("sinceLabel")}</legend>
                <div className="mt-2 flex flex-wrap gap-6">
                  <label className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-espresso-2">
                      {ta("sinceDay")}
                    </span>
                    <select
                      name="desdeDia"
                      defaultValue={sinceDay ? Number(sinceDay) : ""}
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
                      {ta("sinceMonth")}
                    </span>
                    <select
                      name="desdeMes"
                      required
                      defaultValue={sinceMonth ? Number(sinceMonth) : ""}
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
                      {ta("sinceYear")}
                    </span>
                    <input
                      type="number"
                      name="desdeAno"
                      required
                      min={1950}
                      max={2100}
                      defaultValue={sinceYear}
                      className={`${inputClass} w-24`}
                    />
                  </label>
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-3">
                <legend className={labelClass}>{ta("gradLabel")}</legend>
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
                        defaultChecked={ficha.graduation === g}
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
                <div className="flex items-start gap-6">
                  {member?.photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photoUrl}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-sm border border-espresso/15 object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <PhotoField
                      name="foto"
                      required={false}
                      strings={{
                        take: ta("photoTake"),
                        upload: ta("photoUpload"),
                        capture: ta("photoCapture"),
                        cancel: ta("photoCancel"),
                        retake: ta("photoRetake"),
                        error: ta("photoCameraError"),
                      }}
                    />
                  </div>
                </div>
              </div>

              <label className="flex flex-col gap-2">
                <span className={labelClass}>{t("certLabel")}</span>
                <input
                  type="file"
                  name="certificado"
                  accept="image/*,application/pdf"
                  className="text-sm text-espresso-2 file:mr-4 file:cursor-pointer file:rounded-sm file:border file:border-espresso/30 file:bg-transparent file:px-4 file:py-2 file:font-mono file:text-[11px] file:uppercase file:tracking-[0.18em] file:text-espresso hover:file:border-terracotta hover:file:text-terracotta"
                />
              </label>
            </>
          ) : (
            <p className="max-w-xl font-display text-base italic leading-relaxed text-espresso-2">
              {t("noFicha")}
            </p>
          )}

          <div className="relative mt-4">
            <span className="block h-px w-full bg-espresso/20" />
            <span className="absolute left-0 top-0 -translate-y-1/2 bg-background pr-4 font-mono text-[11px] uppercase tracking-[0.35em] text-terracotta">
              {t("passwordTitle")}
            </span>
          </div>

          <label className="flex flex-col gap-2">
            <span className={labelClass}>{t("newPasswordLabel")}</span>
            <input
              type="password"
              name="senha"
              minLength={8}
              autoComplete="new-password"
              className={inputClass}
            />
            <span className="font-display text-sm italic text-espresso-2">
              {t("passwordHint")}
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className={labelClass}>{t("confirmPasswordLabel")}</span>
            <input
              type="password"
              name="senha2"
              minLength={8}
              autoComplete="new-password"
              className={inputClass}
            />
          </label>

          <button
            type="submit"
            className="mt-2 self-start rounded-sm bg-espresso px-7 py-3 text-sm font-medium tracking-wide text-cream transition hover:bg-ink"
          >
            {t("save")} →
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
}
