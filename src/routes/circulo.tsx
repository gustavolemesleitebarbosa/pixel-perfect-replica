import { createFileRoute, Link } from "@tanstack/react-router";
import { UserPlus, QrCode, ShieldQuestion, Lock } from "lucide-react";
import { Badge, Button, Card, Empty, Screen, SectionTitle } from "@/components/app/ui";
import { useApp } from "@/components/app/store";
import type { Contact } from "@/data/mocks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/circulo")({
  head: () => ({ meta: [
    { title: "Círculo — Doomsday" },
    { name: "description", content: "Pessoas que recebem seu “Estou seguro”, com mensagens cifradas." },
    { property: "og:title", content: "Círculo — Doomsday" },
    { property: "og:description", content: "Pessoas que recebem seu “Estou seguro”, com mensagens cifradas." },
  ] }),
  component: Circle,
});

function Circle() {
  const app = useApp();
  return (
    <Screen title="Círculo">
      <p className="text-muted-foreground"><Lock className="mr-1 inline size-4" />Pessoas que recebem seu “Estou seguro”. As mensagens são cifradas de ponta a ponta.</p>
      <Link to="/adicionar"><Button tone="info" size="lg" icon={UserPlus}>Adicionar pessoa</Button></Link>

      {app.pending && (
        <>
          <SectionTitle>Pedidos para entrar no seu círculo</SectionTitle>
          <Card tone="warn">
            <p className="text-lg font-bold">{app.pending.name}</p>
            <p className="flex gap-2 text-sm text-muted-foreground"><ShieldQuestion className="size-5 shrink-0 text-warn" />Só aceite se você conhece essa pessoa. Ela verá seus status.</p>
            <div className="flex gap-3">
              <Button tone="neutral" onClick={() => app.setPending(null)}>Recusar</Button>
              <Button tone="safe" onClick={() => { app.setContacts([...app.contacts, { id: "carlos", name: app.pending!.name, status: "none", ago: "", unread: 0 }]); app.setPending(null); }}>Aceitar</Button>
            </div>
          </Card>
        </>
      )}

      <SectionTitle aside={<span className="text-sm text-muted-foreground">{app.contacts.length}</span>}>Seu círculo</SectionTitle>
      {app.contacts.length === 0 ? (
        <Empty icon={QrCode} title="Seu círculo está vazio" text="Encontre a pessoa, toque em “Adicionar pessoa” e escaneiem o QR code um do outro. Funciona sem internet.">
          <Button tone="ghost" onClick={() => app.setContacts([])}>Ver exemplo</Button>
        </Empty>
      ) : (
        <div className="flex flex-col gap-3">{app.contacts.map((c) => <ContactItem key={c.id} c={c} />)}</div>
      )}
    </Screen>
  );
}

function ContactItem({ c }: { c: Contact }) {
  const initials = c.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <Link to="/conversa/$id" params={{ id: c.id }} className={cn("flex gap-3 rounded-2xl border bg-card p-4 active:bg-muted", c.status === "help" ? "border-danger" : "border-border")}>
      <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold", c.status === "safe" ? "bg-safe-soft text-safe" : c.status === "help" ? "bg-danger-soft text-danger" : "bg-muted text-muted-foreground")}>{initials}</div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2"><span className="truncate text-lg font-bold">{c.name}</span>{c.unread > 0 && <span className="flex size-7 items-center justify-center rounded-full bg-info text-sm font-bold text-info-foreground">{c.unread}</span>}</div>
        <div className="flex items-center gap-2">
          {c.status === "safe" && <Badge tone="safe">Está seguro</Badge>}
          {c.status === "help" && <Badge tone="danger">Precisa de ajuda</Badge>}
          {c.status === "none" && <span className="text-sm text-muted-foreground">Sem notícias ainda</span>}
          {c.ago && <span className="text-sm text-muted-foreground">{c.ago}</span>}
        </div>
        {c.note && <p className="text-base text-muted-foreground">“{c.note}”</p>}
      </div>
    </Link>
  );
}
