import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { SectionDivider } from "@/components/SectionDivider";
import {
  ARRANJAMENTO,
  CONJUNTOS,
  LOUVACOES,
  NOTA_PASTINHA,
  type Tema,
} from "@/content/cantorias";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

const voiceLabel =
  "w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.25em]";

function CallResponse({ tema }: { tema: Tema }) {
  return (
    <div className="mt-4 flex flex-col gap-4 pl-10 pr-6">
      {tema.refrao && (
        <div className="flex gap-4">
          <span className={`${voiceLabel} text-terracotta`}>Refrão</span>
          <p className="font-display text-lg font-light italic leading-snug text-espresso">
            {tema.refrao}
          </p>
        </div>
      )}
      {tema.resposta && (
        <div className="flex gap-4">
          <span className={`${voiceLabel} text-espresso-2`}>Vozes</span>
          <p className="text-base leading-relaxed text-espresso-2">
            {tema.resposta}
          </p>
        </div>
      )}
      {tema.calls && tema.calls.length > 0 && (
        <div className="flex gap-4">
          <span className={`${voiceLabel} text-terracotta`}>Cantador</span>
          <ul className="flex flex-col gap-1">
            {tema.calls.map((c) => (
              <li
                key={c}
                className="font-display text-base font-light italic leading-relaxed text-espresso"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default async function CantoriasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("CantoriasPage");
  const tl = await getTranslations("LibraryPage");

  let n = 0;

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <div className="mx-auto w-full max-w-6xl px-6 pt-8">
        <Link
          href="/biblioteca"
          className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
        >
          ← {tl("title")}
        </Link>
      </div>

      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      {/* LOUVAÇÕES — the fixed sequence sung after every ladainha */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-4 pt-2">
        <div className="max-w-3xl rounded-sm border border-espresso/15 bg-cream-2/40 p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
            {t("louvacoesTitle")}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-espresso-2">
            {t("louvacoesIntro")}
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {LOUVACOES.map((l) => (
              <li key={l.call} className="flex flex-wrap gap-x-4">
                <span className="font-display text-base font-light italic text-espresso">
                  {l.call}
                </span>
                <span className="text-base text-espresso-2">
                  / {l.response}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* THE SETS — grouped by berimbau toque */}
      {CONJUNTOS.map((conjunto, ci) => (
        <div key={ci}>
          <SectionDivider
            label={conjunto.heading ?? `${t("setLabel")} ${ci + 1}`}
          />
          <section className="mx-auto w-full max-w-6xl px-6 pb-10">
            <p className="max-w-2xl font-mono text-[11px] uppercase tracking-[0.25em] leading-relaxed text-terracotta">
              {conjunto.toque}
            </p>
            {conjunto.saida && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-espresso-2">
                {conjunto.saida}
              </p>
            )}
            <ol className="mt-8 max-w-3xl divide-y divide-espresso/15 border-y border-espresso/15">
              {conjunto.temas.map((tema) => {
                n += 1;
                return (
                  <li key={tema.title}>
                    <details className="group py-5">
                      <summary className="flex cursor-pointer items-baseline gap-4 list-none [&::-webkit-details-marker]:hidden">
                        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                          {String(n).padStart(2, "0")}
                        </span>
                        <span className="flex-1 font-display text-lg font-light italic leading-snug text-espresso transition group-hover:text-terracotta">
                          {tema.title}
                        </span>
                        <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-espresso-2 sm:inline">
                          {tema.kind}
                          {tema.credit ? ` · ${tema.credit}` : ""}
                        </span>
                        <span className="font-mono text-[13px] text-terracotta">
                          <span className="group-open:hidden">+</span>
                          <span className="hidden group-open:inline">−</span>
                        </span>
                      </summary>
                      {tema.verso ? (
                        <p className="mt-4 whitespace-pre-line pl-10 pr-6 font-display text-base font-light italic leading-relaxed text-espresso">
                          {tema.verso}
                        </p>
                      ) : (
                        <CallResponse tema={tema} />
                      )}
                      {tema.kind === "ladainha" && (
                        <p className="mt-4 pl-10 font-mono text-[10px] uppercase tracking-[0.2em] text-espresso-2">
                          {t("afterLadainha")}
                        </p>
                      )}
                    </details>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      ))}

      {/* ARRANJAMENTO MUSICAL — the mestre's berimbau videos and history */}
      <SectionDivider label={ARRANJAMENTO.titulo} />
      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {ARRANJAMENTO.videos.map((v) => (
            <li key={v.id}>
              <figure>
                <div className="overflow-hidden rounded-sm border border-espresso/15">
                  <YouTubeEmbed
                    videoId={v.id}
                    title={v.title}
                    poster={`/images/videos/${v.id}.jpg`}
                  />
                </div>
                <figcaption className="mt-3 font-display text-sm italic leading-snug text-espresso">
                  {v.title}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="mt-14 max-w-3xl">
          <h3 className="font-display text-2xl font-light italic text-espresso">
            {ARRANJAMENTO.historicoTitulo}
          </h3>
          <div className="mt-5 flex flex-col gap-4">
            {ARRANJAMENTO.historico.map((p) => (
              <p key={p} className="text-base leading-relaxed text-espresso-2">
                {p}
              </p>
            ))}
          </div>
          <ol className="mt-6 flex flex-col gap-2">
            {ARRANJAMENTO.toques.map((toque, i) => (
              <li key={toque} className="flex gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                  {i + 1}
                </span>
                <span className="font-display text-base font-light italic text-espresso">
                  {toque}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-base leading-relaxed text-espresso-2">
            {ARRANJAMENTO.contrapontosIntro}
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {ARRANJAMENTO.contrapontos.map((c) => (
              <li
                key={c}
                className="pl-8 font-display text-base font-light italic text-espresso"
              >
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-8 whitespace-pre-line border-l-2 border-terracotta pl-5 text-sm leading-relaxed text-espresso-2">
            {ARRANJAMENTO.fecho}
          </p>

          <h4 className="mt-12 font-mono text-[11px] uppercase tracking-[0.25em] leading-relaxed text-terracotta">
            {ARRANJAMENTO.ajudarTitulo}
          </h4>
          <ol className="mt-5 flex flex-col gap-2">
            {ARRANJAMENTO.ajudar.map((item, i) => (
              <li key={item} className="flex gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-base leading-relaxed text-espresso">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* NOTA — the Pastinha ladainha and the mestre's authorship note */}
      <SectionDivider label={t("notaTitle")} />
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="max-w-3xl">
          <p className="whitespace-pre-line font-display text-base font-light italic leading-relaxed text-espresso">
            {NOTA_PASTINHA.verso
              .split("um mestre classificado")
              .flatMap((part, i, arr) =>
                i < arr.length - 1
                  ? [
                      part,
                      // the underline the mestre's note refers to
                      <u
                        key={i}
                        className="underline decoration-terracotta/70 underline-offset-4"
                      >
                        um mestre classificado
                      </u>,
                    ]
                  : [part]
              )}
          </p>
          <p className="mt-6 border-l-2 border-terracotta pl-5 text-sm leading-relaxed text-espresso-2">
            {NOTA_PASTINHA.nota}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
