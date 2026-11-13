import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navigation, Locate, Info, MapPin, Clock, BadgeCheck } from "lucide-react";
import { AlertCard, Badge, Button, Card, Screen, SectionTitle } from "@/components/app/ui";
import { mockAlert, mockShelters, type Shelter } from "@/data/mocks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/abrigos")({
  head: () => ({ meta: [
    { title: "Abrigos — Doomsday" },
    { name: "description", content: "Abrigos próximos, vagas e alertas oficiais." },
    { property: "og:title", content: "Abrigos — Doomsday" },
    { property: "og:description", content: "Abrigos próximos, vagas e alertas oficiais." },
  ] }),
  component: Shelters,
});

const st = { open: { tone: "safe" as const, label: "Aberto" }, full: { tone: "warn" as const, label: "Lotado" }, closed: { tone: "danger" as const, label: "Fechado" } };
const km = (d: string) => { const n = parseFloat(d.replace("a ", "").replace(",", ".")); return d.includes("km") ? n * 1000 : n; };

function Shelters() {
  const [sorted, setSorted] = useState(false);
  const list = sorted ? [...mockShelters].sort((a, b) => km(a.distance) - km(b.distance)) : mockShelters;
  return (
    <Screen title="Abrigos">
      <SectionTitle>Alertas oficiais</SectionTitle>
      <AlertCard {...mockAlert} />
      <SectionTitle>Abrigos</SectionTitle>
      <div className="flex gap-2 rounded-xl bg-warn-soft p-3 text-sm text-warn"><Info className="size-5 shrink-0" />Alguns abrigos são de exemplo e ainda não foram confirmados por um órgão oficial.</div>
      <Button tone={sorted ? "info" : "neutral"} icon={Locate} onClick={() => setSorted(!sorted)}>{sorted ? "Ordenado por distância" : "Ordenar por distância (usar meu GPS)"}</Button>
      {list.map((s) => <ShelterCard key={s.id} s={s} />)}
    </Screen>
  );
}

function ShelterCard({ s }: { s: Shelter }) {
  const used = s.capacity - s.spots;
  const pct = Math.round((used / s.capacity) * 100);
  return (
    <Card tone={s.state === "closed" ? "danger" : "neutral"}>
      <div className="flex gap-2"><Badge tone={st[s.state].tone}>{st[s.state].label}</Badge>{s.official ? <Badge tone="info" icon={BadgeCheck}>Oficial</Badge> : <Badge>Exemplo</Badge>}</div>
      <p className="text-lg font-bold leading-snug">{s.name}</p>
      <p className="flex items-center gap-1 text-muted-foreground"><MapPin className="size-4" />{s.address} · {s.distance}</p>
      <div className="flex flex-col gap-1.5">
        <span className="font-bold">Vagas: {s.spots} de {s.capacity}</span>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted"><div className={cn("h-full rounded-full", s.state === "open" ? "bg-safe" : s.state === "full" ? "bg-warn" : "bg-danger")} style={{ width: `${pct}%` }} /></div>
      </div>
      {s.notes && <p className="text-base">{s.notes}</p>}
      <p className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="size-4" />{s.updated}</p>
      <Button tone={s.state === "closed" ? "neutral" : "info"} icon={Navigation} disabled={s.state === "closed"}>Como chegar</Button>
    </Card>
  );
}
