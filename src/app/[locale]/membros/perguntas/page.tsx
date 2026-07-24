import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admins";
import { listQuestions } from "@/lib/questions";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { answerQuestion, deleteQuestion } from "./actions";

// Curation tool for the mestre and the site admin.
export default async function PerguntasAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("QuestionsAdmin");
  const tn = await getTranslations("Nav");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminUser(user)) notFound();

  const questions = await listQuestions();

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
        {questions.length === 0 ? (
          <p className="font-display text-base italic leading-relaxed text-espresso-2">
            {t("empty")}
          </p>
        ) : (
          <ul className="flex flex-col gap-8">
            {questions.map((q) => (
              <li
                key={q.id}
                className="rounded-sm border border-espresso/15 bg-cream-2/40 p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em]">
                    {q.published ? (
                      <span className="text-espresso-2">
                        ● {t("publishedBadge")}
                      </span>
                    ) : (
                      <span className="text-terracotta">
                        ● {t("pendingBadge")}
                      </span>
                    )}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-espresso-2">
                    {q.name || t("anonymous")} · {t("receivedOn")}{" "}
                    {new Date(q.submittedAt).toLocaleDateString(locale)}
                  </p>
                </div>

                <p className="mt-4 font-display text-2xl font-light italic leading-snug text-espresso">
                  {q.question}
                </p>

                <form action={answerQuestion} className="mt-6 flex flex-col gap-4">
                  <input type="hidden" name="id" value={q.id} />
                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta">
                      {t("answerLabel")}
                    </span>
                    <textarea
                      name="resposta"
                      rows={5}
                      defaultValue={q.answer ?? ""}
                      className="rounded-sm border border-espresso/30 bg-transparent p-3 text-base leading-relaxed text-espresso focus:border-terracotta focus:outline-none"
                    />
                  </label>
                  <div className="flex flex-wrap items-center gap-6">
                    <button
                      type="submit"
                      name="publicar"
                      value="1"
                      className="rounded-sm border border-terracotta px-5 py-2 font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:bg-terracotta hover:text-background"
                    >
                      {t("publish")} →
                    </button>
                    {q.published && (
                      <button
                        type="submit"
                        name="publicar"
                        value="0"
                        className="font-mono text-[12px] uppercase tracking-[0.18em] text-espresso-2 transition hover:text-terracotta"
                      >
                        {t("unpublish")} ⏻
                      </button>
                    )}
                  </div>
                </form>
                <form action={deleteQuestion} className="mt-4">
                  <input type="hidden" name="id" value={q.id} />
                  <button
                    type="submit"
                    className="font-mono text-[12px] uppercase tracking-[0.18em] text-espresso-2 transition hover:text-terracotta"
                  >
                    {t("delete")} ✕
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Footer />
    </div>
  );
}
