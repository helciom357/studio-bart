import type { ReactNode } from "react";

/* Ilustrações em traço para as faixas que correm nas bordas das sessões. */
const s = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const ICONS: Record<string, ReactNode> = {
  machine: (
    <g {...s}>
      <rect x="22" y="6" width="20" height="30" rx="8" />
      <path d="M24 36h16l-2 12H26z" />
      <path d="M28 48h8l-3 8h-2z" />
      <path d="M32 56v6" />
      <path d="M42 14c10 0 14 6 16 14" />
      <path d="M26 16h12M26 22h12" />
    </g>
  ),
  ink: (
    <g {...s}>
      <path d="M24 8h16v8l4 6v34a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V22l4-6z" />
      <path d="M22 30h20v16H22z" />
      <path d="M32 34c-3 4-3 7 0 8 3-1 3-4 0-8z" />
    </g>
  ),
  caps: (
    <g {...s}>
      <path d="M12 30h14l-2 18h-10z" />
      <path d="M38 30h14l-2 18H40z" />
      <path d="M25 18h14l-2 18H27z" />
      <ellipse cx="32" cy="18" rx="7" ry="2" />
      <ellipse cx="19" cy="30" rx="7" ry="2" />
      <ellipse cx="45" cy="30" rx="7" ry="2" />
    </g>
  ),
  needle: (
    <g {...s}>
      <path d="M10 54 44 20" />
      <path d="M40 16l8 8 6-6-8-8z" />
      <path d="M14 46l4 4M20 40l4 4" />
    </g>
  ),
  rose: (
    <g {...s}>
      <path d="M32 30c-8 0-12-6-10-12 4 2 6 0 10-6 4 6 6 8 10 6 2 6-2 12-10 12z" />
      <path d="M32 30v28" />
      <path d="M32 44c-6-6-14-4-16 0 6 4 12 4 16 0zM32 50c6-6 12-4 14 0-6 3-10 3-14 0z" />
    </g>
  ),
  clipper: (
    <g {...s}>
      <rect x="20" y="16" width="24" height="42" rx="10" />
      <path d="M18 8h28v10H18z" />
      <path d="M22 8V4M27 8V4M32 8V4M37 8V4M42 8V4" />
      <circle cx="32" cy="34" r="3" />
    </g>
  ),
  scissors: (
    <g {...s}>
      <circle cx="18" cy="48" r="7" />
      <circle cx="46" cy="48" r="7" />
      <path d="M23 43 46 6M41 43 18 6" />
    </g>
  ),
  razor: (
    <g {...s}>
      <path d="M8 40h24l4-4h20v8H36l-4 4H8z" />
      <path d="M8 40c0-10 8-18 20-18h4v14" />
      <circle cx="32" cy="40" r="2" />
    </g>
  ),
  comb: (
    <g {...s}>
      <path d="M8 22h48v10H8z" />
      <path d="M12 32v18M18 32v18M24 32v18M30 32v18M36 32v14M42 32v14M48 32v14M54 32v14" />
    </g>
  ),
  dryer: (
    <g {...s}>
      <path d="M10 18h30a12 12 0 0 1 0 24H10z" />
      <path d="M40 22h14v16H40" />
      <path d="M22 42l-4 18h10l2-18" />
      <circle cx="40" cy="30" r="4" />
    </g>
  ),
  pole: (
    <g {...s}>
      <rect x="24" y="12" width="16" height="40" rx="4" />
      <path d="M24 20l16 10M24 32l16 10M24 44l12 8" />
      <path d="M22 8h20M22 56h20" />
    </g>
  ),
  brush: (
    <g {...s}>
      <path d="M22 8c0 14 4 20 10 22 6-2 10-8 10-22" />
      <path d="M26 30h12v6H26zM28 36h8l2 20H26z" />
    </g>
  ),
  laser: (
    <g {...s}>
      <path d="M8 26h28l8 6-8 6H8z" />
      <path d="M44 32h4" />
      <path d="M52 32h6M50 24l4-4M50 40l4 4" />
      <path d="M14 38c0 10 4 18 14 20" />
    </g>
  ),
  goggles: (
    <g {...s}>
      <circle cx="20" cy="32" r="10" />
      <circle cx="44" cy="32" r="10" />
      <path d="M30 32h4M10 32H4M54 32h6" />
    </g>
  ),
  dropper: (
    <g {...s}>
      <path d="M26 6h12v12H26z" />
      <path d="M24 18h16v8l-2 4v26a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V30l-2-4z" />
      <path d="M32 36v8" />
    </g>
  ),
  sparkle: (
    <g {...s}>
      <path d="M32 8c2 12 6 16 18 18-12 2-16 6-18 18-2-12-6-16-18-18 12-2 16-6 18-18z" />
      <path d="M50 44c1 5 3 7 8 8-5 1-7 3-8 8-1-5-3-7-8-8 5-1 7-3 8-8z" />
    </g>
  ),
  face: (
    <g {...s}>
      <path d="M20 12c0 28 4 40 12 44 8-4 12-16 12-44" />
      <path d="M20 12c6-6 18-6 24 0" />
      <circle cx="27" cy="28" r="1.5" />
      <circle cx="37" cy="28" r="1.5" />
      <path d="M28 42c2 2 6 2 8 0" />
    </g>
  ),
};

export function Marquee({
  icons,
  words,
  color,
  bg,
  reverse = false,
  duration = 45,
}: {
  icons: string[];
  words: string[];
  color: string;
  bg: string;
  reverse?: boolean;
  duration?: number;
}) {
  const seq = icons.flatMap((ic, i) => [
    { type: "icon" as const, v: ic },
    { type: "word" as const, v: words[i % words.length] ?? "" },
  ]);
  const row = [...seq, ...seq, ...seq];
  return (
    <div
      className="pause-on-hover relative overflow-hidden border-y py-5"
      style={{ background: bg, color, borderColor: `${color}33` }}
      aria-hidden
    >
      <div
        className={`flex w-max items-center gap-10 ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center gap-10">
            {row.map((it, i) =>
              it.type === "icon" ? (
                <svg
                  key={i}
                  viewBox="0 0 64 64"
                  className="h-12 w-12 shrink-0 transition-transform duration-500 hover:rotate-12 md:h-14 md:w-14"
                >
                  {ICONS[it.v]}
                </svg>
              ) : (
                <span key={i} className="display shrink-0 text-3xl italic md:text-4xl">
                  {it.v}
                </span>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
