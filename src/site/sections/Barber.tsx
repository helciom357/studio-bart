import { TableScene, type TableItem, type TableTheme } from "../three/TableScene";
import { Clipper, Dryer, Pomade, Razor, Scissors } from "../three/models";
import { Marquee } from "../Marquee";
import { BARBERS, BARBER_SERVICES, HAIRCUTS } from "../content";
import { Placeholder, ProfessionalCard, RipeCarousel, SectionTitle, requestService } from "../ui";

const theme: TableTheme = {
  bg: "#334238",
  top: "#5a3d2b",
  leg: "#c9a46a",
  mat: "#252622",
  accent: "#9a4729",
  pill: "#efe8dc",
  pillText: "#252622",
  sheet: { position: [1.9, 0.025, 0.9], rotation: -0.25 },
};

const items: TableItem[] = [
  {
    key: "maquina-corte",
    label: "Máquina de corte",
    title: "Cortes da casa",
    description:
      "Fades, degradês, cortes na tesoura e barbas desenhadas. Veja o que sai da cadeira do Bartô.",
    cta: "Ver cortes",
    target: "cortes",
    position: [-1.8, 0, 0.5],
    labelHeight: 0.75,
    view: { azimuth: -0.6, elevation: 0.5, distance: 4.4 },
    node: <Clipper />,
  },
  {
    key: "tesoura",
    label: "Tesoura",
    title: "Serviços",
    description:
      "Corte na tesoura, na máquina, barba, sobrancelha e barboterapia. Escolha o seu ritual.",
    cta: "Ver serviços",
    target: "servicos",
    position: [0.2, 0, -0.9],
    labelHeight: 0.5,
    view: { azimuth: 0.15, elevation: 0.75, distance: 3.9 },
    node: <Scissors />,
  },
  {
    key: "navalha",
    label: "Navalha",
    title: "Profissionais",
    description: "Conheça os barbeiros que fazem o Bartô — e as histórias por trás de cada um.",
    cta: "Conhecer a equipe",
    target: "profissionais",
    position: [0.3, 0, 1.1],
    labelHeight: 0.5,
    view: { azimuth: 0.85, elevation: 0.6, distance: 3.8 },
    node: <Razor />,
  },
  {
    key: "secador",
    label: "Secador",
    title: "Agende seu horário",
    description: "Escolha o serviço e o profissional. A gente confirma pelo WhatsApp.",
    cta: "Agendar",
    target: "agendar",
    position: [2.1, 0, -0.9],
    labelHeight: 1.0,
    view: { azimuth: 1.45, elevation: 0.48, distance: 4.4 },
    node: <Dryer />,
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
      <TableScene
        id="mesa-barbearia"
        eyebrow="02 — Barbearia"
        title={
          <>
            A bancada do <em className="text-areia">barbeiro.</em>
          </>
        }
        intro="Máquina, tesoura, navalha e secador. Role para girar a bancada e escolha por onde começar."
        theme={theme}
        items={items}
        decor={
          <group position={[-0.5, 0, 0.3]} rotation={[0, 0.4, 0]}>
            <Pomade />
          </group>
        }
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
    </div>
  );
}
