// Rádio-RJ de capoeiras em Capoeira Angola: gravações antigas do arquivo
// do mestre, do Rio de Janeiro, publicadas com uma imagem de capa. Os
// arquivos vivem no bucket em acervo/radio/ e são públicos (links de um
// ano, como os vídeos do acervo). Os títulos são as palavras do mestre
// na capa de cada gravação; as descrições vivem em
// LibraryPage.radioEpisodes, pelo slug.

export type Episodio = {
  slug: string;
  file: string;
  title: string;
  year?: number;
  poster: string;
  // versão com o som tratado (declip, redução de ruído, nivelamento),
  // publicada ao lado do original, nunca no lugar dele
  remaster?: string;
};

export const RADIO: Episodio[] = [
  {
    slug: "moraes-1981",
    file: "radio-rj-01.mp4",
    title:
      "Mestre Moraes no Rio em 1981, para a turma CAMM (de elevados a mestres), antes de seu regresso definitivo",
    year: 1981,
    poster: "/images/radio/radio-rj-01.jpg",
    remaster: "radio-rj-01-remaster.mp4",
  },
];
