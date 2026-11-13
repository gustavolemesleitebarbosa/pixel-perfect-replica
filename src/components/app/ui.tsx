import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Home, Users, Megaphone, Building2, ShieldCheck, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "safe" | "danger" | "warn" | "info" | "neutral";

const btnTone: Record<string, string> = {
  safe: "bg-safe text-safe-foreground",
  danger: "bg-danger text-danger-foreground",
  warn: "bg-warn text-warn-foreground",
  info: "bg-info text-info-foreground",
  neutral: "bg-secondary text-secondary-foreground border border-border",
  ghost: "bg-transparent text-muted-foreground underline underline-offset-4",
  outline: "bg-transparent text-foreground border-2 border-border",
};
const btnSize = { md: "min-h-12 px-4 text-base", lg: "min-h-14 px-5 text-lg", xl: "min-h-24 px-6 text-2xl tracking-wide" };

export function Button({ tone = "neutral", size = "md", icon: Icon, className, children, ...p }:
  ButtonHTMLAttributes<HTMLButtonElement> & { tone?: keyof typeof btnTone; size?: keyof typeof btnSize; icon?: LucideIcon }) {
  return (
    <button {...p} className={cn("flex w-full items-center justify-center gap-2 rounded-xl font-bold active:opacity-80 disabled:opacity-40", btnTone[tone], btnSize[size], className)}>
      {Icon && <Icon className={size === "xl" ? "size-8" : "size-5"} strokeWidth={2.5} />}
      {children}
    </button>
  );
}

export function Card({ tone, className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  const border = { safe: "border-safe", danger: "border-danger", warn: "border-warn", info: "border-info", neutral: "border-border" }[tone ?? "neutral"];
  return <div className={cn("flex flex-col gap-3 rounded-2xl border bg-card p-4", border, className)}>{children}</div>;
}

export function Badge({ tone = "neutral", icon: Icon, children }: { tone?: Tone; icon?: LucideIcon; children: ReactNode }) {
  const t = { safe: "bg-safe-soft text-safe", danger: "bg-danger-soft text-danger", warn: "bg-warn-soft text-warn", info: "bg-info-soft text-info", neutral: "bg-muted text-muted-foreground" }[tone];
  return (
    <span className={cn("inline-flex items-center gap-1 self-start rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wider", t)}>
      {Icon && <Icon className="size-3.5" strokeWidth={3} />}{children}
    </span>
  );
}

export function Field({ label, hint, className, ...p }: InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-bold text-muted-foreground">{label}</span>}
      <input {...p} className={cn("min-h-12 rounded-xl border-2 border-input bg-background px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none", className)} />
      {hint && <span className="text-sm text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return <div className="flex items-center justify-between pt-2"><h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{children}</h2>{aside}</div>;
}

export function Empty({ icon: Icon, title, text, children }: { icon: LucideIcon; title: string; text: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border px-6 py-10 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted"><Icon className="size-8 text-muted-foreground" /></div>
      <p className="text-lg font-bold">{title}</p>
      <p className="text-base text-muted-foreground">{text}</p>
      {children}
    </div>
  );
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="flex gap-1 rounded-xl bg-muted p-1">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} className={cn("min-h-12 flex-1 rounded-lg text-base font-bold", value === o.value ? "bg-foreground text-background" : "text-muted-foreground")}>{o.label}</button>
      ))}
    </div>
  );
}

export function Screen({ title, back, right, children, footer, noTabs }: { title: string; back?: boolean; right?: ReactNode; children: ReactNode; footer?: ReactNode; noTabs?: boolean }) {
  const router = useRouter();
  return (
    <div className="flex h-full flex-col">
      <header className="flex min-h-16 items-center gap-2 border-b border-border px-3">
        {back && (
          <button aria-label="Voltar" onClick={() => router.history.back()} className="flex size-12 items-center justify-center rounded-xl active:bg-muted"><ChevronLeft className="size-7" /></button>
        )}
        <h1 className={cn("flex-1 truncate font-bold", back ? "text-xl" : "px-1 text-2xl")}>{title}</h1>
        {right}
      </header>
      <main className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">{children}</main>
      {footer}
      {!noTabs && <TabBar />}
    </div>
  );
}

const tabs = [
  { to: "/", label: "Início", icon: Home },
  { to: "/circulo", label: "Círculo", icon: Users },
  { to: "/mural", label: "Mural", icon: Megaphone },
  { to: "/abrigos", label: "Abrigos", icon: Building2 },
] as const;

export function TabBar() {
  return (
    <nav className="flex border-t border-border bg-card">
      {tabs.map((t) => (
        <Link key={t.to} to={t.to} activeOptions={{ exact: true }} className="flex min-h-16 flex-1 flex-col items-center justify-center gap-1 text-xs font-bold text-muted-foreground data-[status=active]:text-foreground">
          {({ isActive }) => (<><span className={cn("flex h-8 w-14 items-center justify-center rounded-full", isActive && "bg-accent")}><t.icon className="size-6" /></span>{t.label}</>)}
        </Link>
      ))}
    </nav>
  );
}

export function AlertCard({ org, title, text, ago }: { org: string; title: string; text: string; ago: string }) {
  return (
    <Card tone="info">
      <div className="flex items-center justify-between"><Badge tone="info" icon={ShieldCheck}>Verificado</Badge><span className="text-sm text-muted-foreground">{ago}</span></div>
      <p className="text-sm font-bold text-info">{org}</p>
      <p className="text-lg font-bold leading-snug">{title}</p>
      <p className="text-base text-muted-foreground">{text}</p>
    </Card>
  );
}

export function Stat({ value, label }: { value: number | string; label: string }) {
  return <div className="flex flex-1 flex-col items-center rounded-xl bg-muted py-3"><span className="text-2xl font-bold">{value}</span><span className="text-xs text-muted-foreground">{label}</span></div>;
}

export function Dialog({ open, children }: { open: boolean; children: ReactNode }) {
  if (!open) return null;
  return <div className="absolute inset-0 z-50 flex items-end bg-frame/80 p-3"><div className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-popover p-5">{children}</div></div>;
}

export function FakeQR({ seed = "doomsday" }: { seed?: string }) {
  const n = 25; let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const cells: ReactNode[] = [];
  const finder = (x: number, y: number) => { const inF = (fx: number, fy: number) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7; return inF(0, 0) || inF(n - 7, 0) || inF(0, n - 7); };
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    let on: boolean;
    if (finder(x, y)) { const lx = x >= n - 7 ? x - (n - 7) : x; const ly = y >= n - 7 ? y - (n - 7) : y; on = lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4); }
    else { h = (h * 1103515245 + 12345) >>> 0; on = (h >> 16) % 2 === 0; }
    if (on) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />);
  }
  return <div className="rounded-2xl bg-qr-bg p-4"><svg viewBox={`0 0 ${n} ${n}`} className="size-56 fill-qr-fg" shapeRendering="crispEdges">{cells}</svg></div>;
}
