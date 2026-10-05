import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  gsap.registerPlugin(ScrollTrigger);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export function setScrollLocked(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function scrollToY(top: number) {
  if (lenis) lenis.scrollTo(top, { duration: 1.4 });
  else window.scrollTo({ top, behavior: "smooth" });
}
