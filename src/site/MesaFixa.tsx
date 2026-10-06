import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ICONS } from "./Marquee";
import { requestService, type ServiceKey } from "./ui";
import { scrollToId } from "./scroll";

/**
 * Bancada fixa (foto) com objetos selecionáveis.
 * Cada objeto é um recorte PNG/WebP com fundo transparente posicionado exatamente
 * sobre a foto. Ao passar o mouse, o recorte "levanta" da mesa, o resto escurece e
 * aparece a moldura com pontos de âncora (como o grid da logo). O clique leva ao
 * trecho da seção correspondente.
 *
 * Coordenadas (x, y, w, h e pin) estão em pixels da foto original.
 */

export type MesaPiece = { src: string; x: number; y: number; w: number; h: number };

export type MesaObject = {
  key: string;
  label: string;
  title: string;
  description: string;
  /** id da seção de destino */
  target: string;
  /** quando definido, abre o formulário já com este serviço */
  service?: ServiceKey;
  icon: string;
  /** posição da etiqueta sobre a foto */
  pin: [number, number];
  pieces: MesaPiece[];
};

type Box = { x: number; y: number; w: number; h: number };

const unionBox = (pieces: MesaPiece[]): Box => {
  const x0 = Math.min(...pieces.map((p) => p.x));
  const y0 = Math.min(...pieces.map((p) => p.y));
  const x1 = Math.max(...pieces.map((p) => p.x + p.w));
  const y1 = Math.max(...pieces.map((p) => p.y + p.h));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
};

const pct = (a: number, b: number) => `${((a / b) * 100).toFixed(3)}%`;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });

export function MesaFixa({
  id,
  eyebrow,
  title,
  intro,
  image,
  alt,
  width,
  height,
  objects,
  bg,
  mobileZoom = 1,
  compactPins = false,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  objects: MesaObject[];
  bg: string;
  /** zoom da foto em telas pequenas (corta as laterais para os objetos ficarem maiores) */
  mobileZoom?: number;
  /** esconde o texto das etiquetas no celular (mesas largas) */
  compactPins?: boolean;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const hitMap = useRef<{ data: Uint8Array; w: number; h: number } | null>(null);
  const [active, setActive] = useState(-1);
  const [hover, setHover] = useState(false);
  const [touch, setTouch] = useState(false);

  const boxes = useMemo(() => objects.map((o) => unionBox(o.pieces)), [objects]);

  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  // Mapa de clique preciso, feito com a transparência dos recortes.
  useEffect(() => {
    let cancelled = false;
    const SC = 0.25;
    const MW = Math.round(width * SC);
    const MH = Math.round(height * SC);
    (async () => {
      try {
        const cv = document.createElement("canvas");
        cv.width = MW;
        cv.height = MH;
        const cx = cv.getContext("2d", { willReadFrequently: true });
        if (!cx) return;
        const out = new Uint8Array(MW * MH);
        for (let i = 0; i < objects.length; i++) {
          const o = objects[i];
          if (!o) continue;
          const imgs = await Promise.all(o.pieces.map((p) => loadImage(p.src)));
          cx.clearRect(0, 0, MW, MH);
          imgs.forEach((im, j) => {
            const p = o.pieces[j];
            if (p) cx.drawImage(im, p.x * SC, p.y * SC, p.w * SC, p.h * SC);
          });
          const d = cx.getImageData(0, 0, MW, MH).data;
          for (let k = 0; k < MW * MH; k++) {
            if ((d[k * 4 + 3] ?? 0) <= 60) continue;
            const px = k % MW;
            const py = (k / MW) | 0;
            for (let yy = -2; yy <= 2; yy++) {
              for (let xx = -2; xx <= 2; xx++) {
                const qx = px + xx;
                const qy = py + yy;
                if (qx < 0 || qy < 0 || qx >= MW || qy >= MH) continue;
                const q = qy * MW + qx;
                if (!out[q]) out[q] = i + 1;
              }
            }
          }
        }
        if (!cancelled) hitMap.current = { data: out, w: MW, h: MH };
      } catch {
        hitMap.current = null;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [objects, width, height]);

  const hit = (u: number, v: number) => {
    if (u < 0 || v < 0 || u > 1 || v > 1) return -1;
    const m = hitMap.current;
    if (m) {
      const k = Math.min(m.h - 1, Math.floor(v * m.h)) * m.w + Math.min(m.w - 1, Math.floor(u * m.w));
      return (m.data[k] ?? 0) - 1;
    }
    const X = u * width;
    const Y = v * height;
    return boxes.findIndex((b) => X >= b.x && X <= b.x + b.w && Y >= b.y && Y <= b.y + b.h);
  };

  const uv = (e: { clientX: number; clientY: number }) => {
    const r = stage.current?.getBoundingClientRect();
    if (!r) return [-1, -1] as const;
    return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height] as const;
  };

  const go = (i: number) => {
    const o = objects[i];
    if (!o) return;
    if (o.service) requestService(o.service);
    else scrollToId(o.target);
  };

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const [u, v] = uv(e);
    stage.current?.style.setProperty("--cx", `${(u * 100).toFixed(2)}%`);
    stage.current?.style.setProperty("--cy", `${(v * 100).toFixed(2)}%`);
    setHover(true);
    if ((e.target as HTMLElement).closest(".mesa-pin")) return;
    setActive(hit(u, v));
  };

  const onClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".mesa-pin")) return;
    const [u, v] = uv(e);
    const i = hit(u, v);
    if (i < 0) return;
    setActive(i);
    if (touch) window.setTimeout(() => go(i), 260);
    else go(i);
  };

  const cur = active >= 0 ? objects[active] : undefined;
  const box = active >= 0 ? boxes[active] : undefined;
  const pad = box ? Math.max(10, Math.min(box.w, box.h) * 0.06) : 0;

  const stageVars = {
    "--mz": String(mobileZoom),
    "--mesa-ar": `${width} / ${height}`,
  } as CSSProperties;

  return (
    <section id={id} className="relative pb-20 pt-28 md:pb-28 md:pt-36" style={{ background: bg }}>
      <header className="mx-auto grid max-w-[1400px] gap-8 px-4 pb-10 md:grid-cols-[1.3fr_0.7fr] md:items-end md:gap-16 md:px-8 md:pb-14">
        <div>
          <p data-reveal className="eyebrow text-areia">
            {eyebrow}
          </p>
          <h2 data-reveal className="display mt-4 text-[clamp(2.8rem,7vw,6.5rem)] text-creme">
            {title}
          </h2>
        </div>
        <div data-reveal className="flex flex-col items-start gap-5">
          <p className="max-w-md text-sm leading-relaxed text-creme/75 md:text-base">{intro}</p>
          <p className="flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-creme">
            <span className="mesa-mouse" aria-hidden />
            {touch ? "Toque em um objeto" : "Passe o mouse nos objetos"}
          </p>
        </div>
      </header>

      <div data-reveal className="mx-auto w-full max-w-[1520px] md:px-6">
        <div className="mesa-view" style={{ ["--mesa-bg" as string]: bg } as CSSProperties}>
          <div
            ref={stage}
            className={`mesa-stage ${active >= 0 ? "has-focus is-pointer" : ""} ${hover ? "is-hover" : ""} ${compactPins ? "is-compact" : ""}`}
            style={stageVars}
            onPointerMove={onMove}
            onPointerLeave={() => {
              setHover(false);
              setActive(-1);
            }}
            onClick={onClick}
          >
            <img
              className="mesa-base"
              src={image}
              alt={alt}
              width={width}
              height={height}
              draggable={false}
            />
            <div className="mesa-cross" aria-hidden>
              <span className="mesa-cx" />
              <span className="mesa-cy" />
            </div>

            {objects.map((o, i) => {
              const b = boxes[i];
              if (!b) return null;
              return (
                <div
                  key={o.key}
                  className={`mesa-obj ${active === i ? "is-focus" : ""}`}
                  style={{
                    left: pct(b.x, width),
                    top: pct(b.y, height),
                    width: pct(b.w, width),
                    height: pct(b.h, height),
                  }}
                  aria-hidden
                >
                  {o.pieces.map((p, j) => (
                    <img
                      key={p.src}
                      className="mesa-piece"
                      src={p.src}
                      alt=""
                      draggable={false}
                      style={
                        {
                          left: pct(p.x - b.x, b.w),
                          top: pct(p.y - b.y, b.h),
                          width: pct(p.w, b.w),
                          height: pct(p.h, b.h),
                          "--j": String(j),
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
              );
            })}

            <div
              className="mesa-frame"
              aria-hidden
              style={
                box
                  ? {
                      left: pct(box.x - pad, width),
                      top: pct(box.y - pad, height),
                      width: pct(box.w + pad * 2, width),
                      height: pct(box.h + pad * 2, height),
                    }
                  : undefined
              }
            >
              <span className="fr-l fr-t" />
              <span className="fr-l fr-b" />
              <span className="fr-l fr-lf" />
              <span className="fr-l fr-r" />
              <i />
              <i />
              <i />
              <i />
            </div>

            {objects.map((o, i) => (
              <button
                key={o.key}
                type="button"
                tabIndex={-1}
                aria-hidden
                className={`mesa-pin ${o.pin[0] / width > 0.72 ? "mesa-pin--l" : ""} ${active === i ? "is-focus" : ""}`}
                style={{ left: pct(o.pin[0], width), top: pct(o.pin[1], height) }}
                onPointerEnter={() => setActive(i)}
                onClick={() => go(i)}
              >
                <span className="mesa-pin__dot" />
                <span className="mesa-pin__txt">
                  <span>{o.label}</span>
                  <span className="mesa-pin__dest">{o.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <p className="mesa-readout px-4 md:px-1" aria-live="polite">
          {cur ? (
            <>
              <b>{cur.label}</b> · {cur.description}
            </>
          ) : touch ? (
            "Toque em um objeto da bancada para abrir."
          ) : (
            "Nenhum objeto selecionado."
          )}
        </p>

        <ul className="mesa-legend mx-4 md:mx-0">
          {objects.map((o, i) => (
            <li key={o.key}>
              <button
                type="button"
                className={active === i ? "is-focus" : ""}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(-1)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(-1)}
                onClick={() => go(i)}
              >
                <svg viewBox="0 0 64 64" aria-hidden>
                  {ICONS[o.icon]}
                </svg>
                <span className="mesa-legend__name">{o.label}</span>
                <span className="mesa-legend__dest">{o.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
