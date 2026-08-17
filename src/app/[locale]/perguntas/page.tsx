import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { SectionDivider } from "@/components/SectionDivider";
import { listPublishedQuestions } from "@/lib/questions";
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

  const corpus = await listPublishedQuestions();

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <SectionDivider label={t("archiveTitle")} />

      {/* PARA TURBINAR A MEMÓRIA — one living corpus: the mestre's 39
          original questions plus published answers to visitor questions,
          all in one continuous numbering */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-2">
        <p className="max-w-2xl text-base leading-relaxed text-espresso-2">
          {t("archiveIntro")}
        </p>
        <ol className="mt-10 max-w-3xl divide-y divide-espresso/15 border-y border-espresso/15">
          {corpus.map((q) => (
            <li key={q.id}>
              <details className="group py-5">
                <summary className="flex cursor-pointer items-baseline gap-4 list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                    {q.ordem ? String(q.ordem).padStart(2, "0") : "·"}
                  </span>
                  <span className="flex-1 font-display text-lg font-light italic leading-snug text-espresso transition group-hover:text-terracotta">
                    {q.question}
                  </span>
                  <span className="font-mono text-[13px] text-terracotta transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                {q.name && (
                  <p className="mt-2 pl-10 font-mono text-[10px] uppercase tracking-[0.25em] text-espresso-2">
                    — {t("askedBy", { name: q.name })}
                  </p>
                )}
                <p className="mt-4 whitespace-pre-line pl-10 pr-6 text-base leading-relaxed text-espresso-2">
                  {q.answer}
                </p>
              </details>
            </li>
          ))}
        </ol>
      </section>

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
