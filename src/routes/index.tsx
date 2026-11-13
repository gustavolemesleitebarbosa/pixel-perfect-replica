import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, Radio, BluetoothOff, ShieldAlert, CheckCircle2, Circle, HandHelping, Siren, MessageSquareText, Sun, Power, Check } from "lucide-react";
import { AlertCard, Badge, Button, Card, Dialog, Field, Screen, SectionTitle, Stat } from "@/components/app/ui";
import { useApp } from "@/components/app/store";
import { mockAlert } from "@/data/mocks";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Início — Doomsday" },
    { name: "description", content: "Avise sua família que está seguro, mesmo sem internet." },
    { property: "og:title", content: "Início — Doomsday" },
    { property: "og:description", content: "Avise sua família que está seguro, mesmo sem internet." },
  ] }),
  component: Home,
});

function Home() {
  const app = useApp();
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState("");
  const [sos, setSos] = useState(false);
  const checklist = [
    { label: "Definir seu nome", done: !!app.name },
    { label: "Montar o círculo", done: app.contacts.length > 0 },
    { label: "Ativar a malha", done: app.mesh === "on" },
    { label: "Autorizar localização", done: app.location },
  ];
  return (
    <Screen title="Doomsday" right={<Link to="/ajustes" aria-label="Ajustes" className="flex size-12 items-center justify-center rounded-xl active:bg-muted"><Settings className="size-6" /></Link>}>
      {!app.name && (
        <Card>
          <p className="text-lg font-bold">Como sua família vai te reconhecer?</p>
          <Field placeholder="Seu nome ou apelido" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <Button tone="info" disabled={!draft.trim()} onClick={() => app.setName(draft.trim())}>Salvar</Button>
          <p className="text-sm text-muted-foreground">Sem cadastro, sem e-mail, sem telefone. Sua identidade fica só neste aparelho.</p>
        </Card>
      )}

      <MeshCard />

      {app.lastStatus && (
        <div className="flex items-center gap-2 rounded-xl bg-safe-soft px-4 py-3 text-safe"><Check className="size-5" /><span className="font-bold">{app.lastStatus}</span></div>
      )}

      <Field label="Recado (opcional)" placeholder="Onde estou, do que preciso" value={note} onChange={(e) => setNote(e.target.value)} />
      <Button tone="safe" size="xl" icon={CheckCircle2} onClick={() => app.setLastStatus(`"Estou seguro" enviado ao círculo (${app.contacts.length} pessoas)`)}>ESTOU SEGURO</Button>
      <div className="flex gap-3">
        <Button tone="warn" size="lg" icon={HandHelping} className="text-base leading-tight" onClick={() => app.setLastStatus("Pedido de ajuda enviado ao seu círculo")}>Preciso de ajuda (círculo)</Button>
        <Button tone="danger" size="lg" icon={Siren} onClick={() => setSos(true)}>SOS público</Button>
      </div>
      <Button tone="ghost" icon={MessageSquareText}>Ainda há sinal fraco? Enviar por SMS</Button>

      <SectionTitle>Alerta oficial</SectionTitle>
      <AlertCard {...mockAlert} />

      <SectionTitle aside={<span className="text-sm text-muted-foreground">{checklist.filter((c) => c.done).length} de 4</span>}>Preparação</SectionTitle>
      <Card>
        {checklist.map((c) => (
          <div key={c.label} className="flex min-h-10 items-center gap-3">
            {c.done ? <CheckCircle2 className="size-6 text-safe" /> : <Circle className="size-6 text-muted-foreground" />}
            <span className={c.done ? "text-muted-foreground line-through" : "font-bold"}>{c.label}</span>
            {c.label.includes("localização") && !c.done && <button onClick={() => app.setLocation(true)} className="ml-auto min-h-10 px-2 font-bold text-info">Autorizar</button>}
          </div>
        ))}
      </Card>

      <Dialog open={sos}>
        <div className="flex size-14 items-center justify-center rounded-full bg-danger-soft"><Siren className="size-7 text-danger" /></div>
        <p className="text-xl font-bold">Enviar SOS público?</p>
        <p className="text-base text-muted-foreground">Todos os aparelhos ao alcance verão seu pedido e sua localização.</p>
        <Button tone="danger" size="lg" onClick={() => { setSos(false); app.setLastStatus("SOS público enviado à malha"); }}>Enviar SOS</Button>
        <Button tone="neutral" onClick={() => setSos(false)}>Cancelar</Button>
      </Dialog>
    </Screen>
  );
}

function MeshCard() {
  const app = useApp();
  if (app.mesh === "off") return (
    <Card>
      <div className="flex items-center gap-3"><Radio className="size-7 text-muted-foreground" /><p className="text-lg font-bold">Malha offline desligada</p></div>
      <p className="text-muted-foreground">Ligue para enviar e repassar mensagens por Bluetooth, sem internet.</p>
      <Button tone="info" size="lg" icon={Radio} onClick={() => app.setMesh("on")}>Ativar malha</Button>
    </Card>
  );
  if (app.mesh === "bt-off" || app.mesh === "denied") return (
    <Card tone="warn">
      <div className="flex items-center gap-3">{app.mesh === "bt-off" ? <BluetoothOff className="size-7 text-warn" /> : <ShieldAlert className="size-7 text-warn" />}<p className="text-lg font-bold">{app.mesh === "bt-off" ? "Bluetooth desligado" : "Permissão negada"}</p></div>
      <p className="text-muted-foreground">{app.mesh === "bt-off" ? "Abra a central de controle do celular e ligue o Bluetooth. A malha volta sozinha." : "Vá em Configurações > Doomsday e permita “Dispositivos por perto”."}</p>
      <Button tone="neutral" onClick={() => app.setMesh("on")}>Tentar de novo</Button>
    </Card>
  );
  return (
    <Card tone="safe">
      <div className="flex items-center justify-between"><Badge tone="safe" icon={Radio}>Ativa</Badge><span className="text-sm text-muted-foreground">Bluetooth</span></div>
      <p className="text-lg font-bold">Procurando pessoas por perto</p>
      <div className="flex gap-2"><Stat value={4} label="por perto" /><Stat value={17} label="carregando" /><Stat value={63} label="repassadas" /></div>
      <Button tone={app.keepAwake ? "warn" : "neutral"} icon={Sun} onClick={() => app.setKeepAwake(!app.keepAwake)}>
        {app.keepAwake ? "Modo emergência ligado" : "Modo emergência: manter tela ligada"}
      </Button>
      <Button tone="ghost" icon={Power} onClick={() => app.setMesh("off")}>Desligar malha</Button>
    </Card>
  );
}
