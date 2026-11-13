import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Map, Megaphone, Siren, HandHelping, Gift } from "lucide-react";
import { Badge, Button, Card, Empty, Screen, Segmented, SectionTitle } from "@/components/app/ui";
import { useApp } from "@/components/app/store";
import type { Post } from "@/data/mocks";

export const Route = createFileRoute("/mural")({
  head: () => ({ meta: [
    { title: "Mural — Doomsday" },
    { name: "description", content: "Pedidos e ofertas públicas de quem está por perto." },
    { property: "og:title", content: "Mural — Doomsday" },
    { property: "og:description", content: "Pedidos e ofertas públicas de quem está por perto." },
  ] }),
  component: Wall,
});

const meta = {
  sos: { tone: "danger" as const, label: "SOS", icon: Siren },
  need: { tone: "warn" as const, label: "Pedido", icon: HandHelping },
  offer: { tone: "safe" as const, label: "Oferta", icon: Gift },
};

function Wall() {
  const app = useApp();
  const [kind, setKind] = useState<"need" | "offer">("need");
  const [text, setText] = useState("");
  const [loc, setLoc] = useState(true);
  const posts = [...app.posts].sort((a, b) => Number(b.kind === "sos") - Number(a.kind === "sos"));
  return (
    <Screen title="Mural">
      <p className="text-muted-foreground">Pedidos e ofertas de quem está por perto. Tudo aqui é público.</p>
      <Card>
        <Segmented value={kind} onChange={setKind} options={[{ value: "need", label: "Preciso" }, { value: "offer", label: "Ofereço" }]} />
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder={kind === "need" ? "Do que você precisa?" : "O que você pode oferecer?"} className="rounded-xl border-2 border-input bg-background p-4 text-base placeholder:text-muted-foreground focus:border-ring focus:outline-none" />
        <label className="flex min-h-12 items-center gap-3"><input type="checkbox" checked={loc} onChange={(e) => setLoc(e.target.checked)} className="size-6 accent-info" /><MapPin className="size-5 text-muted-foreground" />Incluir minha localização</label>
        <Button tone={kind === "need" ? "warn" : "safe"} disabled={!text.trim()} onClick={() => { app.addPost({ id: String(Date.now()), kind, author: app.name || "Você", ago: "agora", text: text.trim(), distance: loc ? "aqui" : "local não informado" }); setText(""); }}>Publicar</Button>
      </Card>
      <SectionTitle>Publicações por perto</SectionTitle>
      {posts.length === 0 ? <Empty icon={Megaphone} title="Nada por aqui ainda" text="Quando alguém por perto pedir ou oferecer ajuda, aparece aqui. Seja o primeiro." /> : posts.map((p) => <PostItem key={p.id} p={p} />)}
    </Screen>
  );
}

function PostItem({ p }: { p: Post }) {
  const m = meta[p.kind];
  const sos = p.kind === "sos";
  return (
    <Card tone={sos ? "danger" : "neutral"} className={sos ? "border-2 bg-danger-soft" : ""}>
      <div className="flex items-center justify-between"><Badge tone={m.tone} icon={m.icon}>{m.label}</Badge><span className="text-sm text-muted-foreground">{p.ago}</span></div>
      <p className="text-sm font-bold text-muted-foreground">{p.author}</p>
      <p className={sos ? "text-lg font-bold" : "text-base"}>{p.text}</p>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-4" />{p.distance}</span>
        <Button tone={sos ? "danger" : "outline"} icon={Map} className="w-auto">Ver no mapa</Button>
      </div>
    </Card>
  );
}
