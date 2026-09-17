// Textos que o mestre manda para a Esfera Intelectual, publicados na sua
// voz, com correção só de ortografia e gramática. Um parágrafo pode trazer
// um trecho grifado: { antes, grifo, depois }. Um marcador [[n]] no texto
// chama a nota n do texto (LibraryPage.notas.<slug>), impressa abaixo.

export type Paragrafo =
  | string
  | { antes: string; grifo: string; depois: string };

export type Texto = {
  slug: string;
  eyebrow: string;
  titulo: string;
  paragrafos: Paragrafo[];
  // imagem de uma nota, pela sua numeração (a mesma nos três idiomas)
  notaImagens?: Record<number, { src: string; alt: string }>;
};

export const TEXTOS: Texto[] = [
  {
    slug: "ocidentalizacao",
    eyebrow: "Breve resumo",
    titulo: "A ocidentalização do conhecimento dos capoeiras",
    notaImagens: {
      1: {
        src: "/images/livros/burlamaqui-1928.jpg",
        alt: "Capa da 1ª edição de Gymnastica Nacional (Capoeiragem), 1928",
      },
    },
    paragrafos: [
      "O nome Capoeira Angola já vinha desde o Recôncavo baiano (referência de 1860). No mestre Pastinha, em 1941, consagrou-se como tradição de angoleiros.",
      "Quanto ao mestre Bimba, nos anos 30, que também era dos que frequentavam a Gengibirra: nesse tempo havia certo conflito entre a capital, o Rio de Janeiro à época, e o estado da Bahia, que resistia, pelos capoeiras de lá, em não querer abandonar a ideia do uso dos três berimbaus, não previsto nas regras da Ginástica Nacional desenvolvida por Aníbal Burlamaqui[[1]].",
      "Foi apresentando o arranjamento de Luta Regional, no âmbito do esporte e da cultura, com essa ideia do mestre Bimba de trazer apenas um berimbau, justificado só para uso pessoal dele, para aquecimento antes de subir ao ringue e por ocasião de demonstrações de palco ou para celebridades, que se viu uma saída para não ver esse instrumento musical de todo fora.",
      "Assim também se coloca o capoeira mestre Bimba como mais um colaborador, que desse jeito teve a aprovação dos setores do esporte nessa regulamentação.",
      {
        antes:
          "Se hoje temos o berimbau, é graças ao capoeira mestre Bimba. Foi quem abriu caminho para, mais tarde, a aceitação do CECA (como Centro ",
        grifo: "Esportivo",
        depois: " de Capoeira Angola).",
      },
      "Ginástica Nacional era o nome pelo Rio de Janeiro, para ser o mesmo nos demais estados. Daí, para justificar como uma criação de luta da região da Bahia, teve-se a identificação de Luta Regional: uma luta criada na Bahia, que servia para fins desportivos e de defesa pessoal, no mesmo âmbito da Ginástica Nacional. De certa maneira, por ser região de dentro do país, estava no âmbito nacional.",
      "Isso é a visão política, que foi bem diferente do que se distorce para a politicagem.",
    ],
  },
];
