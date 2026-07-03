import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { login } from "./actions";

type SearchParams = Promise<{ error?: string; next?: string }>;

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { error, next } = await searchParams;
  const t = await getTranslations("LoginPage");

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-20 text-espresso">
      <div className="w-full max-w-md">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-terracotta">
          Réservé · Members only
        </p>
        <h1 className="mt-4 font-display text-5xl font-light leading-[0.95] tracking-tight text-espresso sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-sm text-base leading-relaxed text-espresso-2">
          {t("description")}
        </p>

        {error === "invalid_credentials" && (
          <div className="mt-6 border-l-2 border-terracotta bg-cream-2/60 px-4 py-3 text-sm text-espresso">
            {t("invalidCredentials")}
          </div>
        )}

        <form action={login} className="mt-10 flex flex-col gap-5">
          <input type="hidden" name="locale" value={locale} />
          {next && <input type="hidden" name="next" value={next} />}
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
              {t("emailLabel")}
            </span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="border-b border-espresso/30 bg-transparent py-2 font-display text-lg italic text-espresso focus:border-terracotta focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
              {t("passwordLabel")}
            </span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="border-b border-espresso/30 bg-transparent py-2 font-display text-lg italic text-espresso focus:border-terracotta focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="mt-4 self-start rounded-sm bg-espresso px-7 py-3 text-sm font-medium tracking-wide text-cream transition hover:bg-ink"
          >
            {t("submit")} →
          </button>
        </form>

        <p className="mt-10 max-w-sm border-l-2 border-espresso/20 pl-4 text-sm leading-relaxed text-espresso-2">
          {t("membersHint")}{" "}
          <a
            href="mailto:nevesbraga1@bluewin.ch"
            className="text-terracotta transition hover:text-terracotta-2"
          >
            nevesbraga1@bluewin.ch
          </a>
        </p>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-espresso/50">
          <Link href="/" className="hover:text-terracotta">
            ← {t("backHome")}
          </Link>
        </p>
      </div>
    </div>
  );
}
