// O ensino, na área do membro: os dois caminhos do mestre e as suas
// etapas. Os rótulos vêm de MemberArea.track1Etapas / track2Etapas, pela
// mesma ordem; uma etapa com `videos` ganha página própria em
// /membros/ensino/<slug>. Os vídeos ficam no bucket, em ensino/<slug>/,
// e só se assinam (1 h) dentro da área do membro.

export type EnsinoVideo = {
  file: string;
  title: string;
  portrait?: boolean;
  // true: leva a nota de direitos sobre a gravação de Mestre Traíra
  trairaNote?: boolean;
  poster?: string;
};

export type Etapa = {
  slug: string;
  videos?: EnsinoVideo[];
  // texto do mestre relacionado, na Esfera Intelectual
  textoLink?: string;
};

export type Track = { key: "track1" | "track2"; etapas: Etapa[] };

export const TRACKS: Track[] = [
  {
    key: "track1",
    etapas: [{ slug: "corpo-1" }, { slug: "corpo-2" }, { slug: "corpo-3" }],
  },
  {
    key: "track2",
    etapas: [
      { slug: "cantorias" },
      {
        slug: "berimbaus",
        // ordem de estudo: os toques explicados, os toques tocados, a mão
        // no dobrão com a gravação do Traíra, e por fim a bateria inteira
        videos: [
          {
            file: "os-toques-do-berimbau.mp4",
            title: "Os toques do berimbau: de Cavalaria aos contrapontos",
            portrait: true,
          },
          {
            file: "sao-bento-e-banguela.mp4",
            title: "Os toques, um a um: Angola, São Bento, São Bento Pequeno, São Bento Grande, Regional (m/Traíra), Angola Pequena (m/Traíra) e Banguela (m/Bimba)",
            portrait: true,
          },
          {
            file: "ensino-de-segundo-percurso.mp4",
            title: "Ensino de segundo percurso",
            trairaNote: true,
            poster: "/images/videos/BuwgeQMeYm0.jpg",
          },
          {
            file: "tonalidade-dos-gungas.mp4",
            title: "Tonalidade dos Gungas",
            poster: "/images/videos/JDYZQOa-USU.jpg",
          },
        ],
        textoLink: "/biblioteca#arranjamento",
      },
      { slug: "roda" },
      { slug: "obediencias" },
    ],
  },
];

export function findEtapa(slug: string) {
  for (const track of TRACKS) {
    const i = track.etapas.findIndex((e) => e.slug === slug);
    if (i >= 0) return { track, etapa: track.etapas[i], index: i };
  }
  return null;
}

export function etapaHasContent(etapa: Etapa): boolean {
  return (etapa.videos?.length ?? 0) > 0;
}

// Rótulo de exibição: enquanto nem todas as etapas estão publicadas, a
// numeração ("Etapa 2: berimbaus") só confunde; mostra-se o nome apenas.
export function etapaDisplayName(label: string): string {
  const name = label.replace(/^(Etapa|Stage|Étape)\s*\d+\s*:\s*/i, "");
  return name.charAt(0).toUpperCase() + name.slice(1);
}
