import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { Table, BrandSheet } from "./models";
import { scrollToId, scrollToY } from "../scroll";

export type View = { azimuth: number; elevation: number; distance: number };

export type TableItem = {
  key: string;
  label: string;
  title: string;
  description: string;
  cta: string;
  target: string;
  position: [number, number, number];
  labelHeight: number;
  view: View;
  node: ReactNode;
};

export type TableTheme = {
  bg: string;
  top: string;
  leg: string;
  mat?: string;
  accent: string;
  pill: string;
  pillText: string;
  sheet: { position: [number, number, number]; rotation: number };
};

const OVERVIEW_IN: View = { azimuth: -0.15, elevation: 0.72, distance: 12.5 };
const OVERVIEW_OUT: View = { azimuth: 0.9, elevation: 0.95, distance: 13.5 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

type Stop = View & { target: THREE.Vector3 };

function CameraRig({ stops, progress }: { stops: Stop[]; progress: React.RefObject<number> }) {
  const { camera, pointer, size } = useThree();
  // Telas estreitas precisam de mais distância para caber o objeto.
  const distScale = size.width < 768 ? 1.85 : 1.2;
  const look = useRef(new THREE.Vector3());
  const want = useMemo(() => ({ pos: new THREE.Vector3(), target: new THREE.Vector3() }), []);

  useFrame((_, dt) => {
    const p = progress.current ?? 0;
    const n = stops.length - 1;
    const t = p * n;
    const i = Math.min(n - 1, Math.floor(t));
    const a = stops[i];
    const b = stops[i + 1];
    if (!a || !b) return;
    const f = smoother(clamp01((t - i - 0.18) / 0.64));
    const az = THREE.MathUtils.lerp(a.azimuth, b.azimuth, f) + pointer.x * 0.06;
    const el = THREE.MathUtils.lerp(a.elevation, b.elevation, f) + pointer.y * 0.03;
    const dist = THREE.MathUtils.lerp(a.distance, b.distance, f) * distScale;
    want.target.lerpVectors(a.target, b.target, f);
    want.pos.set(
      want.target.x + dist * Math.cos(el) * Math.sin(az),
      want.target.y + dist * Math.sin(el),
      want.target.z + dist * Math.cos(el) * Math.cos(az),
    );
    const k = 1 - Math.exp(-dt * 4);
    camera.position.lerp(want.pos, k);
    look.current.lerp(want.target, k);
    camera.lookAt(look.current);
  });
  return null;
}

function Hotspot({ item, active, accent }: { item: TableItem; active: boolean; accent: string }) {
  const [x, y, z] = item.position;
  return (
    <Html position={[x, y + item.labelHeight, z]} center zIndexRange={[20, 0]}>
      <button
        onClick={() => scrollToId(item.target)}
        className={`group flex items-center gap-2 whitespace-nowrap transition-all duration-500 ${active ? "scale-110" : "scale-90 opacity-80"}`}
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-creme text-carvao shadow-lg">
          {active && (
            <span
              className="absolute inset-0 rounded-full"
              style={{ background: accent, animation: "pulse-ring 1.6s ease-out infinite" }}
            />
          )}
          <span className="relative text-xl leading-none transition-transform duration-300 group-hover:rotate-90">
            +
          </span>
        </span>
        <span
          className="rounded-full px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-creme shadow-lg transition-colors"
          style={{ background: active ? accent : "rgba(37,38,34,0.75)" }}
        >
          {item.label}
        </span>
      </button>
    </Html>
  );
}

function Scene({
  theme,
  items,
  progress,
  active,
  decor,
}: {
  theme: TableTheme;
  items: TableItem[];
  progress: React.RefObject<number>;
  active: number;
  decor?: ReactNode;
}) {
  const stops = useMemo<Stop[]>(
    () => [
      { ...OVERVIEW_IN, target: new THREE.Vector3(0, 0, 0) },
      ...items.map((it) => ({
        ...it.view,
        target: new THREE.Vector3(it.position[0], it.position[1] + 0.3, it.position[2]),
      })),
      { ...OVERVIEW_OUT, target: new THREE.Vector3(0, 0, 0) },
    ],
    [items],
  );
  return (
    <>
      <color attach="background" args={[theme.bg]} />
      <fog attach="fog" args={[theme.bg, 14, 30]} />
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#efe8dc", theme.bg, 0.5]} />
      <spotLight
        position={[2, 9, 4]}
        angle={0.55}
        penumbra={0.8}
        intensity={140}
        color="#ffe2bf"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0004}
      />
      <pointLight position={[-5, 2, -3]} intensity={18} color={theme.accent} />
      <directionalLight position={[-4, 5, 6]} intensity={0.6} />
      <group>
        <Table top={theme.top} leg={theme.leg} {...(theme.mat ? { mat: theme.mat } : {})} />
        <BrandSheet position={theme.sheet.position} rotation={theme.sheet.rotation} />
        {decor}
        {items.map((it) => (
          <group key={it.key} position={it.position}>
            {it.node}
          </group>
        ))}
        {items.map((it, i) => (
          <Hotspot key={it.key} item={it} active={active === i} accent={theme.accent} />
        ))}
      </group>
      <CameraRig stops={stops} progress={progress} />
    </>
  );
}

export function TableScene({
  id,
  eyebrow,
  title,
  intro,
  theme,
  items,
  decor,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro: string;
  theme: TableTheme;
  items: TableItem[];
  decor?: ReactNode;
}) {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const stopsCount = items.length + 2;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), {
      rootMargin: "200px 0px",
    });
    io.observe(el);
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => {
        progress.current = s.progress;
        const k = Math.round(s.progress * (stopsCount - 1));
        setActive(k >= 1 && k <= items.length ? k - 1 : -1);
      },
    });
    return () => {
      io.disconnect();
      st.kill();
    };
  }, [items.length, stopsCount]);

  const jumpTo = (k: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.offsetTop + (k / (stopsCount - 1)) * (el.offsetHeight - window.innerHeight);
    scrollToY(top);
  };

  const item = active >= 0 ? items[active] : undefined;

  return (
    <section
      id={id}
      ref={section}
      className="relative"
      style={{ height: `${stopsCount * 85 + 40}vh`, background: theme.bg }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          {mounted && (
            <Canvas
              shadows
              dpr={[1, 1.75]}
              frameloop={visible ? "always" : "never"}
              camera={{ position: [0, 8, 10], fov: 34, near: 0.1, far: 60 }}
              gl={{ antialias: true, powerPreference: "high-performance" }}
            >
              <Suspense fallback={null}>
                <Scene
                  theme={theme}
                  items={items}
                  progress={progress}
                  active={active}
                  decor={decor}
                />
              </Suspense>
            </Canvas>
          )}
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
          style={{
            background: `linear-gradient(to top, ${theme.bg} 8%, ${theme.bg}cc 35%, transparent)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(120% 90% at 50% 45%, transparent 55%, ${theme.bg} 100%)`,
          }}
        />

        {/* Intro da mesa */}
        <div
          className={`pointer-events-none absolute left-0 top-0 max-w-[620px] px-4 pt-24 transition-all duration-700 md:px-8 md:pt-28 ${
            active === -1 ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
          }`}
        >
          <p className="eyebrow text-areia">{eyebrow}</p>
          <h2 className="display mt-4 text-[clamp(2.8rem,7vw,6.5rem)] text-creme">{title}</h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-creme/75 md:text-base">
            {intro}
          </p>
        </div>

        {/* Elemento em foco */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-8 md:px-8 md:pb-12">
          <div className="mx-auto flex max-w-[1500px] items-end justify-between gap-6">
            <div
              key={item?.key ?? "none"}
              className={`pointer-events-auto max-w-xl transition-all duration-700 ${item ? "opacity-100" : "translate-y-8 opacity-0"}`}
            >
              {item && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <span className="pill" style={{ background: theme.pill, color: theme.pillText }}>
                    {item.label}
                  </span>
                  <h3 className="display mt-3 text-[clamp(2.4rem,6vw,5.5rem)] text-creme">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-creme/80 md:text-base">
                    {item.description}
                  </p>
                  <button onClick={() => scrollToId(item.target)} className="btn btn-cobre mt-6">
                    {item.cta} <span aria-hidden>→</span>
                  </button>
                </div>
              )}
            </div>
            <ol className="pointer-events-auto hidden flex-col items-end gap-3 md:flex">
              {items.map((it, i) => (
                <li key={it.key}>
                  <button
                    onClick={() => jumpTo(i + 1)}
                    className="group flex items-center gap-3 text-right"
                  >
                    <span
                      className={`text-[0.68rem] font-bold uppercase tracking-[0.18em] transition ${active === i ? "text-creme" : "text-creme/40 group-hover:text-creme/80"}`}
                    >
                      {it.label}
                    </span>
                    <span
                      className={`block h-px transition-all duration-500 ${active === i ? "w-12" : "w-5 bg-creme/40"}`}
                      style={active === i ? { background: theme.accent } : undefined}
                    />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
