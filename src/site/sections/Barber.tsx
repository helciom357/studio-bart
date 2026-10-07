import { MesaFixa, type MesaObject } from "../MesaFixa";
import { Marquee } from "../Marquee";
import { BARBERS, BARBER_SERVICES, HAIRCUTS } from "../content";
import { Placeholder, ProfessionalCard, RipeCarousel, SectionTitle, requestService } from "../ui";
import { scrollToId } from "../scroll";

const M = "/images/mesas";

// Coordenadas em pixels da foto da bancada (1672 × 941).
const objects: MesaObject[] = [
  {
    key: "maquina-corte",
    label: "Máquina",
    title: "Cortes da casa",
    description:
      "Fades, degradês, cortes na tesoura e barbas desenhadas. Veja o que sai da cadeira do Bartô.",
    target: "cortes",
    icon: "clipper",
    pin: [256, 322],
    pieces: [{ src: `${M}/obj-barbearia-maquina.webp`, x: 192, y: 300, w: 128, h: 383 }],
  },
  {
    key: "navalha",
    label: "Navalha",
    title: "Profissionais",
    description: "Conheça os barbeiros que fazem o Bartô e as histórias por trás de cada um.",
    target: "profissionais",
    icon: "razor",
    pin: [538, 372],
    pieces: [{ src: `${M}/obj-barbearia-navalha.webp`, x: 374, y: 327, w: 225, h: 298 }],
  },
  {
    key: "tesoura",
    label: "Tesoura",
    title: "Serviços",
    description:
      "Corte na tesoura, na máquina, barba, sobrancelha e barboterapia. Escolha o seu ritual.",
    target: "servicos",
    icon: "scissors",
    pin: [1150, 338],
    pieces: [{ src: `${M}/obj-barbearia-tesoura.webp`, x: 1074, y: 311, w: 148, h: 349 }],
  },
  {
    key: "secador",
    label: "Secador",
    title: "Agendar horário",
    description: "Escolha o serviço e o profissional. A gente confirma pelo WhatsApp.",
    target: "agendar",
    service: "barbearia",
    icon: "dryer",
    pin: [1432, 322],
    pieces: [{ src: `${M}/obj-barbearia-secador.webp`, x: 1189, y: 289, w: 343, h: 374 }],
  },
];

function Cuts() {
  return (
    <section id="cortes" className="relative overflow-hidden bg-[#2b382f] py-28 md:py-36">
      <div className="mx-auto mb-14 max-w-[1400px] px-4 md:px-8">
        <SectionTitle
          eyebrow="Cortes"
          title={
            <>
              Da cadeira <em className="text-areia">para a rua.</em>
            </>
          }
          text="Fotos ilustrativas — em breve, os cortes reais da casa. Arraste para navegar."
        />
      </div>
      <RipeCarousel
        duration={50}
        intro={
          <>
            <p className="display text-[2.6rem] uppercase leading-[0.9] text-creme">
              Corte é assinatura.
            </p>
            <div>
              <span className="pill bg-cobre text-creme">Barbearia Bartô</span>
              <p className="mt-4 text-sm text-creme/70">
                Tesoura, máquina e navalha — no seu estilo.
              </p>
            </div>
          </>
        }
        cards={HAIRCUTS.map((c, i) => ({
          key: c.title,
          media: (
            <Placeholder
              icon={["clipper", "scissors", "comb", "razor", "dryer", "brush"][i % 6] ?? "clipper"}
              label="Foto fictícia"
              tone={i % 2 ? "#5f725a" : "#9a4729"}
            />
          ),
          pill: c.tag,
          title: c.title,
          pillColor: i % 2 ? "#efe8dc" : "#334238",
          pillText: i % 2 ? "#252622" : "#efe8dc",
          onClick: () => requestService("barbearia"),
        }))}
      />
    </section>
  );
}

function Services() {
  return (
    <section id="servicos" className="bg-creme px-4 py-28 text-carvao md:px-8 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-14 md:grid-cols-[0.9fr_1.1fr]">
        <div className="md:sticky md:top-28 md:self-start">
          <SectionTitle
            tone="dark"
            eyebrow="Serviços"
            title={
              <>
                Escolha <em className="text-cobre">o seu ritual.</em>
              </>
            }
            text="Valores ilustrativos — a tabela oficial entra em breve."
          />
          <button onClick={() => requestService("barbearia")} className="btn btn-cobre mt-10">
            Agendar horário →
          </button>
        </div>
        <ul className="border-t border-carvao/15">
          {BARBER_SERVICES.map((s, i) => (
            <li key={s.name} data-reveal>
              <button
                onClick={() => requestService("barbearia")}
                className="group relative flex w-full items-center justify-between gap-6 overflow-hidden border-b border-carvao/15 py-7 text-left"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-verde transition-transform duration-500 ease-out group-hover:scale-y-100" />
                <span className="relative flex items-baseline gap-5 transition-transform duration-500 group-hover:translate-x-4">
                  <span className="text-xs font-bold text-cobre transition group-hover:text-creme">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="display block text-3xl transition group-hover:text-creme md:text-4xl">
                      {s.name}
                    </span>
                    <span className="mt-1 block text-sm text-carvao/60 transition group-hover:text-creme/80">
                      {s.desc}
                    </span>
                  </span>
                </span>
                <span className="relative shrink-0 text-right transition-transform duration-500 group-hover:-translate-x-4">
                  <span className="display block text-3xl transition group-hover:text-creme">
                    {s.price}
                  </span>
                  <span className="text-xs uppercase tracking-[0.14em] text-carvao/50 transition group-hover:text-creme/70">
                    {s.time}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="profissionais" className="bg-musgo px-4 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <SectionTitle
          eyebrow="Profissionais"
          title={
            <>
              Quem está <em className="text-areia">na cadeira.</em>
            </>
          }
          text="Passe o mouse (ou toque) nas fotos e leia a história de cada barbeiro."
        />
        <div className="mt-20 space-y-28">
          {BARBERS.map((b, i) => (
            <ProfessionalCard key={b.slug} p={b} index={i} accent={i % 2 ? "#5f725a" : "#9a4729"} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function BarberSection() {
  return (
    <div id="barbearia">
      <Marquee
        icons={["clipper", "scissors", "dryer", "razor", "comb", "pole", "brush"]}
        words={["Barbearia", "Fade", "Tesoura", "Navalha", "Barboterapia", "Sobrancelha", "Barba"]}
        color="#efe8dc"
        bg="#5f725a"
      />
      <MesaFixa
        id="mesa-barbearia"
        eyebrow="01 — Barbearia"
        title={
          <>
            A bancada do <em className="text-areia">barbeiro.</em>
          </>
        }
        intro="Máquina, navalha, tesoura e secador. Escolha um objeto da bancada para ir direto ao assunto."
        image={`${M}/barbearia.webp`}
        alt="Bancada de barbearia com máquina de corte, navalha, tesoura e secador sobre um tapete preto com o logo Bartô"
        width={1672}
        height={941}
        objects={objects}
        bg="#334238"
        mobileZoom={1.12}
        compactPins
      />
      <Marquee
        icons={["scissors", "comb", "pole", "clipper", "razor", "dryer", "brush"]}
        words={[
          "Cortes",
          "Serviços",
          "Profissionais",
          "Agende",
          "Perdizes",
          "Studio Bartô",
          "Barba",
        ]}
        color="#252622"
        bg="#d8ccb6"
        reverse
      />
      <Cuts />
      <Services />
      <Team />
      <div className="flex justify-center bg-musgo pb-20">
        <button
          onClick={() => scrollToId("tatuagem")}
          className="eyebrow flex flex-col items-center gap-3 text-creme/70 transition hover:text-creme"
        >
          Próxima mesa: Tatuagem
          <span className="block h-10 w-px bg-creme/50" />
        </button>
      </div>
    </div>
  );
}
