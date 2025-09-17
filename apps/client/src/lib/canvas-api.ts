// apps/client/src/lib/canvas-api.ts
import { API_BASE } from './keys-api';

export async function createCanvas(input?: { title?: string }) {
    const res = await fetch(`${API_BASE}/api/canvas`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input ?? {}),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json() as { id: string; title: string; createdAt: string };
}

export async function createNode(canvasId: string, input: { label?: string; provider: string; model: string }) {
    const res = await fetch(`${API_BASE}/api/canvas/${encodeURIComponent(canvasId)}/nodes`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json() as { id: string; label: string; provider: string; model: string; createdAt: string };
}