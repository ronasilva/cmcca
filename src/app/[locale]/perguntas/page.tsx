import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { SectionDivider } from "@/components/SectionDivider";
import {
  listPublishedQuestions,
  listArchiveQuestions,
} from "@/lib/questions";
import { submitQuestion } from "./actions";

const labelClass =
  "font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta";
const inputClass =
  "border-b border-espresso/30 bg-transparent py-2 font-display text-lg italic text-espresso focus:border-terracotta focus:outline-none";

export default async function PerguntasPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ enviado?: string; erro?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { enviado, erro } = await searchParams;
  const t = await getTranslations("QuestionsPage");

  const [published, arquivo] = await Promise.all([
    listPublishedQuestions(),
    listArchiveQuestions(),
  ]);

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      {/* PUBLISHED ANSWERS — the mestre's curated responses */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-8 pt-6">
        {published.length === 0 ? (
          <p className="font-display text-base italic leading-relaxed text-espresso-2">
            {t("answersEmpty")}
          </p>
        ) : (
          <ol className="flex max-w-3xl flex-col gap-12">
            {published.map((q, i) => (
              <li key={q.id}>
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                    {String(published.length - i).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-2xl font-light italic leading-snug text-espresso">
                    {q.question}
                  </h2>
                </div>
                {q.name && (
                  <p className="mt-1 pl-10 font-mono text-[10px] uppercase tracking-[0.25em] text-espresso-2">
                    — {q.name}
                  </p>
                )}
                <p className="mt-4 whitespace-pre-line pl-10 text-base leading-relaxed text-espresso-2">
                  {q.answer}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>

      {arquivo.length > 0 && (
        <>
          <SectionDivider label={t("archiveTitle")} />

          {/* PARA TURBINAR A MEMÓRIA — the mestre's own questions */}
          <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-2">
            <p className="max-w-2xl text-base leading-relaxed text-espresso-2">
              {t("archiveIntro")}
            </p>
            <ol className="mt-10 max-w-3xl divide-y divide-espresso/15 border-y border-espresso/15">
              {arquivo.map((q) => (
                <li key={q.id}>
                  <details className="group py-5">
                    <summary className="flex cursor-pointer items-baseline gap-4 list-none [&::-webkit-details-marker]:hidden">
                      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                        {String(q.ordem ?? 0).padStart(2, "0")}
                      </span>
                  <span className="flex-1 font-display text-lg font-light italic leading-snug text-espresso transition group-hover:text-terracotta">
                    {q.question}
                  </span>
                  <span className="font-mono text-[13px] text-terracotta transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 whitespace-pre-line pl-10 pr-6 text-base leading-relaxed text-espresso-2">
                  {q.answer}
                </p>
              </details>
            </li>
          ))}
        </ol>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-espresso-2">
          <a
            href="https://sites.google.com/view/capoeiras-e-capoeira-angola-/quest%C3%B5es-e-respostas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-terracotta transition hover:text-terracotta-2"
          >
                {t("archiveSource")} ↗
              </a>
            </p>
          </section>
        </>
      )}

      <SectionDivider label={t("formTitle")} />

      {/* ASK — public form, curated afterwards */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-2">
        {enviado ? (
          <p className="max-w-2xl border-l-2 border-terracotta pl-6 font-display text-2xl font-light italic leading-relaxed text-espresso">
            {t("success")}
          </p>
        ) : (
          <form
            action={submitQuestion}
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
                {erro === "servidor" ? t("errorServer") : t("errorInvalid")}
              </div>
            )}

            <label className="flex flex-col gap-2">
              <span className={labelClass}>{t("nameLabel")}</span>
              <input
                type="text"
                name="nome"
                required
                maxLength={80}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>{t("questionLabel")}</span>
              <textarea
                name="pergunta"
                required
                minLength={10}
                maxLength={2000}
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
