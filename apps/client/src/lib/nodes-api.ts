// apps/client/src/lib/nodes-api.ts
import { responseToError } from "./error";
import { API_BASE } from "./keys-api";

// Types for node APIs
export type Node = {
  id: string;
  label: string;
  provider: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  messages?: { role: "user" | "assistant" | "system"; content: string }[];
};
export type Message = {
  id: string;
  nodeId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};
export type NodeDetail = {
  node: Node;
  messages: Message[];
};
export type CanvasSummary = { id: string; title: string; createdAt: string } | null;
// export type NodeSummary = {
//   id: string;
//   label: string;
//   provider: string;
//   model: string;
//   createdAt: string;
//   messages: Message[];
// };

export class ApiError extends Error {
  public status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function createNode(input: { label?: string; canvasId?: string; provider?: string; model?: string }) {
  const res = await fetch(`${API_BASE}/api/nodes`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw await responseToError(res);
  return (await res.json()) as Node;
}

export async function listNodes() {
  const res = await fetch(`${API_BASE}/api/nodes`, { credentials: "include" });
  if (!res.ok) throw await responseToError(res);
  return (await res.json()) as { nodes: Node[] };
}

export async function getNode(id: string, opts?: { nodeId?: string }) {
  const params = new URLSearchParams();
  if (opts?.nodeId) params.set("nodeId", opts.nodeId);
  const res = await fetch(`${API_BASE}/api/nodes/${encodeURIComponent(id)}?${params.toString()}`, {
    credentials: "include",
  });
  if (!res.ok) throw await responseToError(res);
  return (await res.json()) as { node: Node; messages: Message[] };
}

export async function appendMessage(nodeId: string, input: { role: "user" | "assistant" | "system"; content: string }) {
  const res = await fetch(`${API_BASE}/api/nodes/${encodeURIComponent(nodeId)}/messages`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw await responseToError(res);
  return (await res.json()) as { id: string; nodeId: string; role: string; content: string; createdAt: string };
}

export async function getNodeDetail(id: string, opts?: { nodeId?: string }) {
  const params = new URLSearchParams();
  if (opts?.nodeId) params.set("nodeId", opts.nodeId);
  const query = params.toString();
  const res = await fetch(`${API_BASE}/api/nodes/${id}${query ? `?${query}` : ""}`, { credentials: "include" });
  if (!res.ok) throw await responseToError(res);
  return (await res.json()) as NodeDetail;
}

// TODO: Update title on the ChatNode
// export async function updateNodeTitle(id: string, title: string) {
//     const res = await fetch(`${API_BASE}/api/nodes/${encodeURIComponent(id)}`, {
//         method: "PATCH",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title }),
//     });
//     if (!res.ok) throw await responseToError(res);
//     return (await res.json()) as Node;
// }

export async function deleteNode(id: string) {
  const res = await fetch(`${API_BASE}/api/nodes/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok && res.status !== 204) throw await responseToError(res);
}
