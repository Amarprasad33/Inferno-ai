// apps/client/src/lib/canvas-api.ts
import { responseToError } from "./error";
import { API_BASE } from "./keys-api";
import type { Node } from "./nodes-api";

export type Canvas = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type CanvasDetail = {
  canvas: Canvas;
  nodes: Node[];
};

export async function createCanvas(input?: { title?: string }) {
  const res = await fetch(`${API_BASE}/api/canvas`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input ?? {}),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as Canvas;
}

export async function listCanvases() {
  const res = await fetch(`${API_BASE}/api/canvas`, { credentials: "include" });
  console.log("res", res);
  if (!res.ok) throw await responseToError(res);
  return (await res.json()) as { canvases: Canvas[] };
}

export async function getCanvas(id: string) {
  const res = await fetch(`${API_BASE}/api/canvas/${encodeURIComponent(id)}`, { credentials: "include" });
  if (!res.ok) throw await responseToError(res);
  return (await res.json()) as CanvasDetail;
}

export async function deleteCanvas(id: string) {
  const res = await fetch(`${API_BASE}/api/canvas/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok && res.status !== 204) throw await responseToError(res);
}

export async function updateCanvasTitle(id: string, title: string) {
  const res = await fetch(`${API_BASE}/api/canvas/${encodeURIComponent(id)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw await responseToError(res);
  return (await res.json()) as Canvas;
}

export async function createNode(canvasId: string, input: { label?: string; provider: string; model: string }) {
  const res = await fetch(`${API_BASE}/api/canvas/${encodeURIComponent(canvasId)}/nodes`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw await responseToError(res);
  return (await res.json()) as { id: string; label: string; provider: string; model: string; createdAt: string };
}
