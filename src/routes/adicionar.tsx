import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Share2, Camera, ScanLine } from "lucide-react";
import { Button, Card, FakeQR, Field, Screen, Segmented } from "@/components/app/ui";
import { useApp } from "@/components/app/store";
import { mockUser } from "@/data/mocks";

export const Route = createFileRoute("/adicionar")({
  head: () => ({ meta: [
    { title: "Adicionar pessoa — Doomsday" },
    { name: "description", content: "Troque QR codes para adicionar alguém ao seu círculo." },
    { property: "og:title", content: "Adicionar pessoa — Doomsday" },
    { property: "og:description", content: "Troque QR codes para adicionar alguém ao seu círculo." },
  ] }),
  component: Add,
});

function Add() {
  const app = useApp();
  const nav = useNavigate();
  const [tab, setTab] = useState<"mine" | "scan">("mine");
  const [invite, setInvite] = useState("");
  return (
    <Screen title="Adicionar pessoa" back noTabs>
      <Segmented value={tab} onChange={setTab} options={[{ value: "mine", label: "Meu código" }, { value: "scan", label: "Escanear" }]} />
      {tab === "mine" ? (
        <div className="flex flex-col items-center gap-4">
          <FakeQR seed={mockUser.securityCode} />
          <p className="text-xl font-bold">{app.name || "Você"}</p>
          <div className="flex flex-col items-center gap-1"><span className="text-sm text-muted-foreground">Código de segurança</span><span className="font-mono text-xl font-bold tracking-wider">{mockUser.securityCode}</span></div>
          <p className="text-center text-muted-foreground">Fiquem lado a lado: um escaneia o QR do outro. Depois troquem.</p>
          <Button tone="neutral" icon={Share2}>Enviar convite por mensagem</Button>
        </div>
      ) : (
        <>
          <div className="relative flex aspect-square items-center justify-center rounded-2xl bg-frame">
            <div className="flex size-56 items-center justify-center rounded-2xl border-4 border-info"><ScanLine className="size-16 text-info" /></div>
            <span className="absolute bottom-4 flex items-center gap-2 text-sm text-muted-foreground"><Camera className="size-4" />Aponte para o QR da outra pessoa</span>
          </div>
          <Button tone="info" onClick={() => nav({ to: "/novo-contato" })}>Simular leitura</Button>
          <Card>
            <p className="font-bold">Ou cole um convite recebido</p>
            <Field placeholder="doomsday://convite/…" value={invite} onChange={(e) => setInvite(e.target.value)} />
            <Button tone="neutral" disabled={!invite.trim()} onClick={() => nav({ to: "/novo-contato" })}>Continuar</Button>
          </Card>
        </>
      )}
    </Screen>
  );
}
