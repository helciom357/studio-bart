import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { LOGO_H, LOGO_RULE, LOGO_TAG, LOGO_W, LOGO_WORD } from "./logo-paths";

// Medidas de construção da logo (no sistema de coordenadas do SVG vetorizado).
const CAP = 172;
const BASE = 668;
const PAD_X = 160;
const PAD_Y = 220;
const VIEW = `${-PAD_X} ${-PAD_Y} ${LOGO_W + PAD_X * 2} ${LOGO_H + PAD_Y * 2}`;

const verticals = Array.from({ length: 31 }, (_, i) => -PAD_X + i * ((LOGO_W + PAD_X * 2) / 30));
const horizontals = Array.from({ length: 15 }, (_, i) => -PAD_Y + i * ((LOGO_H + PAD_Y * 2) / 14));
const nodes: [number, number][] = [
  [8, CAP],
  [8, BASE],
  [300, CAP],
  [565, CAP - 6],
  [345, BASE],
  [790, BASE],
  [830, CAP],
  [1150, CAP],
  [1150, BASE],
  [1360, CAP],
  [1630, CAP - 70],
  [1630, CAP + 2],
  [1630, BASE],
  [1385, 420],
  [1862, 420],
  [1200, 724],
];

export function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const counter = { v: 0 };
    const q = gsap.utils.selector(el);

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    if (reduce) {
      gsap.set(q(".l-word"), { fillOpacity: 1, strokeOpacity: 0 });
      tl.to(el, { autoAlpha: 0, duration: 0.4, delay: 0.4, onComplete: onDone });
      return () => {
        tl.kill();
      };
    }

    tl.to(counter, {
      v: 100,
      duration: 3.4,
      ease: "power1.inOut",
      onUpdate: () => setPct(Math.round(counter.v)),
    })
      .fromTo(
        q(".l-grid"),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.1, stagger: 0.012 },
        0,
      )
      .fromTo(
        q(".l-guide"),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1, stagger: 0.08 },
        0.35,
      )
      .fromTo(
        q(".l-node"),
        { scale: 0, transformOrigin: "50% 50%" },
        { scale: 1, duration: 0.4, stagger: 0.04, ease: "back.out(3)" },
        0.7,
      )
      .fromTo(
        q(".l-word"),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" },
        0.9,
      )
      .to(q(".l-word"), { fillOpacity: 1, duration: 0.7, ease: "power2.out" }, 2.2)
      .to(q(".l-word"), { strokeOpacity: 0, duration: 0.5 }, 2.6)
      .fromTo(
        q(".l-rule"),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, transformOrigin: "50% 50%" },
        2.1,
      )
      .fromTo(
        q(".l-tag"),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        2.5,
      )
      .to(q(".l-construct"), { opacity: 0, duration: 0.6 }, 3.1)
      .to(q(".l-meta"), { opacity: 0, duration: 0.3 }, 3.4)
      .to(q(".l-logo"), { scale: 0.86, duration: 0.8, ease: "power3.in" }, 3.5)
      .to(
        el,
        { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut", onComplete: onDone },
        3.75,
      );

    return () => {
      tl.kill();
    };
  }, [onDone]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-verde"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      role="status"
      aria-label="Carregando Studio Bartô"
    >
      <div className="l-logo w-[min(92vw,1100px)]">
        <svg viewBox={VIEW} className="h-auto w-full overflow-visible">
          <g className="l-construct" fill="none" stroke="#efe8dc" vectorEffect="non-scaling-stroke">
            {verticals.map((x, i) => (
              <line
                key={`v${i}`}
                className="l-grid"
                x1={x}
                x2={x}
                y1={-PAD_Y}
                y2={LOGO_H + PAD_Y}
                pathLength={1}
                strokeDasharray="1 1"
                strokeOpacity={0.09}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {horizontals.map((y, i) => (
              <line
                key={`h${i}`}
                className="l-grid"
                x1={-PAD_X}
                x2={LOGO_W + PAD_X}
                y1={y}
                y2={y}
                pathLength={1}
                strokeDasharray="1 1"
                strokeOpacity={0.09}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {[CAP, BASE, 11, LOGO_H - 60].map((y, i) => (
              <line
                key={`g${i}`}
                className="l-guide"
                x1={-PAD_X + 40}
                x2={LOGO_W + PAD_X - 40}
                y1={y}
                y2={y}
                pathLength={1}
                strokeDasharray="1 1"
                strokeOpacity={0.45}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <line
              className="l-guide"
              x1={565}
              y1={60}
              x2={300}
              y2={900}
              pathLength={1}
              strokeDasharray="1 1"
              strokeOpacity={0.35}
              vectorEffect="non-scaling-stroke"
            />
            <line
              className="l-guide"
              x1={565}
              y1={60}
              x2={860}
              y2={900}
              pathLength={1}
              strokeDasharray="1 1"
              strokeOpacity={0.35}
              vectorEffect="non-scaling-stroke"
            />
            <circle
              className="l-guide"
              cx={1628}
              cy={420}
              r={246}
              pathLength={1}
              strokeDasharray="1 1"
              strokeOpacity={0.4}
              vectorEffect="non-scaling-stroke"
            />
            <rect
              className="l-guide"
              x={1382}
              y={CAP}
              width={490}
              height={BASE - CAP}
              pathLength={1}
              strokeDasharray="1 1"
              strokeOpacity={0.3}
              vectorEffect="non-scaling-stroke"
            />
            {nodes.map(([x, y], i) => (
              <rect
                key={`n${i}`}
                className="l-node"
                x={x - 9}
                y={y - 9}
                width={18}
                height={18}
                fill="#5f725a"
                stroke="#efe8dc"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
          <path className="l-rule" d={LOGO_RULE} fillRule="evenodd" fill="#efe8dc" />
          <path
            className="l-word"
            d={LOGO_WORD}
            fillRule="evenodd"
            fill="#efe8dc"
            fillOpacity={0}
            stroke="#efe8dc"
            strokeWidth={1.4}
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray="1 1"
          />
          <path className="l-tag" d={LOGO_TAG} fillRule="evenodd" fill="#efe8dc" opacity={0} />
        </svg>
      </div>
      <div className="l-meta pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-creme/70 md:p-8">
        <span className="eyebrow">Barber · Tattoo · Laser</span>
        <span className="display text-5xl tabular-nums text-creme md:text-7xl">{pct}</span>
      </div>
      <div className="l-meta eyebrow pointer-events-none absolute left-5 top-5 text-creme/60 md:left-8 md:top-8">
        Perdizes — São Paulo
      </div>
    </div>
  );
}
