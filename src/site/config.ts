// Dados de contato e integrações do site. Edite aqui para atualizar o site inteiro.

export const CONTACT = {
  name: "Studio Bartô",
  tagline: "Barber & Tattoo Studio",
  address: "Rua Desembargador do Vale, 100 — Perdizes, São Paulo — SP",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Rua+Desembargador+do+Vale,+100+-+Perdizes,+S%C3%A3o+Paulo+-+SP",
  hours: [
    { days: "Segunda a sexta", time: "10h às 20h" },
    { days: "Sábado", time: "9h às 19h" },
  ],
  whatsappDisplay: "(11) 91439-4565",
  whatsappNumber: "5511914394565",
  instagram: "bartocabeloebarba",
} as const;

/**
 * E-mail que recebe o formulário. Enquanto estiver vazio, o formulário
 * monta a mensagem e abre o WhatsApp do estúdio com as respostas.
 * Quando o e-mail for definido, as respostas (e fotos anexadas) são
 * enviadas pelo serviço FormSubmit (https://formsubmit.co) para ele.
 */
export const FORM_EMAIL = "";

export const whatsappLink = (text?: string) =>
  `https://wa.me/${CONTACT.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
