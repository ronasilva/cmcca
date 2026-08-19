import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  createAdminClient,
  STUDENT_MEDIA_BUCKET,
} from "@/lib/supabase/admin";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { SectionDivider } from "@/components/SectionDivider";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { ARRANJAMENTO } from "@/content/cantorias";

type Book = { title: string; author: string };

// The mestre's discography: Antonio L.N. Braga (m/Braga). Local tracks
// stream from the private bucket via long-lived signed URLs; the WAV
// masters stay offline. Released albums live on Bandcamp.
const DISCOS: {
  title: string;
  year?: number;
  yearLabel?: string;
  inProduction?: boolean;
  bandcampUrl?: string;
  youtubeUrl?: string;
  cover?: string;
  encarte?: {
    titulo: string;
    nota?: string;
    itens: { nome: string; credito?: string }[];
  }[];
  tracks?: { label: string; path: string }[];
}[] = [
  {
    title: "Novo CD",
    year: 2026,
    inProduction: true,
    tracks: [
      { label: "Faixa 1", path: "discografia/novo-cd/faixa-1.m4a" },
    ],
  },
  {
    title:
      "Conhecimento de memória dos capoeiras em Capoeira Angola (berimbau e cantorias)",
    year: 2024,
    cover: "/images/discografia/cd-2024.jpg",
    bandcampUrl:
      "https://berinbaucantoriasbraga2.bandcamp.com/album/conhecimento-de-mem-ria-dos-capoeiras-em-capoeira-angola-berimbau-e-cantorias-g-ecaab-rj-2",
  },
  {
    title: "África Bantu: documentação memória da capoeira, vol. 1",
    yearLabel: "anterior a 2008",
    youtubeUrl: "https://youtu.be/LFMNk_i0vIk",
    cover: "/images/discografia/cd-vol1.jpg",
    encarte: [
      {
        titulo: "Fatos falados",
        itens: [
          { nome: "O arco musical berimbau" },
          { nome: "Triângulo da história" },
          { nome: "Invasão holandesa" },
          { nome: "Capitão do mato" },
          { nome: "Maltas / Guerra do Paraguai" },
          { nome: "Cavalaria" },
          { nome: "Rasteira na polícia" },
          { nome: "Pastinha" },
        ],
      },
      {
        titulo: "Temas cantados para ouvir e louvar antes de sair",
        nota: "m/Braga: intérprete, adaptação e versão",
        itens: [
          { nome: "Zebra mandigueira", credito: "Elizeu (angolano)" },
          { nome: "Foram pelo mar", credito: "m/Braga" },
          { nome: "Iê tava em casa" },
          { nome: "Lá atiraram na cruz" },
          { nome: "Cidade de Assunção" },
        ],
      },
      {
        titulo: "Temas cantados que indicam jogo",
        itens: [
          { nome: "Vai vai vai diz pra mim", credito: "Elizeu" },
          { nome: "No balanço do mar", credito: "m/Braga" },
          { nome: "Holandeses", credito: "m/Braga" },
          { nome: "Capitão do mato inimigo", credito: "m/Braga" },
          { nome: "No Brasil na capoeira", credito: "m/Braga" },
          { nome: "Paranaê" },
          { nome: "Vieram me buscar" },
          { nome: "Vai dizer avisa lá", credito: "m/Braga" },
          { nome: "Quem não pode com besouro" },
          { nome: "Pau rolou na mata" },
          { nome: "Quebra gereba" },
          { nome: "Vou pra Luanda", credito: "m/Braga" },
          { nome: "Quem não sabe", credito: "m/Braga" },
          { nome: "Apanha a laranja" },
          { nome: "Me dá meu dinheiro" },
          { nome: "Dois tostões", credito: "m/Braga" },
        ],
      },
    ],
    tracks: [
      { label: "Parte 1", path: "discografia/cds-antigos/cd1-parte-01.mp3" },
      { label: "Parte 2", path: "discografia/cds-antigos/cd1-parte-02.mp3" },
      { label: "Parte 3", path: "discografia/cds-antigos/cd1-parte-03.mp3" },
      { label: "Parte 4", path: "discografia/cds-antigos/cd1-parte-04.mp3" },
      { label: "Parte 5", path: "discografia/cds-antigos/cd1-parte-05.mp3" },
      { label: "Parte 6", path: "discografia/cds-antigos/cd1-parte-06.mp3" },
      { label: "Parte 7", path: "discografia/cds-antigos/cd1-parte-07.mp3" },
    ],
  },
  {
    title: "Capoeiras: Rio de Janeiro, vol. 2",
    year: 2008,
    youtubeUrl: "https://youtu.be/LFMNk_i0vIk",
    cover: "/images/discografia/cd-vol2.jpg",
    tracks: [
      { label: "Gravação completa", path: "discografia/cds-antigos/cd2.mp3" },
    ],
  },
];

const TRACK_URL_TTL = 60 * 60 * 24 * 365; // public track, links live a year

async function signTracks(): Promise<Record<string, string>> {
  try {
    const admin = createAdminClient();
    const paths = DISCOS.flatMap((d) => (d.tracks ?? []).map((t) => t.path));
    const { data } = await admin.storage
      .from(STUDENT_MEDIA_BUCKET)
      .createSignedUrls(paths, TRACK_URL_TTL);
    const out: Record<string, string> = {};
    for (const s of data ?? []) {
      if (s.signedUrl && s.path) out[s.path] = s.signedUrl;
    }
    return out;
  } catch {
    return {};
  }
}

// Curated by Mestre Braga; grouped by the videoteca's four themes
// (index into LibraryPage.liveCats). Titles are the works' own names.
const VIDEOS = [
  {
    id: "ViVlEwPQL1Q",
    cat: 0,
    title: "Reino do Congo",
    channel: "História em Meia Hora",
  },
  {
    id: "ERJNIScowr8",
    cat: 0,
    title: "Sincretismo religioso em Angola e no Reino do Congo",
    channel: "TV Raízes da Cultura",
  },
  {
    id: "UgChVkbxgBc",
    cat: 0,
    title: "Os Ilundu não são orixás — Alberto Oliveira Pinto",
    channel: "Lembra-te, Angola",
  },
  {
    id: "otgt9vz9E-o",
    cat: 1,
    title: "A incrível epopeia do descobrimento do Brasil",
    channel: "Viagens Cariocas",
  },
  {
    id: "IyUg6ebRBvs",
    cat: 2,
    title: "Influência yoruba na formação social de capoeiras",
    channel: "Live · CMC/CA",
  },
  {
    id: "vnm8xUgT6WM",
    cat: 3,
    title: "Grupo/Escola de Capoeira Angola África Bantu",
    channel: "Live · CMC/CA",
  },
];

export default async function BibliotecaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("LibraryPage");

  const books = t.raw("books") as Book[];
  const liveCats = t.raw("liveCats") as string[];
  const trackUrls = await signTracks();

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <SectionDivider label={t("perguntasTitle")} />

      {/* PERGUNTE AO MESTRE — invitation to the public Q&A */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <p className="max-w-2xl font-display text-2xl font-light italic leading-relaxed text-espresso">
          {t("perguntasIntro")}
        </p>
        <Link
          href="/perguntas"
          className="mt-6 inline-block font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
        >
          {t("perguntasCta")} →
        </Link>
      </section>

      <SectionDivider label={t("booksTitle")} />

      {/* BOOKS — public bibliography */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <p className="max-w-2xl text-base leading-relaxed text-espresso-2">
          {t("booksIntro")}
        </p>
        <ul className="mt-12 divide-y divide-terracotta/20 border-y border-terracotta/20">
          {books.map((book, i) => (
            <li
              key={`${book.title}-${book.author}`}
              className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-12 sm:items-baseline"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta sm:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-display text-2xl font-light italic text-espresso sm:col-span-7">
                {book.title}
              </p>
              <p className="text-base text-espresso-2 sm:col-span-4">
                {book.author}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <SectionDivider label={t("estanteTitle")} />

      {/* A ESTANTE DO MESTRE — the mestre's photographed bookshelf */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <p className="max-w-2xl text-base leading-relaxed text-espresso-2">
          {t("estanteIntro")}
        </p>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 17 }, (_, i) => (
            <li key={i}>
              <Image
                src={`/images/estante/estante-${String(i + 1).padStart(2, "0")}.jpg`}
                alt=""
                width={700}
                height={933}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="aspect-3/4 w-full rounded-sm border border-espresso/15 object-contain"
              />
            </li>
          ))}
        </ul>
      </section>

      <SectionDivider label={t("livesTitle")} />

      {/* VIDEO LIBRARY — curated by Mestre Braga, grouped by theme */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <p className="max-w-2xl text-base leading-relaxed text-espresso-2">
          {t("livesIntro")}
        </p>

        <div className="mt-12 flex flex-col gap-14">
          {liveCats.map((cat, i) => {
            const videos = VIDEOS.filter((v) => v.cat === i);
            if (videos.length === 0) return null;
            return (
              <div key={cat}>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                    N°&nbsp;{String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl font-light italic text-espresso">
                    {cat}
                  </h3>
                </div>
                <ul className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                  {videos.map((v) => (
                    <li key={v.id}>
                      <figure>
                        <div className="overflow-hidden rounded-sm border border-espresso/15">
                          <YouTubeEmbed
                            videoId={v.id}
                            title={v.title}
                            poster={`/images/videos/${v.id}.jpg`}
                          />
                        </div>
                        <figcaption className="mt-3">
                          <p className="font-display text-sm italic leading-snug text-espresso">
                            {v.title}
                          </p>
                          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-espresso-2">
                            {v.channel}
                          </p>
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <SectionDivider label={t("recordingsTitle")} />

      {/* DISCOGRAPHY — the mestre's records, streamed from the archive */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <p className="max-w-2xl text-base leading-relaxed text-espresso-2">
          {t("recordingsIntro")}
        </p>
        <ul className="mt-12 flex max-w-3xl flex-col gap-12">
          {DISCOS.map((disco, i) => (
            <li key={disco.title} className="flex gap-6">
              {disco.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={disco.cover}
                  alt=""
                  className="h-24 w-24 shrink-0 rounded-sm border border-espresso/15 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-sm border border-espresso/15 bg-cream-2/40">
                  {/* placeholder until the album art exists */}
                  <Image
                    src="/cmcca-logo.png"
                    alt=""
                    width={48}
                    height={48}
                    style={{ width: 48, height: 48 }}
                    className="opacity-70"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-terracotta">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl font-light italic text-espresso">
                  {disco.title}
                </h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-espresso-2">
                  {disco.year ?? disco.yearLabel}
                </span>
                {disco.inProduction && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta">
                    ● {t("discInProduction")}
                  </span>
                )}
              </div>
              {disco.tracks && (
                <ul className="mt-5 flex flex-col gap-4 pl-10">
                  {disco.tracks.map(
                    (track) =>
                      trackUrls[track.path] && (
                        <li key={track.path}>
                          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-espresso-2">
                            {track.label}
                          </p>
                          <audio
                            controls
                            preload="none"
                            src={trackUrls[track.path]}
                            className="w-full max-w-xl"
                          />
                        </li>
                      )
                  )}
                </ul>
              )}
              {disco.youtubeUrl && (
                <p className="mt-4 pl-10">
                  <a
                    href={disco.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
                  >
                    {t("discListenYt")} ↗
                  </a>
                </p>
              )}
              {disco.bandcampUrl && (
                <p className="mt-4 flex flex-wrap gap-8 pl-10">
                  <a
                    href={disco.bandcampUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
                  >
                    {t("discListen")} ↗
                  </a>
                  <Link
                    href="/cantorias"
                    className="font-mono text-[12px] uppercase tracking-[0.18em] text-terracotta transition hover:text-terracotta-2"
                  >
                    {t("cadernoLink")} →
                  </Link>
                </p>
              )}
              {disco.encarte && (
                <div className="mt-6 max-w-2xl pl-10">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-espresso-2">
                    No encarte
                  </p>
                  <div className="mt-4 flex flex-col gap-6">
                    {disco.encarte.map((sec) => (
                      <div key={sec.titulo}>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-terracotta">
                          {sec.titulo}
                        </p>
                        <ul className="mt-2 grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
                          {sec.itens.map((item) => (
                            <li
                              key={item.nome}
                              className="flex items-baseline gap-2"
                            >
                              <span className="font-display text-sm font-light italic text-espresso">
                                {item.nome}
                              </span>
                              {item.credito && (
                                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-espresso-2">
                                  {item.credito}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                        {sec.nota && (
                          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-espresso-2">
                            {sec.nota}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </li>
          ))}
        </ul>
      </section>

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
                <figcaption className="mt-3">
                  <p className="font-display text-sm italic leading-snug text-espresso">
                    {v.title}
                  </p>
                  {"note" in v && v.note && (
                    <p className="mt-2 text-xs leading-relaxed text-espresso-2">
                      {v.note}
                    </p>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="mt-24 max-w-3xl border-t border-espresso/15 pt-12">
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

        </div>
      </section>

      <Footer />
    </div>
  );
}
