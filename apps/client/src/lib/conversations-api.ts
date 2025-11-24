// apps/client/src/lib/conversations-api.ts
import { API_BASE } from "./keys-api";

// Types for conversation APIs
export type Conversation = { id: string; title: string; canvasId: string | null; createdAt: string; updatedAt: string };
export type Message = {
  id: string;
  nodeId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};
export type ConversationDetail = {
  conversation: Conversation;
  canvas: CanvasSummary;
  nodes: ConversationNode[];
  messages: Message[];
};
export type CanvasSummary = { id: string; title: string; createdAt: string } | null;
export type ConversationNode = {
  id: string;
  label: string;
  provider: string;
  model: string;
  createdAt: string;
  messages: Message[];
};

export async function createConversation(input: { title?: string; canvasId?: string }) {
  const res = await fetch(`${API_BASE}/api/conversations`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as Conversation;
}

export async function listConversations() {
  const res = await fetch(`${API_BASE}/api/conversations`, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as { conversations: Conversation[] };
}

export async function getConversation(id: string, opts?: { nodeId?: string }) {
  const params = new URLSearchParams();
  if (opts?.nodeId) params.set("nodeId", opts.nodeId);
  const res = await fetch(`${API_BASE}/api/conversations/${encodeURIComponent(id)}?${params.toString()}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as { conversation: Conversation; messages: Message[] };
}

export async function appendMessage(
  conversationId: string,
  input: { nodeId: string; role: "user" | "assistant" | "system"; content: string }
) {
  const res = await fetch(`${API_BASE}/api/conversations/${encodeURIComponent(conversationId)}/messages`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as { id: string; nodeId: string; role: string; content: string; createdAt: string };
}

export async function getConversationDetail(id: string, opts?: { nodeId?: string }) {
  const params = new URLSearchParams();
  if (opts?.nodeId) params.set("nodeId", opts.nodeId);
  const query = params.toString();
  const res = await fetch(`${API_BASE}/api/conversations/${id}${query ? `?${query}` : ""}`, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as ConversationDetail;
}

export async function updateConversationTitle(id: string, title: string) {
  const res = await fetch(`${API_BASE}/api/conversations/${encodeURIComponent(id)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as Conversation;
}

export async function deleteConversation(id: string) {
  const res = await fetch(`${API_BASE}/api/conversations/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok && res.status !== 204) throw new Error(await res.text());
}
