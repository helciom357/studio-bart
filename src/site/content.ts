// Conteúdo editorial do site. Itens marcados com `placeholder: true` são
// fictícios e devem ser substituídos pelo conteúdo real do estúdio.

export type Professional = {
  slug: string;
  name: string;
  role: string;
  facts: string[];
  photos: string[];
  bio: string[];
  highlights?: { title: string; text: string }[];
};

export const TATTOO_ARTIST: Professional = {
  slug: "vinny",
  name: "Vinny Darian",
  role: "Tatuador",
  facts: ["+20 anos de profissão", "+520 clientes", "3 países"],
  photos: ["/images/team/vinny-1.webp", "/images/team/vinny-2.webp", "/images/team/vinny-3.webp"],
  bio: [
    "Vinny Darian é o artista à frente do Estúdio Bartô Tattoo. Com anos de experiência no Brasil e no exterior — incluindo passagens por estúdios da Suíça e Los Angeles — ele desenvolveu um estilo técnico, preciso e altamente detalhado, com foco em Black & Gray.",
    "Especialista em fechamentos e projetos grandes em sessão única (8 a 10 horas), Vinny acumula premiações em convenções de tatuagem que reforçam seu domínio técnico e a qualidade do seu trabalho. Além do Black & Gray, também atua em estilos como Blackwork, Fine Line e Neo Traditional, sempre criando projetos personalizados para cada cliente.",
  ],
  highlights: [
    {
      title: "Passagem por estúdios em Los Angeles",
      text: "Capital mundial do realismo e Black & Gray",
    },
    {
      title: "Experiência em estúdios na Suíça",
      text: "Mercado europeu com padrão técnico elevadíssimo",
    },
    {
      title: "Premiações em convenções de tatuagem",
      text: "Reconhecimento técnico fora do Instagram",
    },
    {
      title: "Especialista em sessões de 8–10 horas",
      text: "Projetos grandes com resultado coeso em uma única sessão",
    },
  ],
};

export const BARBERS: Professional[] = [
  {
    slug: "nicolas",
    name: "Nicolas Allyson",
    role: "Barbeiro",
    facts: ["26 anos", "8 anos de profissão"],
    photos: ["/images/team/nicolas-1.webp", "/images/team/nicolas-2.webp"],
    bio: [
      "Minha história na barbearia começou no meu próprio bairro, onde passei a observar as barbearias não apenas como um serviço, mas também como uma oportunidade de construir meu próprio caminho e conquistar minha independência financeira.",
      "Fiz o curso de barbeiro e, com o apoio da minha família, ganhei minhas primeiras máquinas. Foi então que comecei a cortar o cabelo de pessoas conhecidas, no banheiro da minha própria casa.",
      "O que começou de forma simples, dentro de casa, se transformou em uma profissão que exerço há 8 anos. Hoje, sigo construindo minha trajetória como barbeiro, levando comigo a mesma vontade de crescer que me fez começar.",
    ],
  },
  {
    slug: "raphael",
    name: "Raphael Navero",
    role: "Barbeiro",
    facts: ["24 anos", "6 anos de profissão"],
    photos: ["/images/team/raphael-1.webp", "/images/team/raphael-2.webp"],
    bio: [
      "Minha história na barbearia começou dentro da minha própria família. Venho de uma família que atua no ramo há mais de 20 anos e cresci acompanhando minha mãe e minha tia trabalhando com cortes. Foi convivendo com esse universo desde cedo que nasceu minha paixão pela profissão.",
      "No começo, meus irmãos e primos foram os primeiros a confiar em mim e serviram como parte importante do meu aprendizado. Foi praticando com eles que comecei a transformar aquilo que eu acompanhava dentro de casa em profissão.",
      "Hoje, olhando para trás, tenho orgulho de tudo que construí ao longo desses 6 anos. A barbearia me ensinou, me fez crescer profissionalmente e me proporcionou conhecer muitas pessoas especiais.",
      "E essa história está apenas começando.",
    ],
  },
];

export const TATTOO_STATS = [
  { value: "+20", label: "anos de experiência" },
  { value: "+200", label: "fechamentos realizados" },
  { value: "+520", label: "clientes atendidos" },
  { value: "+3", label: "países com experiência" },
];

export const PORTFOLIO = [
  { src: "/images/tattoo/port-00.webp", title: "Máscaras", style: "Full Color" },
  { src: "/images/tattoo/port-01.webp", title: "Onça", style: "Black & Gray" },
  { src: "/images/tattoo/esp-blackgray.webp", title: "Leão", style: "Black & Gray" },
  { src: "/images/tattoo/port-10.webp", title: "Braço fechado", style: "Fechamento" },
  { src: "/images/tattoo/esp-fullcolor.webp", title: "Magneto", style: "Full Color" },
  { src: "/images/tattoo/port-11.webp", title: "Manga completa", style: "Fechamento" },
  { src: "/images/tattoo/esp-fechamento.webp", title: "Fé", style: "Fechamento" },
  { src: "/images/tattoo/port-12.webp", title: "Costas florais", style: "Black & Gray" },
];

export const TATTOO_STYLES = [
  {
    name: "Black & Gray",
    color: "#252622",
    text: "A especialidade da casa. Transições de preto profundo para pele limpa que parecem fotografia.",
  },
  {
    name: "Realismo",
    color: "#5f725a",
    text: "Retratos, animais e cenas com volume, luz e textura fiéis à referência.",
  },
  {
    name: "Full Color",
    color: "#9a4729",
    text: "Saturação que não desbota em dois anos. Exige domínio de pigmento, camadas e cicatrização.",
  },
  {
    name: "Fechamentos",
    color: "#334238",
    text: "Manga, meia-manga, peito, costas — projetos de composição que exigem visão do conjunto.",
  },
  {
    name: "Fine Line",
    color: "#8a8f86",
    text: "Traço fino e delicado, ideal para peças menores, escritas e detalhes minimalistas.",
  },
  {
    name: "Blackwork",
    color: "#111210",
    text: "Áreas sólidas de preto, padrões e geometria. Impacto visual forte e duradouro.",
  },
];

export const TATTOO_PROCESS = [
  {
    title: "Consulta",
    text: "Conversa por WhatsApp ou presencial. Você traz suas referências e conta sua história. Sem compromisso.",
  },
  {
    title: "Rascunho",
    text: "O projeto é criado para o seu corpo. Você vê, opina e aprova antes de marcar qualquer sessão.",
  },
  {
    title: "Sessão",
    text: "Ambiente preparado, pausas planejadas e processo transparente do início ao fim.",
  },
  {
    title: "Cuidado",
    text: "Protocolo completo de pós-tatuagem e acompanhamento da cicatrização.",
  },
];

export const AFTERCARE = [
  {
    time: "0–24h",
    title: "Mantenha o filme",
    text: "O insulfilme (ou segunda pele) protege a tatuagem nas primeiras horas. Retire no tempo indicado pelo tatuador.",
  },
  {
    time: "Diário",
    title: "Lave com cuidado",
    text: "Água morna e sabonete neutro, com as mãos limpas. Seque com papel toalha, sem esfregar.",
  },
  {
    time: "3x ao dia",
    title: "Hidrate na medida",
    text: "Uma camada fina da pomada indicada. Excesso abafa a pele e atrapalha a cicatrização.",
  },
  {
    time: "15–30 dias",
    title: "Proteja",
    text: "Nada de sol, piscina, mar ou sauna. Não coce e não arranque as casquinhas.",
  },
  {
    time: "Para sempre",
    title: "Protetor solar",
    text: "Depois de cicatrizada, protetor solar sempre. É ele que mantém o traço e a cor vivos por anos.",
  },
];

export const HAIRCUTS = [
  { title: "Low fade", tag: "Máquina", placeholder: true },
  { title: "Pompadour", tag: "Tesoura", placeholder: true },
  { title: "Corte social", tag: "Tesoura", placeholder: true },
  { title: "Mid fade + barba", tag: "Combo", placeholder: true },
  { title: "Buzz cut", tag: "Máquina", placeholder: true },
  { title: "Barba desenhada", tag: "Barba", placeholder: true },
];

export const BARBER_SERVICES = [
  {
    name: "Corte na tesoura",
    desc: "Acabamento clássico, textura e caimento natural.",
    price: "R$ 70",
    time: "45 min",
  },
  {
    name: "Corte na máquina",
    desc: "Degradês, fades e laterais precisas.",
    price: "R$ 55",
    time: "40 min",
  },
  { name: "Barba", desc: "Toalha quente, navalha e finalização.", price: "R$ 50", time: "30 min" },
  { name: "Corte + barba", desc: "O combo completo da casa.", price: "R$ 110", time: "75 min" },
  { name: "Sobrancelha", desc: "Alinhamento na navalha ou pinça.", price: "R$ 25", time: "15 min" },
  {
    name: "Barboterapia",
    desc: "Ritual com vapor, esfoliação, óleos e massagem facial.",
    price: "R$ 80",
    time: "45 min",
  },
];

export const LASER_REMOVAL = {
  steps: [
    {
      title: "Avaliação",
      text: "Analisamos cor, profundidade, tamanho e idade da tatuagem para estimar o número de sessões.",
    },
    {
      title: "Disparos",
      text: "O laser fragmenta o pigmento em partículas minúsculas, sem cortar a pele.",
    },
    {
      title: "Eliminação",
      text: "O próprio organismo elimina as partículas aos poucos, entre uma sessão e outra.",
    },
    {
      title: "Intervalo",
      text: "As sessões acontecem a cada 45–60 dias, respeitando a recuperação da pele.",
    },
  ],
  factors: [
    "Cor do pigmento",
    "Profundidade",
    "Tamanho da área",
    "Idade da tatuagem",
    "Tipo de pele",
  ],
};

export const PEELING = {
  benefits: [
    "Controle da oleosidade",
    "Poros visivelmente menores",
    "Pele uniforme e com viço",
    "Efeito imediato — ideal antes de eventos",
    "Sem tempo de recuperação",
  ],
  steps: [
    { title: "Carbono", text: "Uma loção de carbono é aplicada e penetra nos poros." },
    {
      title: "Laser",
      text: "O laser aquece e vaporiza o carbono, levando junto impurezas e células mortas.",
    },
    { title: "Glow", text: "A pele sai limpa, uniforme e iluminada — o famoso efeito Hollywood." },
  ],
};

export const LASER_CARE = [
  "Evite sol na área tratada por pelo menos 30 dias",
  "Use protetor solar FPS 50 diariamente",
  "Não esfregue nem arranque crostas",
  "Mantenha a pele hidratada",
  "Evite academia e calor intenso nas primeiras 24h",
];
