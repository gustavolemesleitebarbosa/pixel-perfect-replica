import { createContext, useContext, useState, type ReactNode } from "react";
import { mockContacts, mockConversations, mockPendingRequest, mockPosts, type Contact, type Msg, type Post } from "@/data/mocks";

export type Mesh = "off" | "on" | "bt-off" | "denied";
type State = {
  name: string; setName: (v: string) => void;
  mesh: Mesh; setMesh: (v: Mesh) => void;
  keepAwake: boolean; setKeepAwake: (v: boolean) => void;
  authority: boolean; setAuthority: (v: boolean) => void;
  location: boolean; setLocation: (v: boolean) => void;
  contacts: Contact[]; setContacts: (v: Contact[]) => void;
  pending: typeof mockPendingRequest | null; setPending: (v: typeof mockPendingRequest | null) => void;
  convos: Record<string, Msg[]>; send: (id: string, m: Msg) => void;
  posts: Post[]; addPost: (p: Post) => void;
  lastStatus: string | null; setLastStatus: (v: string | null) => void;
};
const Ctx = createContext<State | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState("");
  const [mesh, setMesh] = useState<Mesh>("on");
  const [keepAwake, setKeepAwake] = useState(false);
  const [authority, setAuthority] = useState(false);
  const [location, setLocation] = useState(false);
  const [contacts, setContacts] = useState(mockContacts);
  const [pending, setPending] = useState<typeof mockPendingRequest | null>(mockPendingRequest);
  const [convos, setConvos] = useState(mockConversations);
  const [posts, setPosts] = useState(mockPosts);
  const [lastStatus, setLastStatus] = useState<string | null>(null);
  const send = (id: string, m: Msg) => setConvos((c) => ({ ...c, [id]: [...(c[id] ?? []), m] }));
  const addPost = (p: Post) => setPosts((ps) => [p, ...ps]);
  return (
    <Ctx.Provider value={{ name, setName, mesh, setMesh, keepAwake, setKeepAwake, authority, setAuthority, location, setLocation, contacts, setContacts, pending, setPending, convos, send, posts, addPost, lastStatus, setLastStatus }}>
      {children}
    </Ctx.Provider>
  );
}
export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp fora do AppProvider");
  return v;
}
