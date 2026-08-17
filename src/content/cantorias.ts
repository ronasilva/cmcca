// Caderno de cantorias do CD de 2024 — transcrito do caderno do projeto.
// Letras verbatim (só ortografia corrigida); a gravação traz pequenas
// variações. Estrutura: conjuntos por toque de berimbau, cada um com a
// sua ladainha e as cantorias combinadas (chulas/corridos).

export type Tema = {
  title: string;
  credit?: string;
  kind: "ladainha" | "chula" | "corrido";
  verso?: string;
  refrao?: string;
  resposta?: string;
  calls?: string[];
};

export type Conjunto = {
  toque: string;
  saida?: string;
  heading?: string;
  temas: Tema[];
};

export const LOUVACOES: { call: string; response: string }[] = [
  { call: "E viva meu Deus", response: "E viva meu Deus, camará" },
  { call: "E vamos embora", response: "E vamos embora, camará" },
  { call: "E dá volta ao mundo", response: "E dá volta ao mundo, camará" },
  { call: "E que mundo deu!", response: "E que mundo deu" },
  { call: "E que mundo dá", response: "E que mundo dá" },
];

export const CONJUNTOS: Conjunto[] = [
  {
    toque: "São Bento Pequeno no berimbau · andamento moderado",
    saida: "Chulas combinadas: base de saída role e jogo voltado pro mesmo",
    temas: [
      {
        title: "Das memórias africanas",
        credit: "m/Braga",
        kind: "ladainha",
        verso:
          "Iê!!!\nDas memórias africanas\nque atravessaram o Atlântico\npro continente sul-americano,\nna destinação para o Brasil.\nPredicados de capoeiras\nentre séculos XVI e XIX.\nAlguns com conhecimentos\npara resistir na liberdade.\nDisso se pode saber!!!\nDisso mais pode aprender!!!\nSabendo de Capoeira Angola, camará",
      },
      {
        title: "Navio veleiro",
        credit: "m/Braga",
        kind: "chula",
        refrao:
          "De navio veleiro! Balanço do mar! De Angola foi pra América muita gente pro Brasil",
        resposta: "De navio veleiro, balanço do mar!",
        calls: ["De Angola foi pra América muita gente pro Brasil"],
      },
      {
        title: "Quem vai querer",
        credit: "m/Braga",
        kind: "chula",
        refrao:
          "Quem é que vai querer, quem é que vai comprar, do barco veleiro ancorado no mar",
        resposta: "Quem vai querer, quem vai comprar",
        calls: [
          "Do barco veleiro ancorado no mar",
          "Das especiarias do barco no mar",
          "Ele vem de Europa, da Ásia e da África",
        ],
      },
      {
        title: "Para o velho continente",
        credit: "m/Braga",
        kind: "chula",
        refrao:
          "Olha a cana de açúcar, café, também algodão, o sinhô mandou vender lá pro velho continente",
        resposta: "Olha a cana de açúcar, café, também algodão",
        calls: ["O sinhô mandou vender lá pro velho continente"],
      },
      {
        title: "Vai dizer a meu sinhô",
        credit: "domínio popular",
        kind: "chula",
        refrao:
          "Vai dizer a meu sinhô que a manteiga derramou; a manteiga não é minha, derreteu, foi o calor",
        resposta: "Vai dizer a meu sinhô que a manteiga derramou",
        calls: ["A manteiga que não é minha, derreteu, foi o calor"],
      },
      {
        title: "Quando os holandeses",
        credit: "m/Braga",
        kind: "chula",
        refrao:
          "Quando os holandeses invadiram o Brasil, invadiram Salvador, invadiram Pernambuco",
        resposta: "Quando os holandeses invadiram o Brasil",
        calls: [
          "Saíram de Salvador expulsos dos lusitanos",
          "Capitularam em Pernambuco, expulsos dos lusitanos",
          "Da guerra de Pernambuco! Que nego preto se mandou",
        ],
      },
    ],
  },
  {
    heading: "Certa agenda pela liberdade",
    toque: "São Bento Pequeno no berimbau · andamento moderado",
    saida:
      "Chulas combinadas: saída voltada pro rolê, jogo mais em pé (que passa pelo chão mas não fica)",
    temas: [
      {
        title: "13 de Maio",
        credit: "m/Braga",
        kind: "ladainha",
        verso:
          "São Bento Pequeno, iê…\nBravo engajamento popular,\nsalve a Princesa Isabel,\nassinou para abolir\nnessa oportunidade\nda luta abolicionista,\npra ter fim escravidão.\nApesar dessa vitória\ndo dia 13 de Maio,\na luta não viu o fim\ndo mau costume de escravizar!!!\nQuerer outro na coleira!!!\nMas a coragem da Princesa,\nda Princesa carioca,\nredentora brasileira…\nfoi de uma grande conquista\nde contra toda essa infâmia, camará!!!",
      },
      {
        title: "Abolição",
        credit: "domínio popular da Bahia",
        kind: "chula",
        refrao: "O vou me embora! Vou viver em outro lugar!",
        resposta: "O vou me embora! Vou me embora",
        calls: [
          "Pra onde dinheiro corre",
          "Pela lei da abolição",
          "Vou viver noutro lugar",
          "Daqui quero esquecer",
          "Daqui não quero lembrar",
        ],
      },
    ],
  },
  {
    toque: "Regional de Traíra no berimbau · andamento mais acelerado",
    saida: "Corridos combinados: saída voltada pro rolê, jogo mais em pé",
    temas: [
      {
        title: "Rio de Janeiro",
        credit: "m/Braga",
        kind: "ladainha",
        verso:
          "Iê!!! Regional de Traíra…\nNagoas e Guaiamus\neram maltas importantes\ndo Rio de Janeiro\nquando Estado imperial!\nQuando era aos 12 anos\no ingresso para as maltas,\npor uma iniciação\nque prestava juramento\nlá nas torres das igrejas,\nmuitos capoeiras sineiros;\npor certas pancadas de sino,\nem diferentes horas do dia,\ncomeço da boca da noite,\ndavam o sinal do desafio.\nNa frente de cada malta\nvinham os caxinguelês,\nsempre atrás de confusão,\ntocando da provocação,\ngritando fecha, fecha, no encontro\niminente com a freguesia inimiga.\nRasteira, cabeçada, tapas e rabo de arraia,\nsardinha pro alto da sinagoga, camará!\nViva meu Deus",
      },
      {
        title: "Não gosto de abraços",
        credit: "m/Braga",
        kind: "corrido",
        refrao: "É que eu não gosto, não, nem de abraço e aperto de mão",
        resposta: "É que eu não gosto de abraço",
        calls: [
          "Nem de aperto de mão",
          "Capoeira que é bom!",
          "Fácil não se deixam apanhar",
          "Conversa é à meia distância",
          "Nem de abraços e aperto de mão",
        ],
      },
      {
        title: "Império e República",
        credit: "m/Braga",
        kind: "corrido",
        refrao: "Entre Império e República no RJ",
        resposta: "Entre Império e República no RJ",
        calls: [
          "Tinha malta dos Nagoas",
          "Também de Guaiamus",
          "Nagoas conservadores",
          "Liberais os Guaiamus",
        ],
      },
      {
        title: "Avisa lá!",
        credit: "m/Braga",
        kind: "corrido",
        refrao:
          "O vá dizer, avisa lá, que aí vem cavalaria da princesa Teodora, pau vai quebrar pra valer",
        resposta: "Vá dizer, avisa lá",
        calls: [
          "Que aí vem cavalaria",
          "Da princesa Teodora",
          "Capoeiras e vadios",
          "Agora tá proibido",
          "É por lei da capital",
          "Pau vai quebrar pra valer",
        ],
      },
      {
        title: "Quem não pode com besouro",
        credit: "domínio popular",
        kind: "corrido",
        refrao: "Quem não pode com besouro não assanha mangangá",
        resposta: "Quem não pode com besouro",
        calls: [
          "Não assanha mangangá",
          "Pulava cerca de vara",
          "Sumia na multidão",
        ],
      },
      {
        title: "Vassoura",
        credit: "m/Braga",
        kind: "corrido",
        refrao: "Vassoura varre chão, rasteira varre pé",
        resposta: "Vassoura varre chão!",
        calls: ["Rasteira quem tá em pé!"],
      },
      {
        title: "Besouro preto",
        credit: "domínio popular",
        kind: "corrido",
        refrao: "Besouro preto! E besouro preto malvado!",
        resposta: "Besouro preto! Besouro preto malvado",
        calls: [
          "Besouro preto malvado! Besouro preto malvado!",
          "Besouro preto malvado! Besouro preto danado!",
        ],
      },
      {
        title: "Rabo de arraia",
        credit: "m/Braga",
        kind: "corrido",
        refrao: "Raia é peixe, raia é peixe, vive no fundo do mar",
        resposta: "Raia é peixe, raia é peixe",
        calls: ["Rabo de arraia é perigoso"],
      },
      {
        title: "Camarão",
        credit: "domínio popular",
        kind: "corrido",
        refrao: "Camarada camaradinho, camarão que dorme onda leva",
        resposta: "Camarada camaradinho",
        calls: ["Camarão que dorme onda leva"],
      },
    ],
  },
  {
    toque: "São Bento Pequeno no berimbau · andamento moderado",
    saida: "Corridos combinados: saída voltada pro rolê, jogo mais em pé",
    temas: [
      {
        title: "Uma águia quando nasce",
        credit: "m/Braga",
        kind: "ladainha",
        verso:
          "Iê!!!\nUma águia quando nasce\npode crescer\npensando que é galinha,\nse tirada de seu berço\ne criada por ciscantes.\nDessa malvada ciência\nhumanidade faz com outra\npor obras de um esperto\npra se chamado de senhor,\nquer de leão fazendo miau e\náguia esquecida que sabe voar.\nIngenuidade é perigosa,\nfácil fazem acreditar\nno avesso da verdade e\ndisso há muito ainda, aí\nentre ricos, pai e mãe, políticos e religiosos.\nDisse: ainda há muito, ainda bem, aí camará!!!",
      },
      {
        title: "Urubu peneirou",
        credit: "domínio popular",
        kind: "corrido",
        refrao: "Urubu peneirou foi na galha do pau! Urubu peneirou…",
        resposta: "Na galha do pau!",
        calls: ["Urubu peneirou…"],
      },
    ],
  },
  {
    toque: "São Bento Grande no berimbau · andamento rítmico amarrado",
    saida: "Corridos combinados: saída voltada pro rolê, jogo para meia altura",
    temas: [
      {
        title: "Capoeiras e confissão, coisas à parte",
        credit: "m/Braga",
        kind: "ladainha",
        verso:
          "Iê!!!\nEstava assim parado,\nsem pensar, sem imaginar,\nquando veio até a mim!!!\npuxando dessa conversa:\nse para ser angoleiro\ntem que ser do candomblé!\nEu então o convidei\na tirar das conclusões.\nCapoeira vem de bantus,\nbate de tapa e rasteira,\ncaveira e rabo de arraia,\nàs vezes deixa pra quem!!!\nlá no alto da sinagoga…\nde uma sardinha também.\nAngola! não é Benin…\nPovo bantu apela pra N'Zambi!\no supremo criador!!!\nMau e… bem são dualidades…\nque se manifesta em todas coisas…\nToda natureza é N'Zambi,\ncamará!!!",
      },
      {
        title: "Sou angoleiro",
        kind: "corrido",
        refrao:
          "Sou angoleiro que vem de Angola! Vendo pandeiro, berimbau e viola",
        resposta: "Sou angoleiro que vem de Angola",
        calls: ["Vendo pandeiro, berimbau e viola"],
      },
      {
        title: "Quem não pode com mandingo",
        kind: "corrido",
        refrao: "Quem não pode com mandingo não carrega patuá!",
        resposta: "Quem não pode com mandingo!",
        calls: ["Patuá carregue não!", "Que não traga patuá!"],
      },
      {
        title: "Caminho fácil é emboscada",
        kind: "corrido",
        refrao: "Eeee, caminho fácil é emboscada",
        resposta: "Eeee!!!",
        calls: [
          "É sabotado e tem cheiro doce!",
          "Caminho fácil é emboscada",
        ],
      },
    ],
  },
  {
    toque: "São Bento Pequeno no berimbau · andamento moderado",
    saida: "Corridos combinados: saída voltada pro rolê, jogo mais em pé",
    temas: [
      {
        title: "Na distinção",
        credit: "m/Braga",
        kind: "ladainha",
        verso:
          "Iê!!!\nPor de razões de sentimento,\npor distinção cultural,\nnão sou atleta nem desportista,\nnem lutador, nem bailarino.\nDos capoeiras aprendi!\nusar da sabedoria para na rua resistir\nno confronto com hostis,\nnão deixando me pegar,\nbatendo de mão, de pé e de cabeça,\npra quem muito perto chegar,\ne fazendo pra distinção.\nNão dobro esquina de peito aberto,\ntome dois, três passos à direita, ou se não para a esquerda, para observar de inimigo.\nNão entre em bar se muito cheio,\npois não é bom muitos abraços e\nnem muitas aproximações.\nSou do RJ, não nego meu natural,\npor maneira de saudar digo yê!!! aos outros camaradas, camará",
      },
      {
        title: "Turma E! Turma A!",
        kind: "corrido",
        refrao: "Turma E! Turma A! Chegou a turma de Angola",
        resposta: "Turma E! Turma A!",
        calls: [
          "Chegou a turma de Angola",
          "A turma da ladeira",
          "Turma de mestre Pastinha",
          "A malta da malandragem",
        ],
      },
      {
        title: "No largo, na ladeira",
        kind: "corrido",
        refrao: "No largo, na ladeira, tem arroz, tem camarão",
        resposta: "No largo, na ladeira",
        calls: ["Tem arroz, tem camarão", "Tem tempero de limão"],
      },
      {
        title: "Lá no mangue",
        kind: "corrido",
        refrao: "Lá no mangue, lá no mangue, abre olho, siri de mangue",
        resposta: "Lá no mangue, lá no mangue",
        calls: [
          "Quando é maré de março",
          "É maré de guaiamu",
          "Abre olho, siri de mangue",
        ],
      },
    ],
  },
  {
    toque: "Regional de Traíra no berimbau · andamento rítmico amarrado",
    saida:
      "Chulas combinadas: saída pelo rolê e evoluções de jogo mais de volta à meia altura",
    temas: [
      {
        title: "Riachão",
        credit: "domínio popular",
        kind: "ladainha",
        verso:
          "Iê!!!\nFoi na cidade do Assú, o na cidade do Assú,\ncontou o povo de lá, ainda que meio assombrado, que um nego\ndesconhecido da espécie do urubu, que tinha cara de cão, falou assim\npro Riachão:\nnasci bem antes da luz, na prosa ninguém me leva, conheci este planeta\nmergulhado em densas trevas, vi quando fizeram Adão, fui grande\namigo de Eva.\nRiachão lhe respondeu: não sei de que mundo tu caiu, porque veio até a\nmim e quer me desafiar, mas afine sua viola, vamos dar início a esse\nduelo,\npois só de minha aceitação veja como senhor está amarelo.\nCantaram até meia-noite, depois do fato acontecido nunca mais\nninguém cantou, e Riachão se mudou, foi viver de outro ramo, cantoria\nele deixou, camará\nViva meu Deus!",
      },
      {
        title: "Rio Paraná",
        credit: "domínio popular da Bahia",
        kind: "chula",
        refrao:
          "Vá contar a minha mulher, Paraná, capoeira que venceu, Paraná",
        resposta: "Paranaê ê, Paranaê, Paraná!",
        calls: [
          "Ela jurou, bateu pé firme, disse que não ia acontecer, Paraná!",
          "Ave Maria, meu Deus, Paraná! Se eu chegar me assanhar, Paraná",
          "Faço quem não quer querer, Paraná, quem não tem pé caminhar, Paraná",
          "Pelo rio Paraná vou descendo a navegar, Paraná",
          "Nossa Sinhora me leva pra terra onde nasci, Paraná!",
          "Minha terra é o Brasil! Ela lá e eu aqui, Paraná",
          "Minha mãe chama Maria, moradeira de Najé, Paraná",
          "No meio de tanta Maria nem sei quem minha mãe é, Paraná",
          "Na festa de Conceição também quero navegar, Paraná",
          "É que eu sou marinheiro e gosto de navegar, Paraná",
          "Iê Paranaê, iê Paranaê, Paraná",
          "Sou do RJ, não nego o meu natural, Paraná",
        ],
      },
      {
        title: "Santa Maria",
        credit: "domínio popular da Bahia",
        kind: "chula",
        refrao:
          "Santa Maria, mãe de Deus, eu cheguei na igreja e me confessei",
        resposta: "Santa Maria, mãe de Deus",
        calls: ["Eu cheguei na igreja e me confessei"],
      },
    ],
  },
  {
    heading: "No popular da rua: dinheiro. Fotos e outros para shows, improvisos… mercado",
    toque: "Regional de Traíra no berimbau",
    saida: "Chulas combinadas: saída e jogo voltado pro rolê",
    temas: [
      {
        title: "História de Pedro Cem",
        credit: "domínio popular",
        kind: "ladainha",
        verso:
          "Iê!!!\nHistória de Pedro Cem!!!\ncomerciante muito rico,\nmas um tipo muito arrogante,\nque um dia foi castigado,\nse tornando Pedro Sem!\nSem com \"s\", não mais com \"c\".\nNessa hora, aqui, agora,\nde sua contribuição jogando algum dinheiro nessa roda,\nque é pra gente ir lá buscar:\nnão vale pegar com a mão,\nsó com bico que apanha, camará\nViva meu Deus",
      },
      {
        title: "Panha laranja",
        credit: "domínio popular",
        kind: "chula",
        refrao:
          "Panha laranja no chão, tico-tico, se meu amor for embora não fico",
        resposta: "Panha laranja no chão, tico-tico",
        calls: [
          "Se meu amor for embora não fico",
          "Minha toalha é de renda, é de bilro",
          "Minha camisa é de seda, é de linho",
        ],
      },
      {
        title: "Me dá meu dinheiro",
        credit: "domínio popular",
        kind: "chula",
        refrao:
          "Me dá meu dinheiro!!! Me dá meu dinheiro, valentão; o me dá meu dinheiro, valentão, que te dou-lhe uma rasteira, te ponho no chão",
        resposta: "Me dá meu dinheiro!!! O me dá meu dinheiro, valentão",
        calls: [
          "O me dá meu dinheiro, valentão, que te dou-lhe uma rasteira! Te mando é pro chão",
        ],
      },
      {
        title: "O A O A E",
        credit: "domínio popular",
        kind: "chula",
        refrao: "O a o a e, vou bater pra ver cair",
        resposta: "O a o a e",
        calls: ["Vou bater pra ver cair"],
      },
      {
        title: "Jereba",
        credit: "domínio popular",
        kind: "chula",
        refrao: "O quebra jereba",
        resposta: "Quebra!!!",
        calls: ["Quebra tudo hoje", "Amanhã quê que quebra"],
      },
      {
        title: "Não quero barulho",
        credit: "domínio popular",
        kind: "chula",
        refrao:
          "Por favor, meu mano, eu não quero barulho aqui não; eu não quero barulho aqui não, pois barulho aqui vai te dar confusão",
        resposta: "Por favor, meu mano, eu não quero barulho aqui não",
        calls: [
          "Eu não quero barulho aqui não, aqui é pra ti dar confusão",
          "Eu não quero barulho aqui não, barulho aqui é confusão",
        ],
      },
      {
        title: "Depois das 21",
        credit: "m/Braga",
        kind: "chula",
        refrao:
          "Vamo nessa, vamo agora, que depois das 21:00, que depois das 21:00 há polícia pela rua",
        resposta: "Vamo nessa, vamo agora, que depois das 21:00",
        calls: [
          "Que depois das 21:00 é perigo e vida dura",
          "Capoeira é proibida pela lei da capital",
        ],
      },
    ],
  },
];

// Ladainha usada no filme "Pastinha, uma vida pela capoeira", com a nota
// de esclarecimento do Mestre sobre a autoria.
export const NOTA_PASTINHA = {
  verso:
    "Yê!!! Pastinha morreu ontem, teve gente que chorou.\nNa roda da capoeira ele era professor, um mestre classificado (frase adaptada de Braga).\nJogava capoeira! Capoeira de Angola, Capoeira de Angola,\nque mestre Benedito, um africano na Bahia, lhe ensinou, camará",
  nota:
    "Nota de esclarecimento: devido a uma questão que se espalhou no popular, de que essa ladainha é do m/Braga, quero dizer que não. Essa ladainha é de autoria de m/Lumumba, aproveitada para o contexto das imagens do filme Pastinha, uma vida pela capoeira. Na frase grifada e nota entre parênteses, ali sim sou eu. Lembrando que os resultados deste documentário se construíram em equipe. m/Braga",
};
