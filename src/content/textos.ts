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
  // vídeos do acervo que acompanham o texto (self-hosted; ids do canal)
  videos?: { id: string; title: string; note?: boolean }[];
  subtitulo?: string;
  paragrafos: Paragrafo[];
  // lista numerada e contrapontos, como no texto dos berimbaus
  lista?: string[];
  contrapontosIntro?: string;
  contrapontos?: string[];
  fecho?: string;
  // imagem de uma nota, pela sua numeração (a mesma nos três idiomas)
  notaImagens?: Record<number, { src: string; alt: string }>;
};

export const TEXTOS: Texto[] = [
  {
    slug: "ocidentalizacao",
    eyebrow: "Breve resumo",
    titulo: "A ocidentalização do conhecimento de capoeiras",
    notaImagens: {
      1: {
        src: "/images/livros/burlamaqui-1928.jpg",
        alt: "Capa da 1ª edição de Gymnastica Nacional (Capoeiragem), 1928",
      },
    },
    paragrafos: [
      "O nome Capoeira Angola já vinha desde o Recôncavo baiano (referência de 1860). No mestre Pastinha, em 1941, é que se consagra como tradição de angoleiros.",
      "Quanto ao mestre Bimba (décadas de 20 e 30), que também era dos que frequentavam a Gengibirra: nesse tempo havia certo conflito entre a capital, o Rio de Janeiro à época, e o estado da Bahia, que resistia, pelos capoeiras de lá, em não querer abandonar a ideia do uso dos três berimbaus, não previsto nas regras da Ginástica Nacional do autor Aníbal Burlamaqui (1928)[[1]], que de alguns aspectos do conhecimento de capoeiras reaproveitara para desenvolver o esporte-cultura.",
      "Coisa que nos parece ter se influenciado ou inspirado da França para o governo brasileiro, pois o mesmo ocorria com o savate (ou boxe francês)[[2]]: reaproveitar essa modalidade de luta (1790), meio marginal nos portos do sul da França, para transformá-la em uma ginástica nacional disciplinada (no final do século XIX).",
      "Foi apresentando o arranjamento de Luta Regional, no âmbito do desporto (esporte-cultura), com a colaboração do mestre Bimba, trazendo apenas um berimbau, justificado só para uso pessoal dele, para aquecimentos antes de subir ao ringue e por ocasião de demonstrações de palco e celebridades, que se viu conseguir uma saída para não ver esse instrumento musical abandonado de todo.",
      "Conhecendo da aprovação das autoridades governamentais da época, o capoeira mestre Bimba torna-se mais um contribuidor para os ideais de engenharia social, para uma nova compreensão de brasilidade.",
      {
        antes:
          "Se hoje temos o berimbau, é graças ao capoeira mestre Bimba. Foi quem abriu caminho para, mais à frente, poder haver a aceitação do CECA (Centro ",
        grifo: "Esportivo",
        depois:
          " de Capoeira Angola, na linha mais tradicional conservadora), dirigido pelo capoeira m/Pastinha.",
      },
      "Ginástica Nacional era o nome pelo Rio de Janeiro, para ser o mesmo nos demais estados. Daí, para justificar como uma criação de luta da região da Bahia, teve-se a identificação de Luta Regional: uma luta criada na Bahia, que servia para fins desportivos e de defesa pessoal, no mesmo âmbito da Ginástica Nacional. De certa maneira, por ser região de dentro do país, estava no âmbito nacional.",
    ],
  },
  {
    slug: "arranjamento",
    eyebrow: "Berimbaus",
    titulo: "Arranjamento musical na Capoeira de Angola em continuação",
    videos: [
      { id: "hKoXnwy8pG8", title: "Live reajustada: como aprendi do berimbau" },
      { id: "BuwgeQMeYm0", title: "Ensino de segundo percurso", note: true },
      { id: "JDYZQOa-USU", title: "Terceira etapa: arco musical em mim" },
    ],
    subtitulo: "Berimbaus, breve histórico em texto",
    paragrafos: [
      "Capoeiras com berimbau é uma combinação baiana, de lá por 1860[[1]], quando no centro de Salvador bem servia para \"tomar\" dinheiro, principalmente de turistas.",
      "Só que, quando quiseram diferenciar os nomes dos toques para justificar os andamentos moderados, amarrados e acelerados, aí \"deu bode\": acabou como no ditado popular, \"quem conta um conto aumenta um ponto\".",
      "Quando cheguei no Moraes[[2]], já dominava bem os toques do berimbau, e, quanto ao São Bento, três eram: desde a rua até o tempo no Moraes, nunca mudei disso.",
    ],
    lista: [
      "São Bento (em aceleração)",
      "São Bento Pequeno (em moderado, por tom inverso ao de Angola)",
      "São Bento Grande (de maiores acelerações)",
      "Regional (de pegada do m/Traíra[[3]], que amarra)",
      "Angola (principal toque moderado)",
    ],
    contrapontosIntro: "Para contrapontuar, destaco dois:",
    contrapontos: [
      "Angola Pequena (da pegada de m/Traíra; muito mais é conhecido por \"jogo de dentro\")",
      "Banguela (m/Bimba)",
    ],
    fecho:
      "Assim é por mim, Braga: com as cantorias, motivar os desenvolvimentos.\n\nJá são três CDs[[4]] com venda esgotada, embora essa não seja a minha preocupação maior: arco musical e cantorias não estão para ser os protagonistas, apenas dão um certo requinte.\n\nmestre/Braga",
  },
];
