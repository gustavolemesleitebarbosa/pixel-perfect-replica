import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, UserPlus } from "lucide-react";
import { Button, Card, Field, Screen } from "@/components/app/ui";
import { useApp } from "@/components/app/store";

export const Route = createFileRoute("/novo-contato")({
  head: () => ({ meta: [
    { title: "Novo contato — Doomsday" },
    { name: "description", content: "Confira o código de segurança e adicione ao círculo." },
    { property: "og:title", content: "Novo contato — Doomsday" },
    { property: "og:description", content: "Confira o código de segurança e adicione ao círculo." },
  ] }),
  component: NewContact,
});

function NewContact() {
  const app = useApp();
  const nav = useNavigate();
  const [name, setName] = useState("Beatriz");
  return (
    <Screen title="Novo contato" back noTabs>
      <Field label="Nome no seu círculo" value={name} onChange={(e) => setName(e.target.value)} />
      <Card tone="info" className="items-center py-6">
        <ShieldCheck className="size-10 text-info" />
        <span className="text-sm text-muted-foreground">Código de segurança</span>
        <span className="font-mono text-2xl font-bold tracking-wider">b3f0 9d21 7ac4 e650</span>
        <p className="text-center text-muted-foreground">Confira se é o mesmo código que aparece no aparelho da pessoa.</p>
      </Card>
      <Button tone="safe" size="lg" icon={UserPlus} disabled={!name.trim()} onClick={() => { app.setContacts([...app.contacts, { id: `c${Date.now()}`, name: name.trim(), status: "none", ago: "", unread: 0 }]); nav({ to: "/circulo" }); }}>Adicionar ao círculo</Button>
    </Screen>
  );
}
