import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToId } from "./scroll";

// Ponto da porta de entrada na foto da fachada (px da imagem original 1092×1440).
const IMG_W = 1092;
const IMG_H = 1440;
const DOOR_X = 630;
const DOOR_Y = 860;
const POS_Y = 0.62; // object-position vertical

export function Hero({ ready }: { ready: boolean }) {
  const section = useRef<HTMLElement>(null);
  const facade = useRef<HTMLImageElement>(null);

  // Mantém o zoom centrado na porta em qualquer proporção de tela.
  useEffect(() => {
    const img = facade.current;
    if (!img) return;
    const place = () => {
      const w = img.clientWidth;
      const h = img.clientHeight;
      const s = Math.max(w / IMG_W, h / IMG_H);
      const offX = (w - IMG_W * s) / 2;
      const offY = (h - IMG_H * s) * POS_Y;
      img.style.transformOrigin = `${offX + DOOR_X * s}px ${offY + DOOR_Y * s}px`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      tl.to(q(".h-copy"), { yPercent: -40, opacity: 0, duration: 0.25, ease: "power2.in" }, 0)
        .to(q(".h-cue"), { opacity: 0, duration: 0.1 }, 0)
        .to(facade.current, { scale: 6, duration: 0.75, ease: "power3.in" }, 0)
        .to(q(".h-tint"), { opacity: 0.85, duration: 0.6, ease: "power2.in" }, 0.15)
        .fromTo(
          q(".h-inside"),
          { opacity: 0, scale: 1.35 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" },
          0.62,
        )
        .fromTo(q(".h-welcome"), { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.15 }, 0.75)
        .to(q(".h-welcome"), { opacity: 0, y: -60, duration: 0.1 }, 0.92)
        .to(q(".h-fade"), { opacity: 1, duration: 0.12 }, 0.9);
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!ready || !section.current) return;
    const q = gsap.utils.selector(section.current);
    gsap.fromTo(
      q(".h-line > span"),
      { yPercent: 135 },
      { yPercent: 0, duration: 1.3, stagger: 0.1, ease: "expo.out" },
    );
    gsap.fromTo(
      q(".h-fadein"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1, delay: 0.5, ease: "power3.out" },
    );
    gsap.fromTo(facade.current, { scale: 1.15 }, { scale: 1, duration: 2.2, ease: "expo.out" });
  }, [ready]);

  return (
    <section id="inicio" ref={section} className="relative h-[320vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-carvao">
        <img
          ref={facade}
          src="/images/fachada.webp"
          alt="Fachada do Studio Bartô em Perdizes"
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{ objectPosition: `50% ${POS_Y * 100}%` }}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-musgo via-musgo/10 to-carvao/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-carvao/80 via-carvao/20 to-transparent" />
        <div className="h-tint absolute inset-0 bg-carvao opacity-0" />

        <div className="h-inside absolute inset-0 opacity-0">
          <img
            src="/images/team/nicolas-1.webp"
            alt=""
            className="h-full w-full object-cover blur-[2px]"
          />
          <div className="absolute inset-0 bg-carvao/70" />
        </div>

        <div className="h-welcome absolute inset-0 flex flex-col items-center justify-center px-4 text-center opacity-0">
          <span className="eyebrow text-areia">Seja bem-vindo</span>
          <p className="display mt-4 text-[clamp(3rem,10vw,9rem)] text-creme">
            Entre. <em className="text-cobre">Fique.</em>
          </p>
        </div>

        <div className="h-copy absolute inset-x-0 bottom-0 mx-auto max-w-[1500px] px-4 pb-24 md:px-8 md:pb-20">
          <p className="h-fadein eyebrow mb-6 flex items-center gap-3 text-areia">
            <span className="h-px w-10 bg-cobre" /> Studio Bartô — Perdizes, São Paulo
          </p>
          <h1 className="display text-[clamp(3.2rem,9.5vw,9.5rem)] text-creme">
            <span className="h-line -mb-[0.2em] -ml-[0.06em] block overflow-hidden pb-[0.28em] pl-[0.06em]">
              <span className="block">Barbearia,</span>
            </span>
            <span className="h-line -mb-[0.2em] -ml-[0.06em] block overflow-hidden pb-[0.28em] pl-[0.06em]">
              <span className="block italic text-areia">tatuagem</span>
            </span>
            <span className="h-line -mb-[0.2em] -ml-[0.06em] block overflow-hidden pb-[0.28em] pl-[0.06em]">
              <span className="block">
                &amp; laser<span className="text-cobre">.</span>
              </span>
            </span>
          </h1>
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="h-fadein max-w-md text-base leading-relaxed text-creme/80 md:text-lg">
              Um estúdio, três ofícios. Corte, arte na pele, remoção a laser e Peeling Hollywood —
              no mesmo endereço.
            </p>
            <div className="h-fadein flex flex-wrap gap-3">
              <button onClick={() => scrollToId("agendar")} className="btn btn-cobre">
                Agendar horário
              </button>
              <button onClick={() => scrollToId("barbearia")} className="btn btn-ghost">
                Entrar no estúdio
              </button>
            </div>
          </div>
        </div>

        <div className="h-cue pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-creme/70 md:flex">
          <span className="eyebrow !text-[0.62rem]">Role para entrar</span>
          <span className="block h-10 w-px origin-top animate-pulse bg-creme/60" />
        </div>
        <div className="h-fade pointer-events-none absolute inset-0 bg-carvao opacity-0" />
      </div>
    </section>
  );
}
