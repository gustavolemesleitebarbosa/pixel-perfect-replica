// Fonte única de dados fictícios do Doomsday.
export type Status = "safe" | "help" | "none";
export type Contact = { id: string; name: string; status: Status; ago: string; note?: string; unread: number };
export type Msg =
  | { id: string; dir: "in" | "out"; kind: "text"; text: string; time: string; receipt?: "mesh" | "delivered" }
  | { id: string; dir: "in" | "out"; kind: "safe" | "help"; note?: string; time: string; receipt?: "mesh" | "delivered" };
export type PostKind = "sos" | "need" | "offer";
export type Post = { id: string; kind: PostKind; author: string; ago: string; text: string; distance: string };
export type ShelterState = "open" | "full" | "closed";
export type Shelter = {
  id: string; name: string; address: string; state: ShelterState; official: boolean;
  spots: number; capacity: number; distance: string; notes?: string; updated: string;
};
export type Alert = { id: string; org: string; title: string; text: string; ago: string };

export const mockUser = {
  securityCode: "57a4 51ee 34db 285f",
  recoveryCode: "K7QM-2XWD-9FHT-LP4R-8ZNB-C3VE-MY6J-T2QA",
};

export const mockContacts: Contact[] = [
  { id: "ana", name: "Ana (mãe)", status: "safe", ago: "há 12 min", note: "Estou na casa da tia Rosa, tudo bem.", unread: 2 },
  { id: "joao", name: "João", status: "help", ago: "há 40 min", note: "Água subindo na rua Bento. Estou no 2º andar.", unread: 1 },
  { id: "lucia", name: "Lúcia", status: "none", ago: "", unread: 0 },
];

export const mockPendingRequest = { id: "req1", name: "Carlos Vizinho", code: "a91c 0e7f 22bd 6c14" };

export const mockConversations: Record<string, Msg[]> = {
  ana: [
    { id: "1", dir: "in", kind: "text", text: "Filho, você está bem? A chuva não para aqui.", time: "08:12" },
    { id: "2", dir: "out", kind: "safe", note: "Em casa, sem água na rua por enquanto.", time: "08:20", receipt: "delivered" },
    { id: "3", dir: "in", kind: "safe", note: "Estou na casa da tia Rosa, tudo bem.", time: "09:05" },
    { id: "4", dir: "out", kind: "text", text: "Que bom! Fica aí até a Defesa Civil liberar.", time: "09:07", receipt: "delivered" },
    { id: "5", dir: "out", kind: "text", text: "Vou tentar passar aí à tarde.", time: "09:08", receipt: "mesh" },
  ],
  joao: [
    { id: "1", dir: "in", kind: "help", note: "Água subindo na rua Bento. Estou no 2º andar.", time: "10:31" },
    { id: "2", dir: "out", kind: "text", text: "Avisei os bombeiros. Fica no alto!", time: "10:35", receipt: "mesh" },
  ],
  lucia: [],
};

export const mockPosts: Post[] = [
  { id: "p1", kind: "need", author: "Marta", ago: "há 5 min", text: "Preciso de fraldas tamanho G e água potável.", distance: "a 350 m" },
  { id: "p2", kind: "offer", author: "Pedro", ago: "há 18 min", text: "Tenho barco pequeno, posso levar 3 pessoas até a escola.", distance: "a 1,2 km" },
  { id: "p3", kind: "sos", author: "Família Souza", ago: "há 2 min", text: "Idosa acamada presa em casa, água na altura da janela. Rua das Flores, 120.", distance: "a 600 m" },
  { id: "p4", kind: "offer", author: "Igreja São José", ago: "há 1 h", text: "Distribuindo marmitas até 14h no salão.", distance: "a 900 m" },
  { id: "p5", kind: "need", author: "Rafael", ago: "há 25 min", text: "Remédio para pressão (losartana). Alguém tem?", distance: "a 2 km" },
];

export const mockAlert: Alert = {
  id: "a1",
  org: "Defesa Civil de Porto Alegre",
  title: "Evacuação imediata: bairros Sarandi e Humaitá",
  text: "Nível do rio acima da cota de inundação. Dirija-se ao abrigo mais próximo e leve documentos e remédios.",
  ago: "há 20 min",
};

export const mockShelters: Shelter[] = [
  { id: "s1", name: "Escola Estadual Rio Branco", address: "Av. Assis Brasil, 1500", state: "open", official: true, spots: 35, capacity: 80, distance: "a 800 m", notes: "Aceita animais de estimação.", updated: "Atualizado há 2 h" },
  { id: "s2", name: "Ginásio Municipal Tesourinha", address: "Av. Érico Veríssimo, 100", state: "full", official: true, spots: 0, capacity: 200, distance: "a 2,4 km", notes: "Encaminhando para o Ginásio da PUC.", updated: "Atualizado há 30 min" },
  { id: "s3", name: "Paróquia Santa Rita", address: "Rua Dom Pedro II, 45", state: "open", official: false, spots: 12, capacity: 30, distance: "a 1,1 km", updated: "Atualizado há 4 h" },
  { id: "s4", name: "CTG Lanceiros", address: "Rua Voluntários, 300", state: "closed", official: false, spots: 0, capacity: 60, distance: "a 3 km", notes: "Área alagada. Não vá.", updated: "Atualizado há 1 h" },
];
