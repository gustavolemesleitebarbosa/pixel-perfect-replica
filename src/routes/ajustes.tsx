import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound, Eye, AlertTriangle, Lock, Unlock, ShieldCheck, Locate, FlaskConical } from "lucide-react";
import { Badge, Button, Card, Field, Screen, Segmented, SectionTitle } from "@/components/app/ui";
import { useApp, type Mesh } from "@/components/app/store";
import { mockUser } from "@/data/mocks";

export const Route = createFileRoute("/ajustes")({
  head: () => ({ meta: [
    { title: "Ajustes — Doomsday" },
    { name: "description", content: "Nome, recuperação da identidade e modo autoridade." },
    { property: "og:title", content: "Ajustes — Doomsday" },
    { property: "og:description", content: "Nome, recuperação da identidade e modo autoridade." },
  ] }),
  component: Settings,
});

function Settings() {
  const app = useApp();
  const [name, setName] = useState(app.name);
  const [reveal, setReveal] = useState(false);
  const [key, setKey] = useState("");
  const [state, setState] = useState<"open" | "full" | "closed">("open");
  return (
    <Screen title="Ajustes" back noTabs>
      <Card tone="info" className="border-dashed">
        <p className="flex items-center gap-2 font-bold text-info"><FlaskConical className="size-5" />Demonstração</p>
        <span className="text-sm text-muted-foreground">Malha</span>
        <Segmented<Mesh> value={app.mesh} onChange={app.setMesh} options={[{ value: "off", label: "Desl." }, { value: "on", label: "Ativa" }, { value: "bt-off", label: "Sem BT" }, { value: "denied", label: "Negada" }]} />
        <span className="text-sm text-muted-foreground">Modo autoridade</span>
        <Segmented value={app.authority ? "on" : "off"} onChange={(v) => app.setAuthority(v === "on")} options={[{ value: "off", label: "Bloqueado" }, { value: "on", label: "Desbloqueado" }]} />
        <Button tone="ghost" onClick={() => { app.setName(""); setName(""); }}>Apagar nome (ver cartão inicial)</Button>
      </Card>

      <SectionTitle>Seu nome</SectionTitle>
      <div className="flex items-end gap-2"><div className="flex-1"><Field value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" /></div><Button tone="info" className="w-auto" onClick={() => app.setName(name.trim())}>Salvar</Button></div>
      <div className="flex flex-col"><span className="text-sm text-muted-foreground">Seu código de segurança</span><span className="font-mono text-lg font-bold tracking-wider">{mockUser.securityCode}</span></div>

      <SectionTitle>Recuperação da identidade</SectionTitle>
      <Card>
        <p className="text-muted-foreground">Não existe conta nem senha. Para usar sua identidade em outro aparelho, guarde este código.</p>
        {reveal ? (
          <>
            <div className="flex flex-wrap gap-2 rounded-xl bg-background p-3">{mockUser.recoveryCode.split("-").map((b, i) => <span key={i} className="rounded-md bg-muted px-2 py-1 font-mono text-lg font-bold">{b}</span>)}</div>
            <p className="flex gap-2 text-sm text-warn"><AlertTriangle className="size-5 shrink-0" />Quem tiver este código pode se passar por você. Anote no papel e não envie a ninguém.</p>
            <Button tone="neutral" onClick={() => setReveal(false)}>Ocultar</Button>
          </>
        ) : <Button tone="neutral" icon={Eye} onClick={() => setReveal(true)}>Mostrar código de recuperação</Button>}
        <Field label="Restaurar de outro aparelho" placeholder="Cole o código aqui" />
        <Button tone="outline" icon={KeyRound}>Restaurar identidade</Button>
      </Card>

      <SectionTitle>Modo autoridade</SectionTitle>
      {!app.authority ? (
        <Card>
          <p className="flex items-center gap-2 font-bold"><Lock className="size-5" />Para Defesa Civil e abrigos</p>
          <Field placeholder="Chave de autoridade" value={key} onChange={(e) => setKey(e.target.value)} />
          <Button tone="info" icon={Unlock} disabled={!key.trim()} onClick={() => app.setAuthority(true)}>Desbloquear</Button>
        </Card>
      ) : (
        <>
          <Card tone="info">
            <Badge tone="info" icon={ShieldCheck}>Publicando como: Defesa Civil</Badge>
            <p className="text-lg font-bold">Novo alerta oficial</p>
            <Field label="Título" placeholder="Ex.: Evacuação imediata" />
            <label className="flex flex-col gap-1.5"><span className="text-sm font-bold text-muted-foreground">Texto</span><textarea rows={3} className="rounded-xl border-2 border-input bg-background p-4 text-base focus:border-ring focus:outline-none" /></label>
            <Button tone="info">Publicar alerta</Button>
          </Card>
          <Card tone="info">
            <p className="text-lg font-bold">Abrigo</p>
            <Field label="Nome" /><Field label="Endereço" />
            <div className="flex gap-2"><Field label="Vagas" inputMode="numeric" /><Field label="Capacidade" inputMode="numeric" /></div>
            <span className="text-sm font-bold text-muted-foreground">Situação</span>
            <Segmented value={state} onChange={setState} options={[{ value: "open", label: "Aberto" }, { value: "full", label: "Lotado" }, { value: "closed", label: "Fechado" }]} />
            <Field label="Observações" />
            <Button tone="neutral" icon={Locate}>Usar a localização deste aparelho</Button>
            <Button tone="info">Publicar abrigo</Button>
          </Card>
        </>
      )}

      <SectionTitle>Diagnóstico da malha</SectionTitle>
      <pre className="whitespace-pre-wrap rounded-xl bg-card p-3 font-mono text-xs text-muted-foreground">{`estado: ${app.mesh}\nBLE adv: ${app.mesh === "on" ? "ok" : "parado"} · scan: 4 pares\nfila: 17 msgs (2,1 KB) · repassadas: 63\núltimo par: há 38 s · bateria: 41%`}</pre>
    </Screen>
  );
}
