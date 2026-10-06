import { useState } from "react";
import { MesaFixa, type MesaObject } from "../MesaFixa";
import { ICONS, Marquee } from "../Marquee";
import { LASER_CARE, LASER_REMOVAL, PEELING } from "../content";
import { SectionTitle, requestService } from "../ui";

const M = "/images/mesas";

// Coordenadas em pixels da foto da bancada (1672 × 941).
const objects: MesaObject[] = [
  {
    key: "laser",
    label: "Laser",
    title: "Remoção de tatuagem",
    description:
      "O laser fragmenta o pigmento e o corpo faz o resto. Clareie para cobrir ou remova por completo.",
    target: "remocao",
    icon: "laser",
    pin: [600, 262],
    pieces: [{ src: `${M}/obj-laser-laser.webp`, x: 427, y: 197, w: 382, h: 608 }],
  },
  {
    key: "oculos",
    label: "Óculos",
    title: "Cuidados e segurança",
    description:
      "Proteção para os olhos, para a pele e um protocolo claro de antes e depois de cada sessão.",
    target: "laser-cuidados",
    icon: "goggles",
    pin: [1058, 252],
    pieces: [{ src: `${M}/obj-laser-oculos.webp`, x: 868, y: 177, w: 384, h: 156 }],
  },
  {
    key: "carbono",
    label: "Carbono",
    title: "Peeling Hollywood",
    description:
      "Loção de carbono e laser: menos oleosidade, poros fechados e pele com viço na hora.",
    target: "peeling",
    icon: "sparkle",
    pin: [903, 448],
    pieces: [{ src: `${M}/obj-laser-pote.webp`, x: 803, y: 399, w: 201, h: 193 }],
  },
  {
    key: "serum",
    label: "Sérum",
    title: "Agendar avaliação",
    description:
      "Mande uma foto da tatuagem ou conte o que quer melhorar na pele. A avaliação é o primeiro passo.",
    target: "agendar",
    service: "remocao",
    icon: "dropper",
    pin: [1150, 520],
    pieces: [
      { src: `${M}/obj-laser-frasco1.webp`, x: 1038, y: 367, w: 107, h: 292 },
      { src: `${M}/obj-laser-frasco2.webp`, x: 1162, y: 456, w: 105, h: 287 },
    ],
  },
];

function RemovalSimulator() {
  const [sessions, setSessions] = useState(0);
  const [colored, setColored] = useState(false);
  const max = 10;
  const speed = colored ? 1.35 : 1;
  const fade = Math.min(1, (sessions / max) * (colored ? 0.85 : 1.15));
  const opacity = Math.max(0.02, Math.pow(1 - fade, 1.4 * speed));
  return (
    <div className="rounded-[28px] bg-carvao p-5 md:p-7">
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-[20px]"
        style={{
          background: "radial-gradient(120% 90% at 40% 30%, #e7bfa0, #c99474 70%, #a8755a)",
        }}
      >
        <svg
          viewBox="0 0 64 64"
          className="absolute inset-[14%] h-[72%] w-[72%] transition-all duration-700"
          style={{ opacity, filter: `blur(${fade * 2.2}px)` }}
        >
          <g style={{ color: colored ? "#7a2d3a" : "#1a1a1a" }} strokeWidth={2.6}>
            {ICONS["rose"]}
          </g>
          {colored && (
            <g opacity={0.65}>
              <circle cx="32" cy="22" r="7" fill="#b4344a" />
              <path d="M32 44c-6-6-14-4-16 0 6 4 12 4 16 0z" fill="#3f7a4a" />
              <path d="M32 50c6-6 12-4 14 0-6 3-10 3-14 0z" fill="#3f7a4a" />
            </g>
          )}
        </svg>
        {sessions > 0 && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ opacity: Math.min(0.5, sessions * 0.08) }}
          >
            {[...Array(18)].map((_, i) => (
              <span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-carvao/40"
                style={{
                  left: `${30 + ((i * 37) % 40)}%`,
                  top: `${20 + ((i * 53) % 60)}%`,
                  transform: `scale(${1 - fade})`,
                }}
              />
            ))}
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-carvao/70 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-creme backdrop-blur">
          Simulação ilustrativa
        </span>
        <span className="display absolute bottom-3 right-5 text-6xl text-carvao/70">
          {sessions === 0 ? "Antes" : `${sessions}ª`}
        </span>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 rounded-full bg-creme/10 p-1">
          {[
            { v: false, l: "Tinta preta" },
            { v: true, l: "Colorida" },
          ].map((o) => (
            <button
              key={o.l}
              onClick={() => setColored(o.v)}
              className={`rounded-full px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] transition ${colored === o.v ? "bg-cobre text-creme" : "text-creme/60 hover:text-creme"}`}
            >
              {o.l}
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-creme/60">
          {sessions} {sessions === 1 ? "sessão" : "sessões"}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        value={sessions}
        onChange={(e) => setSessions(Number(e.target.value))}
        className="mt-5 w-full accent-[#9a4729]"
        aria-label="Número de sessões"
      />
      <p className="mt-3 text-xs leading-relaxed text-creme/50">
        Arraste para simular o clareamento ao longo das sessões. Pigmentos coloridos costumam
        precisar de mais sessões. O resultado real depende da avaliação.
      </p>
    </div>
  );
}

function Removal() {
  return (
    <section id="remocao" className="bg-creme px-4 py-28 text-carvao md:px-8 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-14 md:grid-cols-2 md:items-center">
        <div>
          <SectionTitle
            tone="dark"
            eyebrow="Remoção a laser"
            title={
              <>
                Mudou de ideia? <em className="text-cobre">A pele também pode.</em>
              </>
            }
            text="Remoção total ou clareamento para cobertura. Tecnologia a laser que fragmenta o pigmento sem cortar a pele."
          />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2">
            {LASER_REMOVAL.steps.map((s, i) => (
              <li
                key={s.title}
                data-reveal
                className="rounded-2xl border border-carvao/10 bg-white/50 p-5 transition hover:-translate-y-1 hover:border-cobre/50 hover:shadow-xl"
              >
                <span className="text-xs font-bold text-cobre">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-2 text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-carvao/70">{s.text}</p>
              </li>
            ))}
          </ol>
          <div data-reveal className="mt-8 flex flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-carvao/60">
              O número de sessões depende de:
            </span>
            {LASER_REMOVAL.factors.map((f) => (
              <span
                key={f}
                className="rounded-full bg-verde/15 px-3 py-1 text-xs font-semibold text-musgo"
              >
                {f}
              </span>
            ))}
          </div>
          <button onClick={() => requestService("remocao")} className="btn btn-cobre mt-10">
            Avaliar minha tatuagem →
          </button>
        </div>
        <div data-reveal>
          <RemovalSimulator />
        </div>
      </div>
    </section>
  );
}

function PeelingCompare() {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] md:aspect-[5/6]">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(90% 70% at 45% 40%, #e2b48f, #b98260 80%)" }}
      >
        {[...Array(70)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 41) % 100}%`,
              top: `${(i * 67) % 100}%`,
              width: 3 + (i % 4),
              height: 3 + (i % 4),
              background: i % 3 ? "rgba(120,60,40,.35)" : "rgba(255,255,255,.45)",
            }}
          />
        ))}
        <span className="absolute bottom-5 left-5 rounded-full bg-carvao/70 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-creme">
          Antes
        </span>
      </div>
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 0 0 ${pos}%)`,
          background: "radial-gradient(90% 70% at 45% 40%, #f0c7a4, #d29c78 80%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(40% 30% at 55% 35%, rgba(255,255,255,.45), transparent)",
          }}
        />
        <span className="absolute bottom-5 right-5 rounded-full bg-cobre px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-creme">
          Depois
        </span>
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-creme"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-creme text-carvao shadow-xl">
          ↔
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        aria-label="Comparar antes e depois"
      />
      <span className="absolute left-5 top-5 rounded-full bg-carvao/70 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-creme backdrop-blur">
        Ilustração — arraste
      </span>
    </div>
  );
}

function Peeling() {
  return (
    <section
      id="peeling"
      className="relative overflow-hidden bg-carvao px-4 py-28 md:px-8 md:py-36"
    >
      <div className="mx-auto grid max-w-[1400px] gap-14 md:grid-cols-[1fr_1fr] md:items-center">
        <div data-reveal className="order-2 md:order-1">
          <PeelingCompare />
        </div>
        <div className="order-1 md:order-2">
          <SectionTitle
            eyebrow="Peeling Hollywood"
            title={
              <>
                O glow das <em className="text-cobre">estrelas.</em>
              </>
            }
            text="O tratamento queridinho do tapete vermelho: carbono e laser para uma pele limpa, uniforme e iluminada — sem tempo de recuperação."
          />
          <ol className="mt-10 space-y-3">
            {PEELING.steps.map((s, i) => (
              <li
                key={s.title}
                data-reveal
                className="group flex gap-5 rounded-2xl border border-creme/10 p-5 transition hover:border-cobre/60 hover:bg-creme/[0.04]"
              >
                <span className="display text-4xl text-cobre transition-transform duration-500 group-hover:scale-110">
                  {i + 1}
                </span>
                <span>
                  <span className="block text-sm font-extrabold uppercase tracking-[0.18em] text-creme">
                    {s.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-creme/70">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <ul data-reveal className="mt-8 flex flex-wrap gap-2">
            {PEELING.benefits.map((b) => (
              <li
                key={b}
                className="rounded-full bg-verde px-3 py-1.5 text-xs font-semibold text-creme"
              >
                {b}
              </li>
            ))}
          </ul>
          <button onClick={() => requestService("peeling")} className="btn btn-cobre mt-10">
            Quero o Peeling Hollywood →
          </button>
        </div>
      </div>
    </section>
  );
}

function Care() {
  return (
    <section id="laser-cuidados" className="bg-verde px-4 py-28 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-2 md:items-start">
        <SectionTitle
          eyebrow="Cuidados e segurança"
          title={
            <>
              Antes e depois <em className="text-carvao">de cada sessão.</em>
            </>
          }
          text="Óculos de proteção para você e para o profissional, avaliação da pele antes de qualquer disparo e um protocolo simples para casa."
        />
        <ul className="space-y-3">
          {LASER_CARE.map((c, i) => (
            <li
              key={c}
              data-reveal
              className="flex items-center gap-4 rounded-2xl bg-carvao/20 p-5 backdrop-blur transition hover:translate-x-2 hover:bg-carvao/30"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-creme text-sm font-bold text-carvao">
                {i + 1}
              </span>
              <span className="text-base text-creme">{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function LaserSection() {
  return (
    <div id="laser">
      <Marquee
        icons={["laser", "goggles", "dropper", "sparkle", "face"]}
        words={["Remoção a laser", "Peeling Hollywood", "Glow", "Pele nova", "Laser"]}
        color="#efe8dc"
        bg="#252622"
      />
      <MesaFixa
        id="mesa-laser"
        eyebrow="03 — Laser & Peeling Hollywood"
        title={
          <>
            A mesa do <em className="text-areia">laser.</em>
          </>
        }
        intro="Remoção de tatuagem e Peeling Hollywood. Escolha um objeto da bancada para conhecer cada tratamento."
        image={`${M}/laser.webp`}
        alt="Bancada clara com a ponteira do laser, óculos de proteção, pote e dois frascos conta-gotas Bartô"
        width={1672}
        height={941}
        objects={objects}
        bg="#5f725a"
        mobileZoom={1.5}
      />
      <Marquee
        icons={["sparkle", "laser", "face", "dropper", "goggles"]}
        words={["Remoção", "Peeling", "Segurança", "Avaliação", "Studio Bartô"]}
        color="#252622"
        bg="#d8ccb6"
        reverse
      />
      <Removal />
      <Peeling />
      <Care />
    </div>
  );
}
