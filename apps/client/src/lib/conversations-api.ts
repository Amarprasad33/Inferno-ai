// apps/client/src/lib/conversations-api.ts
import { API_BASE } from './keys-api';

export type Conversation = { id: string; title: string; canvasId: string | null; createdAt: string; updatedAt: string };
export type Message = { id: string; nodeId: string; role: 'user' | 'assistant' | 'system'; content: string; createdAt: string };

export async function createConversation(input: { title?: string; canvasId?: string }) {
    const res = await fetch(`${API_BASE}/api/conversations`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as Conversation;
}

export async function listConversations() {
    const res = await fetch(`${API_BASE}/api/conversations`, { credentials: 'include' });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as { conversations: Conversation[] };
}

export async function getConversation(id: string, opts?: { nodeId?: string }) {
    const params = new URLSearchParams();
    if (opts?.nodeId) params.set('nodeId', opts.nodeId);
    const res = await fetch(`${API_BASE}/api/conversations/${encodeURIComponent(id)}?${params.toString()}`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as { conversation: Conversation; messages: Message[] };
}

export async function appendMessage(conversationId: string, input: { nodeId: string; role: 'user' | 'assistant' | 'system'; content: string }) {
    const res = await fetch(`${API_BASE}/api/conversations/${encodeURIComponent(conversationId)}/messages`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as { id: string; nodeId: string; role: string; content: string; createdAt: string };
}