import { useEffect, useRef } from "react";
import gsap from "gsap";
import { LOGO_H, LOGO_RULE, LOGO_W } from "./logo-paths";
import { LOGO_LETTERS, LOGO_TAG_CHARS } from "./logo-construction";

/*
 * Tela de carregamento em duas fases:
 * 1. o grid de construção se monta (malha fina, linhas-guia, eixos e caixas das letras);
 * 2. a logo é "desenhada" sobre ele: pontos de âncora, alças, contorno, preenchimento
 *    e, por fim, a logo completa com o filete e a assinatura.
 * Coordenadas no sistema do SVG vetorizado da logo (logo-paths.ts).
 */

const PAD_X = 170;
const PAD_Y = 230;
const X0 = -PAD_X;
const Y0 = -PAD_Y;
const VW = LOGO_W + PAD_X * 2;
const VH = LOGO_H + PAD_Y * 2;
const VIEW = `${X0} ${Y0} ${VW} ${VH}`;

const CREME = "#efe8dc";
const VERDE = "#5f725a";
const VERDE_ESCURO = "#3d5a41";

// Malha fina (como papel quadriculado)
const CELL = 46;
const cellX = Array.from({ length: Math.floor(VW / CELL) + 1 }, (_, i) => X0 + i * CELL);
const cellY = Array.from({ length: Math.floor(VH / CELL) + 1 }, (_, i) => Y0 + i * CELL);

// Linhas-guia horizontais: acento, ápice do A, altura das maiúsculas, meio, base e cauda do R.
const GUIDES_H = [107, 149, 168, 404, 662, 725];
// Linhas-guia verticais nas hastes e extremos de cada letra.
const GUIDES_V = [6, 97, 244, 353, 563, 836, 1002, 1060, 1196, 1282, 1405, 1377, 1620, 1862];

// Construção: diagonais do A, caixas das letras, elipse e eixo do O, centros dos bojos.
const A_APEX: [number, number] = [562.8, 149.2];
const diag = (foot: [number, number]) => {
  const vx = foot[0] - A_APEX[0];
  const vy = foot[1] - A_APEX[1];
  return [A_APEX[0] - vx * 0.2, A_APEX[1] - vy * 0.2, foot[0] + vx * 0.16, foot[1] + vy * 0.16] as const;
};
const DIAGONALS = [diag([348.9, 662]), diag([805, 662])];
const BOXES: [number, number, number, number][] = [
  [6, 168, 353, 662],
  [342, 149, 836, 662],
  [836, 168, 1245, 725],
  [1060, 168, 1405, 664],
  [1377, 162, 1862, 665],
  [1479, 107, 1709, 154],
];
const CROSSES: [number, number][] = [
  [170, 283],
  [162, 528],
  [919, 300],
  [1598, 414],
];

export function Loader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const setNum = (p: number) => {
      if (num.current) num.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
    };
    // A logo do menu fica escondida enquanto a logo do loader "voa" até ela.
    const headerLogo = document.querySelector<HTMLElement>("[data-header-logo]");
    if (headerLogo) gsap.set(headerLogo, { opacity: 0 });
    const showHeaderLogo = () => {
      if (headerLogo) gsap.set(headerLogo, { opacity: 1 });
    };
    let loaded = document.readyState === "complete";
    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener("load", onLoad);
    let flight: gsap.core.Tween | null = null;

    if (reduce) {
      gsap.set(q(".l-construct, .l-pts, .l-outline"), { opacity: 0 });
      gsap.set(q(".l-fill"), { fillOpacity: 1, fill: CREME });
      gsap.set(q(".l-tagchar"), { opacity: 1 });
      setNum(1);
      const t = gsap.to(el, {
        autoAlpha: 0,
        duration: 0.4,
        delay: 0.5,
        onStart: onReveal,
        onComplete: () => {
          showHeaderLogo();
          onDone();
        },
      });
      return () => {
        t.kill();
        window.removeEventListener("load", onLoad);
        showHeaderLogo();
      };
    }

    const DONE = 3.75; // momento em que a logo está completa
    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    tl.eventCallback("onUpdate", () => setNum(Math.min(1, tl.time() / DONE)));

    // ---- Fase 1: o grid se forma ----
    tl.fromTo(
      q(".l-cell-h"),
      { scaleX: 0, transformOrigin: "50% 50%" },
      { scaleX: 1, duration: 1.1, ease: "expo.out", stagger: { each: 0.018, from: "center" } },
      0,
    )
      .fromTo(
        q(".l-cell-v"),
        { scaleY: 0, transformOrigin: "50% 50%" },
        { scaleY: 1, duration: 1.1, ease: "expo.out", stagger: { each: 0.012, from: "center" } },
        0.05,
      )
      .fromTo(
        q(".l-guide-h"),
        { scaleX: 0, transformOrigin: "50% 50%" },
        { scaleX: 1, duration: 1, ease: "expo.inOut", stagger: { each: 0.07, from: "center" } },
        0.3,
      )
      .fromTo(
        q(".l-guide-v"),
        { scaleY: 0, transformOrigin: "50% 50%" },
        { scaleY: 1, duration: 0.9, ease: "expo.inOut", stagger: 0.035 },
        0.45,
      )
      .fromTo(
        q(".l-box, .l-ring"),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.06 },
        0.75,
      )
      .fromTo(
        q(".l-diag"),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.7, ease: "power2.out", stagger: 0.08 },
        0.85,
      )
      .fromTo(
        q(".l-cross"),
        { scale: 0, rotate: -90, transformOrigin: "50% 50%" },
        { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2.2)", stagger: 0.07 },
        1.0,
      );

    // ---- Fase 2: a logo é desenhada sobre o grid ----
    LOGO_LETTERS.forEach((_, i) => {
      const at = 1.2 + i * 0.16;
      tl.fromTo(
        q(`.l-letter-${i} .l-anchor`),
        { scale: 0, transformOrigin: "50% 50%" },
        { scale: 1, duration: 0.35, ease: "back.out(3)", stagger: 0.014 },
        at,
      )
        .fromTo(
          q(`.l-letter-${i} .l-handle`),
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power1.out", stagger: 0.02 },
          at + 0.15,
        )
        .fromTo(
          q(`.l-letter-${i} .l-outline`),
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.05, ease: "power2.inOut" },
          at + 0.12,
        )
        .fromTo(
          q(`.l-letter-${i} .l-fill`),
          { fillOpacity: 0 },
          { fillOpacity: 1, duration: 0.55, ease: "power2.out" },
          at + 0.85,
        );
    });

    // ---- Logo completa ----
    tl.to(q(".l-pts"), { opacity: 0, duration: 0.45, ease: "power1.out", stagger: 0.05 }, 2.75)
      .to(q(".l-fill"), { fill: CREME, duration: 0.6, ease: "power2.inOut", stagger: 0.05 }, 2.85)
      .to(q(".l-outline"), { strokeOpacity: 0, duration: 0.5 }, 2.95)
      .to(q(".l-construct"), { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 3.0)
      .fromTo(
        q(".l-rule"),
        { scaleX: 0, transformOrigin: "50% 50%" },
        { scaleX: 1, duration: 0.8, ease: "expo.out" },
        3.05,
      )
      .fromTo(
        q(".l-tagchar"),
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.018 },
        3.15,
      )
      .fromTo(
        q(".l-word"),
        { scale: 0.985, transformOrigin: "50% 50%" },
        { scale: 1, duration: 0.9, ease: "power2.out" },
        2.85,
      )
      // ---- Saída: espera a página carregar e leva a logo até o menu ----
      .call(
        () => {
          if (loaded) return;
          tl.pause();
          const resume = () => tl.play();
          window.addEventListener("load", resume, { once: true });
          window.setTimeout(resume, 4000);
        },
        [],
        DONE,
      )
      .to(q(".l-meta"), { opacity: 0, duration: 0.35 }, DONE + 0.1)
      .call(
        () => {
          const wrap = q(".l-logo")[0] as HTMLElement | undefined;
          const svg = q(".l-logo svg")[0] as SVGSVGElement | undefined;
          const target = headerLogo?.querySelector("svg") ?? null;
          if (!wrap || !svg) return;
          const w = wrap.getBoundingClientRect();
          const r = svg.getBoundingClientRect();
          const s = r.width / VW;
          // retângulo da logo (sem a margem do grid) na tela
          const lx = r.left + PAD_X * s;
          const ly = r.top + PAD_Y * s;
          const lw = LOGO_W * s;
          const lh = LOGO_H * s;
          const t = target?.getBoundingClientRect();
          const goal =
            t && t.width > 0
              ? { cx: t.left + t.width / 2, cy: t.top + t.height / 2, sc: t.width / lw }
              : { cx: lx + lw / 2, cy: ly + lh / 2 - 40, sc: 0.85 };
          flight = gsap.to(wrap, {
            x: goal.cx - (lx + lw / 2),
            y: goal.cy - (ly + lh / 2),
            scale: goal.sc,
            transformOrigin: `${lx + lw / 2 - w.left}px ${ly + lh / 2 - w.top}px`,
            duration: 1.15,
            ease: "expo.inOut",
          });
        },
        [],
        DONE + 0.15,
      )
      .call(onReveal, [], DONE + 0.35)
      .to(
        q(".l-bg"),
        { clipPath: "inset(0% 0% 100% 0%)", duration: 1.05, ease: "expo.inOut" },
        DONE + 0.35,
      )
      .call(
        () => {
          showHeaderLogo();
          onDone();
        },
        [],
        DONE + 1.42,
      );

    return () => {
      tl.kill();
      flight?.kill();
      window.removeEventListener("load", onLoad);
      showHeaderLogo();
    };
  }, [onReveal, onDone]);

  const hair = { vectorEffect: "non-scaling-stroke" as const, fill: "none", stroke: CREME };
  // Linhas desenhadas com dash (pathLength) não podem usar non-scaling-stroke.
  const drawn = { fill: "none", stroke: CREME };

  return (
    <div
      ref={root}
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
      role="status"
      aria-label="Carregando Studio Bartô"
    >
      <div className="l-bg pointer-events-auto absolute inset-0 bg-verde" style={{ clipPath: "inset(0% 0% 0% 0%)" }} />
      <div className="l-logo relative w-[min(94vw,1150px)] will-change-transform">
        <svg viewBox={VIEW} className="h-auto w-full overflow-visible" aria-hidden>
          {/* Fase 1: grid de construção */}
          <g className="l-construct">
            <g strokeOpacity={0.08} strokeWidth={1}>
              {cellX.map((x) => (
                <line key={`cx${x}`} className="l-cell-v" x1={x} x2={x} y1={Y0} y2={Y0 + VH} {...hair} />
              ))}
              {cellY.map((y) => (
                <line key={`cy${y}`} className="l-cell-h" x1={X0} x2={X0 + VW} y1={y} y2={y} {...hair} />
              ))}
            </g>
            <g strokeOpacity={0.5} strokeWidth={1} strokeDasharray="5 6">
              {GUIDES_H.map((y) => (
                <line key={`gh${y}`} className="l-guide-h" x1={X0 + 60} x2={X0 + VW - 60} y1={y} y2={y} {...hair} />
              ))}
            </g>
            <g strokeOpacity={0.3} strokeWidth={1} strokeDasharray="4 6">
              {GUIDES_V.map((x) => (
                <line key={`gv${x}`} className="l-guide-v" x1={x} x2={x} y1={20} y2={830} {...hair} />
              ))}
            </g>
            <g strokeOpacity={0.32}>
              {BOXES.map(([x0, y0, x1, y1]) => (
                <rect
                  key={`b${x0}-${y0}`}
                  className="l-box l-dash"
                  x={x0}
                  y={y0}
                  width={x1 - x0}
                  height={y1 - y0}
                  pathLength={1}
                  strokeDasharray="1 1"
                  {...drawn}
                />
              ))}
              <ellipse
                className="l-ring l-dash"
                cx={1619.5}
                cy={413.5}
                rx={262}
                ry={270}
                pathLength={1}
                strokeDasharray="1 1"
                {...drawn}
              />
              {DIAGONALS.map(([x1, y1, x2, y2]) => (
                <line
                  key={`d${x2}`}
                  className="l-diag l-dash"
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  pathLength={1}
                  strokeDasharray="1 1"
                  {...drawn}
                />
              ))}
              <line
                className="l-diag l-dash"
                x1={1668}
                y1={120}
                x2={1572}
                y2={712}
                pathLength={1}
                strokeDasharray="1 1"
                {...drawn}
              />
            </g>
            <g strokeOpacity={0.7} strokeWidth={1}>
              {CROSSES.map(([x, y]) => (
                <path key={`c${x}`} className="l-cross" d={`M${x - 16} ${y}H${x + 16}M${x} ${y - 16}V${y + 16}`} {...hair} />
              ))}
            </g>
          </g>

          {/* Fase 2: a logo se forma, letra por letra */}
          <g className="l-word">
            {LOGO_LETTERS.map((l, i) => (
              <g key={i} className={`l-letter-${i}`}>
                <path
                  className="l-fill"
                  d={l.d}
                  fillRule="evenodd"
                  fill={VERDE_ESCURO}
                  fillOpacity={0}
                />
                <path
                  className="l-outline l-dash l-dash--strong"
                  d={l.d}
                  fill="none"
                  stroke={CREME}
                  pathLength={1}
                  strokeDasharray="1 1"
                />
                <g className="l-pts">
                  {l.handles.map(([ax, ay, cx, cy], k) => (
                    <g key={`h${k}`} className="l-handle">
                      <line
                        x1={ax}
                        y1={ay}
                        x2={cx}
                        y2={cy}
                        stroke={CREME}
                        strokeOpacity={0.55}
                        strokeWidth={1}
                        strokeDasharray="2 3"
                        vectorEffect="non-scaling-stroke"
                      />
                      <circle cx={cx} cy={cy} r={5.5} fill="#24352a" />
                    </g>
                  ))}
                  {l.anchors.map(([x, y], k) => (
                    <rect
                      key={`a${k}`}
                      className="l-anchor"
                      x={x - 7}
                      y={y - 7}
                      width={14}
                      height={14}
                      fill={VERDE}
                      stroke={CREME}
                      strokeWidth={1.2}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </g>
              </g>
            ))}
          </g>

          <path className="l-rule" d={LOGO_RULE} fillRule="evenodd" fill={CREME} />
          <g fill={CREME}>
            {LOGO_TAG_CHARS.map((d, i) => (
              <path key={i} className="l-tagchar" d={d} fillRule="evenodd" opacity={0} />
            ))}
          </g>
        </svg>
      </div>
      <div className="l-meta pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-creme/70 md:p-8">
        <span className="eyebrow">Barber · Tattoo · Laser</span>
        <span ref={num} className="display text-5xl tabular-nums text-creme md:text-7xl">
          000
        </span>
      </div>
      <div className="l-meta eyebrow pointer-events-none absolute left-5 top-5 text-creme/60 md:left-8 md:top-8">
        Perdizes — São Paulo
      </div>
    </div>
  );
}
