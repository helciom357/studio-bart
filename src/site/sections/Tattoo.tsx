import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MesaFixa, type MesaObject } from "../MesaFixa";
import { Marquee } from "../Marquee";
import {
  AFTERCARE,
  PORTFOLIO,
  TATTOO_ARTIST,
  TATTOO_PROCESS,
  TATTOO_STATS,
  TATTOO_STYLES,
} from "../content";
import { Lightbox, ProfessionalCard, RipeCarousel, SectionTitle, requestService } from "../ui";
import { scrollToId } from "../scroll";

const M = "/images/mesas";

// Coordenadas em pixels da foto da bancada (1672 × 941).
const objects: MesaObject[] = [
  {
    key: "insulfilme",
    label: "Insulfilme",
    title: "Cuidados pós-tatuagem",
    description:
      "A tatuagem termina na cicatrização. Veja o passo a passo para manter o traço e a cor por anos.",
    target: "cuidados",
    icon: "rose",
    pin: [513, 430],
    pieces: [{ src: `${M}/obj-tatuagem-rolo.webp`, x: 431, y: 177, w: 165, h: 588 }],
  },
  {
    key: "tintas",
    label: "Tintas",
    title: "Fotos e vídeos",
    description:
      "Fotos e vídeos de tatuagens feitas no estúdio. Black & Gray, fechamentos e cor que não desbota.",
    target: "portfolio",
    icon: "ink",
    pin: [944, 262],
    pieces: [
      { src: `${M}/obj-tatuagem-tinta1.webp`, x: 695, y: 157, w: 133, h: 331 },
      { src: `${M}/obj-tatuagem-tinta2.webp`, x: 889, y: 168, w: 123, h: 347 },
      { src: `${M}/obj-tatuagem-tinta3.webp`, x: 1067, y: 193, w: 127, h: 330 },
    ],
  },
  {
    key: "maquina",
    label: "Máquina",
    title: "Orçamento",
    description:
      "A máquina só liga depois do seu projeto aprovado. Conte sua ideia e receba uma proposta sem compromisso.",
    target: "orcamento",
    icon: "machine",
    pin: [790, 622],
    pieces: [{ src: `${M}/obj-tatuagem-maquina.webp`, x: 633, y: 496, w: 337, h: 279 }],
  },
  {
    key: "batoques",
    label: "Batoques",
    title: "Estilos de tatuagem",
    description:
      "Cada batoque guarda uma cor e cada estilo, uma técnica. Conheça os estilos que fazemos.",
    target: "estilos",
    icon: "caps",
    pin: [1120, 668],
    pieces: [{ src: `${M}/obj-tatuagem-batoques.webp`, x: 1019, y: 552, w: 204, h: 231 }],
  },
];

function Quote() {
  return (
    <section
      id="orcamento"
      className="relative overflow-hidden bg-carvao px-4 py-28 md:px-8 md:py-40"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-end">
          <SectionTitle
            eyebrow="Orçamento"
            title={
              <>
                Quatro etapas. <em className="text-cobre">Zero surpresa.</em>
              </>
            }
            text="O processo foi desenhado para você entender cada passo antes de qualquer decisão. Sem pressão. Sem agulha antes de você aprovar."
          />
          <div data-reveal className="flex flex-wrap gap-3 md:justify-end">
            <button onClick={() => requestService("tatuagem")} className="btn btn-cobre">
              Quero meu orçamento →
            </button>
          </div>
        </div>
        <ol className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-creme/10 bg-creme/10 md:grid-cols-4">
          {TATTOO_PROCESS.map((s, i) => (
            <li
              key={s.title}
              data-reveal
              className="group relative bg-carvao p-7 transition-colors duration-500 hover:bg-musgo md:p-9"
            >
              <span className="display text-6xl text-cobre transition-transform duration-500 group-hover:-translate-y-1 md:text-7xl">
                {i + 1}
              </span>
              <h3 className="mt-8 text-sm font-extrabold uppercase tracking-[0.2em] text-creme">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-creme/65">{s.text}</p>
            </li>
          ))}
        </ol>
        <dl className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {TATTOO_STATS.map((s) => (
            <div key={s.label} data-reveal className="border-l border-cobre/60 pl-5">
              <dt className="display text-5xl text-creme md:text-6xl" data-count={s.value}>
                {s.value}
              </dt>
              <dd className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-creme/60">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Portfolio() {
  const [open, setOpen] = useState<{ src: string; title: string } | null>(null);
  return (
    <section id="portfolio" className="relative overflow-hidden bg-[#1c1d1a] py-28 md:py-36">
      <div className="mx-auto mb-14 flex max-w-[1400px] flex-col gap-6 px-4 md:flex-row md:items-end md:justify-between md:px-8">
        <SectionTitle
          eyebrow="Portfólio"
          title={
            <>
              Trabalhos que <em className="text-areia">falam por si.</em>
            </>
          }
          text="Portfólio com consistência real — o padrão do dia a dia do Bartô. Arraste para navegar, toque para ampliar."
        />
      </div>
      <RipeCarousel
        duration={Math.max(60, PORTFOLIO.length * 7.5)}
        intro={
          <>
            <p className="display text-[2.6rem] uppercase leading-[0.9] text-creme">
              Arte que dura a vida toda.
            </p>
            <div>
              <span className="pill bg-verde text-creme">Vinny Darian</span>
              <p className="mt-4 text-sm text-creme/70">
                +20 anos entre São Paulo, Suíça e Los Angeles.
              </p>
            </div>
          </>
        }
        cards={PORTFOLIO.map((p, i) => ({
          key: p.src,
          media: (
            <img
              src={p.src}
              alt={`Tatuagem ${p.title} — ${p.style}`}
              loading="lazy"
              className="h-full w-full object-cover"
              draggable={false}
            />
          ),
          pill: p.style,
          title: p.title,
          pillColor: i % 3 === 0 ? "#9a4729" : i % 3 === 1 ? "#5f725a" : "#efe8dc",
          pillText: i % 3 === 2 ? "#252622" : "#efe8dc",
          onClick: () => setOpen({ src: p.src, title: p.title }),
        }))}
      />
      <Lightbox src={open?.src ?? null} alt={open?.title ?? ""} onClose={() => setOpen(null)} />
    </section>
  );
}

function Artist() {
  return (
    <section id="tatuador" className="bg-carvao px-4 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <p data-reveal className="eyebrow mb-10 text-areia">
          Conheça
        </p>
        <ProfessionalCard p={TATTOO_ARTIST} accent="#9a4729" />
      </div>
    </section>
  );
}

function Aftercare() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ac-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: ".ac-list", start: "top 75%", end: "bottom 60%", scrub: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <section
      id="cuidados"
      ref={root}
      className="relative overflow-hidden bg-creme px-4 py-28 text-carvao md:px-8 md:py-36"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionTitle
          tone="dark"
          eyebrow="Pós-tatuagem"
          title={
            <>
              A tatuagem termina <em className="text-cobre">na cicatrização.</em>
            </>
          }
          text="Siga o protocolo e a sua arte fica nítida por anos. Em caso de dúvida, chame a gente no WhatsApp — o acompanhamento faz parte do serviço."
        />
        <div className="ac-list relative mt-16">
          <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-carvao/15 md:block" />
          <div className="ac-line absolute left-0 right-0 top-[22px] hidden h-px origin-left bg-cobre md:block" />
          <ol className="grid gap-10 md:grid-cols-5 md:gap-6">
            {AFTERCARE.map((a, i) => (
              <li key={a.title} data-reveal className="relative">
                <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-verde text-sm font-bold text-creme ring-8 ring-creme">
                  {i + 1}
                </span>
                <p className="eyebrow mt-6 text-cobre">{a.time}</p>
                <h3 className="display mt-2 text-3xl">{a.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-carvao/70">{a.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Styles() {
  const [active, setActive] = useState(0);
  const style = TATTOO_STYLES[active];
  return (
    <section id="estilos" className="relative overflow-hidden bg-musgo px-4 py-28 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-14 md:grid-cols-[1fr_1.1fr] md:items-center">
        <div>
          <SectionTitle
            eyebrow="Estilos"
            title={
              <>
                Cada batoque, <em className="text-areia">um estilo.</em>
              </>
            }
            text="Toque em um batoque para ver o estilo. Não sabe qual é o seu? No orçamento a gente te ajuda a decidir."
          />
          {style && (
            <div
              key={style.name}
              className="mt-10 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              <span
                className="pill"
                style={{
                  background: style.color === "#efe8dc" ? "#9a4729" : style.color,
                  color: "#efe8dc",
                  outline: "1px solid rgba(239,232,220,.25)",
                }}
              >
                Estilo {String(active + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-4 text-5xl text-creme md:text-6xl">{style.name}</h3>
              <p className="mt-4 text-base leading-relaxed text-creme/80">{style.text}</p>
              <button onClick={() => requestService("tatuagem")} className="btn btn-ghost mt-8">
                Quero esse estilo
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          {TATTOO_STYLES.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className="group flex flex-col items-center gap-3"
              aria-pressed={active === i}
            >
              <span
                className={`relative flex aspect-square w-full items-center justify-center rounded-full border-[6px] bg-[#f4f1ea] shadow-[inset_0_-10px_20px_rgba(0,0,0,.18)] transition-all duration-500 ${
                  active === i
                    ? "scale-105 border-cobre"
                    : "border-creme/80 group-hover:-translate-y-1"
                }`}
              >
                <span
                  key={active === i ? `on-${i}` : `off-${i}`}
                  className="block h-[78%] w-[78%] rounded-full shadow-[inset_0_6px_14px_rgba(255,255,255,.25)]"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, ${s.color}cc, ${s.color})`,
                    animation: active === i ? "ink-drop .7s cubic-bezier(.2,.8,.2,1)" : undefined,
                  }}
                />
              </span>
              <span
                className={`text-[0.7rem] font-bold uppercase tracking-[0.16em] transition ${active === i ? "text-creme" : "text-creme/55"}`}
              >
                {s.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TattooSection() {
  return (
    <div id="tatuagem">
      <Marquee
        icons={["machine", "ink", "caps", "needle", "rose"]}
        words={["Tatuagem", "Black & Gray", "Fechamentos", "Full Color", "Realismo"]}
        color="#efe8dc"
        bg="#9a4729"
      />
      <MesaFixa
        id="mesa-tatuagem"
        eyebrow="02 — Estúdio de tatuagem"
        title={
          <>
            A mesa do <em className="text-cobre">tatuador.</em>
          </>
        }
        intro="Insulfilme, tintas, máquina e batoques. Cada ferramenta leva você a uma parte do estúdio."
        image={`${M}/tatuagem.webp`}
        alt="Bancada de tatuagem coberta com plástico: rolo de insulfilme, três frascos de tinta Bartô, máquina pen e batoques de tinta"
        width={1672}
        height={941}
        objects={objects}
        bg="#252622"
        mobileZoom={1.5}
      />
      <Marquee
        icons={["ink", "rose", "machine", "caps", "needle"]}
        words={["Orçamento", "Portfólio", "Cuidados", "Estilos", "Vinny Darian"]}
        color="#252622"
        bg="#d8ccb6"
        reverse
      />
      <Quote />
      <Portfolio />
      <Artist />
      <Aftercare />
      <Styles />
      <div className="flex justify-center bg-musgo pb-20">
        <button
          onClick={() => scrollToId("laser")}
          className="eyebrow flex flex-col items-center gap-3 text-creme/70 transition hover:text-creme"
        >
          Próxima mesa: Laser
          <span className="block h-10 w-px bg-creme/50" />
        </button>
      </div>
    </div>
  );
}
