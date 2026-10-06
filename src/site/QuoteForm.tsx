import { useEffect, useRef, useState, type ReactNode } from "react";
import { ICONS } from "./Marquee";
import { FORM_EMAIL, whatsappLink } from "./config";
import { BARBERS, TATTOO_STYLES } from "./content";
import { SERVICE_EVENT, SectionTitle, type ServiceKey } from "./ui";
import { scrollToId } from "./scroll";

const SERVICES: { key: ServiceKey; label: string; icon: string; text: string }[] = [
  {
    key: "tatuagem",
    label: "Tatuagem",
    icon: "machine",
    text: "Projeto autoral, orçamento sem compromisso.",
  },
  {
    key: "barbearia",
    label: "Barbearia",
    icon: "scissors",
    text: "Corte, barba, sobrancelha e barboterapia.",
  },
  {
    key: "remocao",
    label: "Remoção a laser",
    icon: "laser",
    text: "Remoção total ou clareamento para cobertura.",
  },
  {
    key: "peeling",
    label: "Peeling Hollywood",
    icon: "sparkle",
    text: "Pele limpa, uniforme e com glow.",
  },
];

type Answers = Record<string, string | string[]>;

function Chips({
  name,
  options,
  value,
  onChange,
  multiple = false,
}: {
  name: string;
  options: string[];
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
  multiple?: boolean;
}) {
  const sel = Array.isArray(value) ? value : value ? [value] : [];
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = sel.includes(o);
        return (
          <label
            key={o}
            className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
              on
                ? "scale-[1.03] border-cobre bg-cobre text-creme"
                : "border-creme/20 text-creme/80 hover:border-creme/60 hover:text-creme"
            }`}
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={o}
              checked={on}
              onChange={() => {
                if (multiple) onChange(on ? sel.filter((x) => x !== o) : [...sel, o]);
                else onChange(o);
              }}
              className="sr-only"
            />
            {o}
          </label>
        );
      })}
    </div>
  );
}

function Q({
  n,
  title,
  hint,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-3 duration-500"
      style={{ animationDelay: `${n * 80}ms`, animationFillMode: "both" }}
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-areia">Pergunta {n}</p>
      <h4 className="display mt-1 text-2xl text-creme md:text-3xl">{title}</h4>
      {hint && <p className="mt-1 text-sm text-creme/55">{hint}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function FileField({ name, required, label }: { name: string; required?: boolean; label: string }) {
  const [files, setFiles] = useState<string[]>([]);
  return (
    <label className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-creme/25 p-8 text-center transition hover:border-cobre hover:bg-creme/[0.03]">
      <svg
        viewBox="0 0 24 24"
        className="h-8 w-8 text-areia transition-transform group-hover:-translate-y-1"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          d="M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-sm font-semibold text-creme">
        {files.length ? files.join(", ") : label}
      </span>
      <span className="text-xs text-creme/50">
        JPG ou PNG, até 10 MB{required ? " — obrigatório" : ""}
      </span>
      <input
        type="file"
        name={name}
        accept="image/*"
        multiple
        required={required}
        className="sr-only"
        onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))}
      />
    </label>
  );
}

const inputCls =
  "w-full rounded-2xl border border-creme/15 bg-creme/[0.04] px-5 py-4 text-creme placeholder:text-creme/35 outline-none transition focus:border-cobre focus:bg-creme/[0.07]";

export function QuoteForm() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<ServiceKey | null>(null);
  const [a, setA] = useState<Answers>({});
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const on = (e: Event) => {
      const s = (e as CustomEvent<ServiceKey>).detail;
      setService(s);
      setStep(1);
      setSent(false);
      scrollToId("agendar");
    };
    window.addEventListener(SERVICE_EVENT, on);
    return () => window.removeEventListener(SERVICE_EVENT, on);
  }, []);

  const set = (k: string) => (v: string | string[]) => {
    setError("");
    setA((p) => ({ ...p, [k]: v }));
  };

  const required: Record<ServiceKey, string[]> = {
    tatuagem: ["tat_area", "tat_tamanho", "tat_estilo"],
    barbearia: ["barb_servicos", "barb_profissional", "barb_periodo"],
    remocao: ["rem_area", "rem_tamanho", "rem_cor"],
    peeling: ["peel_objetivo", "peel_ja_fez"],
  };

  const next = () => {
    if (step === 0 && !service) return setError("Escolha um serviço para continuar.");
    if (step === 1 && service) {
      const missing = required[service].some((k) => {
        const v = a[k];
        return !v || (Array.isArray(v) && v.length === 0);
      });
      if (missing) return setError("Responda as perguntas para continuar.");
    }
    setError("");
    setStep((s) => s + 1);
  };

  const summary = () => {
    const label = SERVICES.find((s) => s.key === service)?.label ?? "";
    const lines = [`Olá! Vim pelo site do Studio Bartô.`, ``, `*Serviço:* ${label}`];
    Object.entries(a).forEach(([k, v]) => {
      const val = Array.isArray(v) ? v.join(", ") : v;
      if (!val || !k.startsWith(prefix(service))) return;
      lines.push(`*${LABELS[k] ?? k}:* ${val}`);
    });
    lines.push(``, `*Nome:* ${a["nome"] ?? ""}`, `*WhatsApp:* ${a["whatsapp"] ?? ""}`);
    if (a["email"]) lines.push(`*E-mail:* ${a["email"]}`);
    if (a["mensagem"]) lines.push(`*Mensagem:* ${a["mensagem"]}`);
    return lines.join("\n");
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!a["nome"] || !a["whatsapp"]) {
      e.preventDefault();
      setError("Preencha nome e WhatsApp.");
      return;
    }
    if (FORM_EMAIL) return; // envio nativo para o FormSubmit (com anexos)
    e.preventDefault();
    window.open(whatsappLink(summary()), "_blank", "noopener");
    setSent(true);
  };

  const total = 3;
  const svcLabel = SERVICES.find((s) => s.key === service)?.label;

  return (
    <section
      id="agendar"
      className="relative overflow-hidden bg-[#1c1d1a] px-4 py-28 md:px-8 md:py-36"
    >
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-verde/25 blur-[120px]" />
      <div className="relative mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionTitle
            eyebrow="Agendamento & orçamento"
            title={
              <>
                Conta pra gente <em className="text-cobre">o que você quer.</em>
              </>
            }
            text="Três passos rápidos. As perguntas mudam conforme o serviço — assim a gente já responde com o que você precisa."
          />
          <ol className="mt-10 space-y-3">
            {[
              "Serviço",
              svcLabel ? `Sobre ${svcLabel.toLowerCase()}` : "Detalhes",
              "Seus contatos",
            ].map((l, i) => (
              <li key={l} className="flex items-center gap-4">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 ${
                    step > i
                      ? "bg-verde text-creme"
                      : step === i
                        ? "bg-cobre text-creme"
                        : "border border-creme/20 text-creme/50"
                  }`}
                >
                  {step > i ? "✓" : i + 1}
                </span>
                <span
                  className={`text-sm font-semibold uppercase tracking-[0.16em] ${step === i ? "text-creme" : "text-creme/50"}`}
                >
                  {l}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <form
          ref={form}
          onSubmit={onSubmit}
          {...(FORM_EMAIL
            ? {
                action: `https://formsubmit.co/${FORM_EMAIL}`,
                method: "POST",
                encType: "multipart/form-data",
              }
            : {})}
          className="relative rounded-[32px] border border-creme/10 bg-carvao/80 p-6 backdrop-blur md:p-10"
        >
          <input
            type="hidden"
            name="_subject"
            value={`Novo contato pelo site — ${svcLabel ?? "Studio Bartô"}`}
          />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />

          <div className="mb-8 h-1 overflow-hidden rounded-full bg-creme/10">
            <div
              className="h-full rounded-full bg-cobre transition-all duration-700 ease-out"
              style={{ width: `${(Math.min(step + (sent ? 1 : 0), total) / total) * 100}%` }}
            />
          </div>

          {sent ? (
            <div className="py-10 text-center animate-in fade-in zoom-in-95 duration-700">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-verde text-4xl text-creme">
                ✓
              </span>
              <h3 className="display mt-6 text-5xl text-creme">Recebido!</h3>
              <p className="mx-auto mt-4 max-w-md text-creme/75">
                Abrimos o WhatsApp com as suas respostas — é só enviar a mensagem.
                {(service === "remocao" || service === "peeling" || service === "tatuagem") &&
                  " Lembre de anexar as fotos por lá também."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setStep(0);
                  setService(null);
                  setA({});
                }}
                className="btn btn-ghost mt-8"
              >
                Enviar outro pedido
              </button>
            </div>
          ) : (
            <>
              {/* Passo 1 — serviço */}
              <div className={step === 0 ? "block" : "hidden"}>
                <h3 className="display text-3xl text-creme md:text-4xl">
                  Qual serviço você procura?
                </h3>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {SERVICES.map((s) => (
                    <label
                      key={s.key}
                      className={`group relative flex cursor-pointer items-start gap-4 overflow-hidden rounded-2xl border p-5 transition-all duration-500 ${
                        service === s.key
                          ? "border-cobre bg-cobre/15"
                          : "border-creme/15 hover:-translate-y-1 hover:border-creme/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="servico"
                        value={s.label}
                        checked={service === s.key}
                        onChange={() => {
                          setService(s.key);
                          setError("");
                        }}
                        className="sr-only"
                      />
                      <svg
                        viewBox="0 0 64 64"
                        className={`h-12 w-12 shrink-0 transition-all duration-500 ${service === s.key ? "rotate-6 text-cobre" : "text-areia group-hover:rotate-6"}`}
                      >
                        {ICONS[s.icon]}
                      </svg>
                      <span>
                        <span className="block text-lg font-bold text-creme">{s.label}</span>
                        <span className="mt-1 block text-sm text-creme/60">{s.text}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Passo 2 — perguntas por serviço */}
              <div className={step === 1 ? "block" : "hidden"}>
                <fieldset
                  disabled={service !== "tatuagem"}
                  className={service === "tatuagem" ? "space-y-9" : "hidden"}
                >
                  <Q n={1} title="Onde você quer tatuar?">
                    <Chips
                      name="tat_area"
                      value={a["tat_area"]}
                      onChange={set("tat_area")}
                      options={[
                        "Braço",
                        "Antebraço",
                        "Mão",
                        "Perna",
                        "Panturrilha",
                        "Costas",
                        "Peito",
                        "Costela",
                        "Pescoço",
                        "Outro",
                      ]}
                    />
                  </Q>
                  <Q n={2} title="Qual o tamanho aproximado?">
                    <Chips
                      name="tat_tamanho"
                      value={a["tat_tamanho"]}
                      onChange={set("tat_tamanho")}
                      options={[
                        "Até 5 cm",
                        "5 a 10 cm",
                        "10 a 20 cm",
                        "Acima de 20 cm",
                        "Fechamento (manga, costas…)",
                      ]}
                    />
                  </Q>
                  <Q n={3} title="Qual estilo combina com a sua ideia?">
                    <Chips
                      name="tat_estilo"
                      value={a["tat_estilo"]}
                      onChange={set("tat_estilo")}
                      options={[...TATTOO_STYLES.map((s) => s.name), "Neo Traditional", "Não sei ainda"]}
                    />
                  </Q>
                  <Q n={4} title="Conte sua ideia" hint="Opcional — referências ajudam muito.">
                    <textarea
                      name="tat_ideia"
                      rows={3}
                      className={inputCls}
                      placeholder="Ex.: um leão em black & gray no antebraço…"
                      onChange={(e) => set("tat_ideia")(e.target.value)}
                    />
                    <div className="mt-3">
                      <FileField name="attachment" label="Anexar referências" />
                    </div>
                  </Q>
                </fieldset>

                <fieldset
                  disabled={service !== "barbearia"}
                  className={service === "barbearia" ? "space-y-9" : "hidden"}
                >
                  <Q n={1} title="O que você quer fazer?" hint="Pode marcar mais de um.">
                    <Chips
                      multiple
                      name="barb_servicos"
                      value={a["barb_servicos"]}
                      onChange={set("barb_servicos")}
                      options={[
                        "Corte na tesoura",
                        "Corte na máquina",
                        "Barba",
                        "Sobrancelha",
                        "Barboterapia",
                      ]}
                    />
                  </Q>
                  <Q n={2} title="Tem preferência de barbeiro?">
                    <Chips
                      name="barb_profissional"
                      value={a["barb_profissional"]}
                      onChange={set("barb_profissional")}
                      options={[...BARBERS.map((b) => b.name), "Sem preferência"]}
                    />
                  </Q>
                  <Q n={3} title="Qual o melhor período?">
                    <Chips
                      name="barb_periodo"
                      value={a["barb_periodo"]}
                      onChange={set("barb_periodo")}
                      options={["Manhã", "Tarde", "Noite", "Sábado"]}
                    />
                  </Q>
                </fieldset>

                <fieldset
                  disabled={service !== "remocao"}
                  className={service === "remocao" ? "space-y-9" : "hidden"}
                >
                  <Q n={1} title="Onde fica a tatuagem?">
                    <Chips
                      name="rem_area"
                      value={a["rem_area"]}
                      onChange={set("rem_area")}
                      options={[
                        "Braço",
                        "Antebraço",
                        "Mão",
                        "Perna",
                        "Costas",
                        "Peito",
                        "Pescoço",
                        "Rosto",
                        "Outro",
                      ]}
                    />
                  </Q>
                  <Q n={2} title="Qual o tamanho?">
                    <Chips
                      name="rem_tamanho"
                      value={a["rem_tamanho"]}
                      onChange={set("rem_tamanho")}
                      options={["Até 5 cm", "5 a 10 cm", "10 a 20 cm", "Acima de 20 cm"]}
                    />
                  </Q>
                  <Q n={3} title="A tatuagem tem cor?">
                    <Chips
                      name="rem_cor"
                      value={a["rem_cor"]}
                      onChange={set("rem_cor")}
                      options={["Só preta", "Colorida", "Preta e colorida", "Não sei"]}
                    />
                  </Q>
                  <Q
                    n={4}
                    title="Envie uma foto da tatuagem"
                    hint="Com boa luz, sem filtro. É com ela que fazemos a avaliação."
                  >
                    <FileField name="attachment" label="Selecionar foto" required={!!FORM_EMAIL} />
                  </Q>
                </fieldset>

                <fieldset
                  disabled={service !== "peeling"}
                  className={service === "peeling" ? "space-y-9" : "hidden"}
                >
                  <Q n={1} title="O que você quer melhorar?" hint="Pode marcar mais de um.">
                    <Chips
                      multiple
                      name="peel_objetivo"
                      value={a["peel_objetivo"]}
                      onChange={set("peel_objetivo")}
                      options={[
                        "Oleosidade",
                        "Poros dilatados",
                        "Manchas",
                        "Textura",
                        "Viço para um evento",
                      ]}
                    />
                  </Q>
                  <Q n={2} title="Já fez Peeling Hollywood antes?">
                    <Chips
                      name="peel_ja_fez"
                      value={a["peel_ja_fez"]}
                      onChange={set("peel_ja_fez")}
                      options={["Sim", "Não"]}
                    />
                  </Q>
                  <Q n={3} title="Quer enviar uma foto da pele?" hint="Opcional.">
                    <FileField name="attachment" label="Selecionar foto" />
                  </Q>
                </fieldset>
              </div>

              {/* Passo 3 — contato */}
              <div className={step === 2 ? "block space-y-4" : "hidden"}>
                <h3 className="display text-3xl text-creme md:text-4xl">Como falamos com você?</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    name="nome"
                    required
                    autoComplete="name"
                    placeholder="Seu nome"
                    className={inputCls}
                    onChange={(e) => set("nome")(e.target.value)}
                  />
                  <input
                    name="whatsapp"
                    required
                    type="tel"
                    autoComplete="tel"
                    placeholder="WhatsApp com DDD"
                    className={inputCls}
                    onChange={(e) => set("whatsapp")(e.target.value)}
                  />
                </div>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="E-mail (opcional)"
                  className={inputCls}
                  onChange={(e) => set("email")(e.target.value)}
                />
                <textarea
                  name="mensagem"
                  rows={3}
                  placeholder="Algo mais que a gente deva saber?"
                  className={inputCls}
                  onChange={(e) => set("mensagem")(e.target.value)}
                />
                <p className="text-xs text-creme/45">
                  Usamos seus dados apenas para responder este pedido.
                </p>
              </div>

              {error && (
                <p className="mt-6 rounded-xl bg-cobre/20 px-4 py-3 text-sm font-semibold text-creme">
                  {error}
                </p>
              )}

              <div className="mt-10 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className={`text-xs font-bold uppercase tracking-[0.18em] text-creme/60 transition hover:text-creme ${step === 0 ? "invisible" : ""}`}
                >
                  ← Voltar
                </button>
                {step < 2 ? (
                  <button type="button" onClick={next} className="btn btn-cobre">
                    Continuar →
                  </button>
                ) : (
                  <button type="submit" className="btn btn-cobre">
                    Enviar pedido →
                  </button>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

const prefix = (s: ServiceKey | null) =>
  s === "tatuagem" ? "tat_" : s === "barbearia" ? "barb_" : s === "remocao" ? "rem_" : "peel_";

const LABELS: Record<string, string> = {
  tat_area: "Área",
  tat_tamanho: "Tamanho",
  tat_estilo: "Estilo",
  tat_ideia: "Ideia",
  barb_servicos: "Serviços",
  barb_profissional: "Profissional",
  barb_periodo: "Período",
  rem_area: "Área",
  rem_tamanho: "Tamanho",
  rem_cor: "Cor",
  peel_objetivo: "Objetivo",
  peel_ja_fez: "Já fez antes",
};
