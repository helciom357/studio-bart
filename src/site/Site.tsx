import { useCallback, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/500-italic.css";
import "@fontsource-variable/montserrat";
import { Loader } from "./Loader";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { TattooSection } from "./sections/Tattoo";
import { BarberSection } from "./sections/Barber";
import { LaserSection } from "./sections/Laser";
import { QuoteForm } from "./QuoteForm";
import { Footer, WhatsAppFab } from "./Footer";
import { initSmoothScroll, setScrollLocked } from "./scroll";

export function Site() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const stop = initSmoothScroll();
    setScrollLocked(true);
    return () => {
      stop();
      setScrollLocked(false);
    };
  }, []);

  // Revela elementos marcados com data-reveal conforme entram na tela.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    const triggers = ScrollTrigger.batch(els, {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: "expo.out",
          overwrite: true,
        }),
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener("load", refresh);
    };
  }, []);

  // O site é revelado enquanto a logo do loader voa até o menu.
  const reveal = useCallback(() => {
    setReady(true);
    setScrollLocked(false);
    ScrollTrigger.refresh();
  }, []);
  const done = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <Loader onReveal={reveal} onDone={done} />}
      <Header />
      <main>
        <Hero ready={ready} />
        <BarberSection />
        <TattooSection />
        <LaserSection />
        <QuoteForm />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
