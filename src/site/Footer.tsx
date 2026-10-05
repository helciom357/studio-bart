import { Logo } from "./Logo";
import { CONTACT, whatsappLink } from "./config";
import { scrollToId } from "./scroll";

export function Footer() {
  return (
    <footer id="contato" className="relative overflow-hidden bg-verde px-4 pb-8 pt-24 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="eyebrow text-carvao/70">Endereço</p>
            <a
              href={CONTACT.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="display mt-3 block text-3xl text-creme transition hover:text-carvao"
            >
              {CONTACT.address}
            </a>
          </div>
          <div>
            <p className="eyebrow text-carvao/70">Horários</p>
            <ul className="mt-3 space-y-1">
              {CONTACT.hours.map((h) => (
                <li key={h.days} className="display text-3xl text-creme">
                  {h.days} <span className="text-carvao/70">· {h.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-carvao/70">Contato</p>
            <a
              href={whatsappLink("Olá! Vim pelo site do Studio Bartô.")}
              target="_blank"
              rel="noreferrer"
              className="display mt-3 block text-3xl text-creme transition hover:text-carvao"
            >
              WhatsApp {CONTACT.whatsappDisplay}
            </a>
            <a
              href={`https://instagram.com/${CONTACT.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="display mt-1 block text-3xl text-creme transition hover:text-carvao"
            >
              @{CONTACT.instagram}
            </a>
          </div>
        </div>

        <button
          onClick={() => scrollToId("inicio")}
          className="mt-24 block w-full text-carvao transition-colors duration-700 hover:text-creme"
          aria-label="Voltar ao topo"
        >
          <Logo className="h-auto w-full" />
        </button>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-carvao/20 pt-6 text-xs text-carvao/80 md:flex-row">
          <p>
            © {new Date().getFullYear()} Studio Bartô — Barber & Tattoo Studio. Todos os direitos
            reservados.
          </p>
          <p>Perdizes · São Paulo · SP</p>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Olá! Vim pelo site do Studio Bartô.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3"
    >
      <span className="hidden translate-x-2 rounded-full bg-creme px-4 py-2 text-xs font-bold text-carvao opacity-0 shadow-xl transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 md:block">
        Fale com a gente
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-cobre text-creme shadow-[0_10px_30px_-8px_rgba(154,71,41,.8)] transition-transform duration-500 group-hover:scale-110">
        <span
          className="absolute inset-0 rounded-full bg-cobre"
          style={{ animation: "pulse-ring 2.4s ease-out infinite" }}
        />
        <svg viewBox="0 0 24 24" className="relative h-7 w-7" fill="currentColor" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
        </svg>
      </span>
    </a>
  );
}
