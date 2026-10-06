import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Logo } from "./Logo";
import { scrollToId } from "./scroll";
import { CONTACT } from "./config";

const LINKS = [
  { id: "barbearia", label: "Barbearia" },
  { id: "tatuagem", label: "Tatuagem" },
  { id: "laser", label: "Laser & Peeling" },
  { id: "profissionais", label: "Equipe" },
  { id: "contato", label: "Contato" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setHidden(y > last && y > 400);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = menu.current;
    if (!el) return;
    if (open) {
      gsap.set(el, { display: "flex" });
      gsap.fromTo(
        el,
        { clipPath: "circle(0% at 100% 0%)" },
        { clipPath: "circle(150% at 100% 0%)", duration: 0.8, ease: "expo.out" },
      );
      gsap.fromTo(
        el.querySelectorAll("[data-m]"),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.8, stagger: 0.06, ease: "expo.out", delay: 0.1 },
      );
    } else {
      gsap.to(el, {
        clipPath: "circle(0% at 100% 0%)",
        duration: 0.5,
        ease: "expo.in",
        onComplete: () => {
          gsap.set(el, { display: "none" });
        },
      });
    }
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,backdrop-filter] duration-500 ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${scrolled ? "bg-carvao/75 backdrop-blur-xl" : "bg-gradient-to-b from-carvao/70 to-transparent"}`}
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-4 py-3 md:px-8 md:py-4">
          <button onClick={() => go("inicio")} className="text-creme" aria-label="Voltar ao início">
            <Logo className="h-9 w-auto md:h-11" />
          </button>
          <nav className="hidden items-center gap-1 rounded-full border border-creme/15 bg-musgo/40 p-1 backdrop-blur-md lg:flex">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="rounded-full px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-creme/80 transition hover:bg-verde hover:text-creme"
              >
                {l.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => go("agendar")}
              className="btn btn-cobre hidden !px-5 !py-3 sm:inline-flex"
            >
              Agendar
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="relative z-[60] flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full bg-verde lg:hidden"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
            >
              <span
                className={`h-0.5 w-5 bg-creme transition ${open ? "translate-y-1 rotate-45" : ""}`}
              />
              <span
                className={`h-0.5 w-5 bg-creme transition ${open ? "-translate-y-1 -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menu}
        className="fixed inset-0 z-[55] hidden flex-col justify-between bg-verde px-6 pb-8 pt-24 lg:hidden"
        style={{ clipPath: "circle(0% at 100% 0%)" }}
      >
        <nav className="flex flex-col gap-1">
          {[{ id: "inicio", label: "Início" }, ...LINKS, { id: "agendar", label: "Agendar" }].map(
            (l) => (
              <div key={l.id} className="overflow-hidden">
                <button
                  data-m
                  onClick={() => go(l.id)}
                  className="display block py-1 text-left text-5xl text-creme"
                >
                  {l.label}
                </button>
              </div>
            ),
          )}
        </nav>
        <div className="space-y-1 text-sm text-creme/80">
          <p>{CONTACT.address}</p>
          <p>WhatsApp {CONTACT.whatsappDisplay}</p>
        </div>
      </div>
    </>
  );
}
