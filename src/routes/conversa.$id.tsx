import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, CheckCircle2, AlertTriangle, MapPin, Route as RouteIcon } from "lucide-react";
import { Empty, Screen } from "@/components/app/ui";
import { useApp } from "@/components/app/store";
import type { Msg } from "@/data/mocks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/conversa/$id")({
  head: () => ({ meta: [
    { title: "Conversa — Doomsday" },
    { name: "description", content: "Mensagens que viajam de celular em celular até chegar." },
    { property: "og:title", content: "Conversa — Doomsday" },
    { property: "og:description", content: "Mensagens que viajam de celular em celular até chegar." },
  ] }),
  component: Conversation,
});

function Conversation() {
  const { id } = Route.useParams();
  const app = useApp();
  const contact = app.contacts.find((c) => c.id === id);
  const msgs = app.convos[id] ?? [];
  const [text, setText] = useState("");
  const submit = () => {
    if (!text.trim()) return;
    const now = new Date();
    app.send(id, { id: String(Date.now()), dir: "out", kind: "text", text: text.trim(), time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`, receipt: "mesh" });
    setText("");
  };
  return (
    <Screen title={contact?.name ?? "Conversa"} back noTabs footer={
      <div className="flex gap-2 border-t border-border bg-card p-3">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Escreva uma mensagem" className="min-h-12 flex-1 rounded-xl border-2 border-input bg-background px-4 text-base focus:border-ring focus:outline-none" />
        <button aria-label="Enviar" onClick={submit} className="flex size-12 items-center justify-center rounded-xl bg-info text-info-foreground"><Send className="size-5" /></button>
      </div>
    }>
      {msgs.length === 0 ? (
        <Empty icon={RouteIcon} title="Nenhuma mensagem ainda" text="O que você enviar fica guardado e segue de celular em celular até chegar." />
      ) : msgs.map((m) => <Bubble key={m.id} m={m} />)}
    </Screen>
  );
}

function Bubble({ m }: { m: Msg }) {
  const out = m.dir === "out";
  const receipt = out && m.receipt && <span className={cn("text-xs", m.receipt === "delivered" ? "text-info" : "text-muted-foreground")}>{m.receipt === "delivered" ? "✓✓ entregue" : "✓ na malha"}</span>;
  if (m.kind === "text") return (
    <div className={cn("flex max-w-[80%] flex-col gap-1 rounded-2xl px-4 py-3", out ? "self-end rounded-br-sm bg-accent" : "self-start rounded-bl-sm bg-card")}>
      <p className="text-base">{m.text}</p>
      <div className="flex justify-end gap-2 text-xs text-muted-foreground"><span>{m.time}</span>{receipt}</div>
    </div>
  );
  const safe = m.kind === "safe";
  return (
    <div className={cn("flex max-w-[85%] flex-col gap-2 rounded-2xl border-2 p-4", out ? "self-end" : "self-start", safe ? "border-safe bg-safe-soft" : "border-danger bg-danger-soft")}>
      <p className={cn("flex items-center gap-2 text-lg font-bold", safe ? "text-safe" : "text-danger")}>{safe ? <CheckCircle2 className="size-6" /> : <AlertTriangle className="size-6" />}{safe ? "ESTOU SEGURO" : "PRECISO DE AJUDA"}</p>
      {m.note && <p className="text-base">{m.note}</p>}
      <button className="flex min-h-10 items-center gap-1 self-start font-bold text-info underline underline-offset-4"><MapPin className="size-4" />Ver localização</button>
      <div className="flex justify-end gap-2 text-xs text-muted-foreground"><span>{m.time}</span>{receipt}</div>
    </div>
  );
}
