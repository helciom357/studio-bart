import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ICONS } from "./Marquee";
import type { Professional } from "./content";

export const SERVICE_EVENT = "barto:service";
export type ServiceKey = "tatuagem" | "barbearia" | "remocao" | "peeling";

/** Abre o formulário já com o serviço escolhido. */
export function requestService(service: ServiceKey) {
  window.dispatchEvent(new CustomEvent<ServiceKey>(SERVICE_EVENT, { detail: service }));
}

export function SectionTitle({
  eyebrow,
  title,
  text,
  align = "left",
  tone = "light",
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  const c = tone === "light" ? "text-creme" : "text-carvao";
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl`}>
      <p data-reveal className={`eyebrow ${tone === "light" ? "text-areia" : "text-cobre"}`}>
        {eyebrow}
      </p>
      <h2 data-reveal className={`display mt-4 text-[clamp(2.6rem,6vw,5.5rem)] ${c}`}>
        {title}
      </h2>
      {text && (
        <p
          data-reveal
          className={`mt-5 text-base leading-relaxed md:text-lg ${tone === "light" ? "text-creme/75" : "text-carvao/75"} ${align === "center" ? "mx-auto max-w-xl" : "max-w-xl"}`}
        >
          {text}
        </p>
      )}
    </div>
  );
}

export function Placeholder({
  icon,
  label,
  tone = "#334238",
}: {
  icon: string;
  label: string;
  tone?: string;
}) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${tone}, #252622)` }}
    >
      <svg viewBox="0 0 64 64" className="h-1/3 w-1/3 text-creme/25">
        {ICONS[icon]}
      </svg>
      <span className="absolute left-3 top-3 rounded-full bg-creme/15 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-creme/80 backdrop-blur">
        {label}
      </span>
    </div>
  );
}

/* Carrossel no estilo dos cards da Ripe: cards altos, título grande, selo e movimento contínuo. */
export type CarouselCard = {
  key: string;
  media: ReactNode;
  pill?: string;
  title?: string;
  pillColor?: string;
  pillText?: string;
  onClick?: () => void;
};

export function RipeCarousel({
  intro,
  cards,
  duration = 60,
}: {
  intro?: ReactNode;
  cards: CarouselCard[];
  duration?: number;
}) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, offset: 0, moved: 0 });

  // Movimento contínuo + arrasto com o mouse/dedo.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = (t: number) => {
      const dt = t - last;
      last = t;
      const el = track.current;
      if (el && !drag.current.down && !reduce) {
        const half = el.scrollWidth / 2;
        drag.current.offset = (drag.current.offset - (dt / 1000) * (half / duration)) % half;
        if (drag.current.offset > 0) drag.current.offset -= half;
        el.style.transform = `translate3d(${drag.current.offset}px,0,0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  const onDown = (e: React.PointerEvent) => {
    drag.current.down = true;
    drag.current.x = e.clientX;
    drag.current.moved = 0;
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.down || !track.current) return;
    const dx = e.clientX - drag.current.x;
    drag.current.x = e.clientX;
    drag.current.moved += Math.abs(dx);
    const half = track.current.scrollWidth / 2;
    let o = drag.current.offset + dx;
    if (o > 0) o -= half;
    if (o < -half) o += half;
    drag.current.offset = o;
    track.current.style.transform = `translate3d(${o}px,0,0)`;
  };
  const onUp = () => {
    drag.current.down = false;
  };

  const list = [...cards, ...cards];
  return (
    <div
      className="relative cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
    >
      <div ref={track} className="flex w-max gap-4 px-4 md:gap-5">
        {list.map((c, i) => (
          <div key={`${c.key}-${i}`} className="flex gap-4 md:gap-5">
            {intro && i % cards.length === 0 && (
              <div className="relative flex h-[62vh] max-h-[640px] min-h-[420px] w-[78vw] max-w-[440px] shrink-0 flex-col justify-between overflow-hidden rounded-[28px] bg-carvao p-7">
                {intro}
              </div>
            )}
            <button
              type="button"
              onClick={() => drag.current.moved < 8 && c.onClick?.()}
              className="group relative h-[62vh] max-h-[640px] min-h-[420px] w-[70vw] max-w-[440px] shrink-0 overflow-hidden rounded-[28px] text-left"
            >
              <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-105">
                {c.media}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-carvao/85 via-carvao/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center p-7 text-center">
                {c.pill && (
                  <span
                    className="pill -rotate-3 transition-transform duration-500 group-hover:rotate-0"
                    style={{ background: c.pillColor ?? "#5f725a", color: c.pillText ?? "#efe8dc" }}
                  >
                    {c.pill}
                  </span>
                )}
                {c.title && (
                  <span className="display mt-2 text-4xl uppercase text-creme md:text-5xl">
                    {c.title}
                  </span>
                )}
                <span className="mt-5 flex h-9 w-16 items-center justify-center rounded-full bg-creme/90 text-carvao transition-all duration-500 group-hover:w-20 group-hover:bg-cobre group-hover:text-creme">
                  →
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string | null;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!src) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [src, onClose]);
  if (!src) return null;
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-carvao/90 p-4 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal
    >
      <img
        src={src}
        alt={alt}
        className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl animate-in zoom-in-90 duration-500"
      />
      <button
        className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-creme text-2xl text-carvao"
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  );
}

export function ProfessionalCard({
  p,
  accent = "#9a4729",
  index = 0,
}: {
  p: Professional;
  accent?: string;
  index?: number;
}) {
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState(0);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = body.current;
    if (!el) return;
    gsap.to(el, {
      height: open ? "auto" : 0,
      opacity: open ? 1 : 0,
      duration: 0.7,
      ease: "expo.out",
    });
  }, [open]);

  const reverse = index % 2 === 1;
  return (
    <article
      data-reveal
      className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
    >
      <div
        className="group relative aspect-[4/5] overflow-hidden rounded-[28px] bg-musgo"
        onMouseEnter={() => p.photos.length > 1 && setPhoto(1)}
        onMouseLeave={() => setPhoto(0)}
      >
        {p.photos.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${p.name}, ${p.role.toLowerCase()} do Studio Bartô`}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ${photo === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-carvao/70 via-transparent to-transparent" />
        <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
          {p.facts.map((f) => (
            <span
              key={f}
              className="rounded-full bg-creme/90 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-carvao"
            >
              {f}
            </span>
          ))}
        </div>
        {p.photos.length > 1 && (
          <div className="absolute right-5 top-5 flex gap-1.5">
            {p.photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhoto(i)}
                className={`h-1.5 rounded-full transition-all ${photo === i ? "w-6 bg-creme" : "w-1.5 bg-creme/50"}`}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <div>
        <span className="pill" style={{ background: accent, color: "#efe8dc" }}>
          {p.role}
        </span>
        <h3 className="display mt-4 text-[clamp(2.6rem,5vw,4.5rem)] text-creme">{p.name}</h3>
        <p className="mt-5 text-base leading-relaxed text-creme/80 md:text-lg">{p.bio[0]}</p>
        <div ref={body} className="h-0 overflow-hidden opacity-0">
          {p.bio.slice(1).map((t) => (
            <p key={t.slice(0, 20)} className="mt-4 text-base leading-relaxed text-creme/75">
              {t}
            </p>
          ))}
        </div>
        {p.bio.length > 1 && (
          <button
            onClick={() => setOpen((o) => !o)}
            className="mt-6 inline-flex items-center gap-2 border-b border-creme/30 pb-1 text-xs font-bold uppercase tracking-[0.18em] text-creme transition hover:border-cobre hover:text-areia"
          >
            {open ? "Fechar história" : "Ler história completa"}
            <span className={`transition-transform duration-500 ${open ? "rotate-45" : ""}`}>
              +
            </span>
          </button>
        )}
        {p.highlights && (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {p.highlights.map((h) => (
              <li
                key={h.title}
                className="rounded-2xl border border-creme/10 bg-creme/[0.04] p-4 transition hover:border-cobre/60 hover:bg-creme/[0.07]"
              >
                <p className="text-sm font-bold text-creme">{h.title}</p>
                <p className="mt-1 text-xs text-creme/60">{h.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
